import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, recordRateLimit } from "@/lib/rate-limit";
import { getClientIp, hashIp } from "@/lib/session";
import {
  CODE_VALIDATION_MESSAGE,
  isValidCode,
  normalizeCode,
  sanitizeDisplayName,
} from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = normalizeCode(body.code ?? "");
    const displayName = sanitizeDisplayName(body.displayName);

    if (!isValidCode(code)) {
      return NextResponse.json(
        { error: CODE_VALIDATION_MESSAGE },
        { status: 400 },
      );
    }

    const ip = getClientIp(request);
    const ipHash = hashIp(ip);
    const rateKey = `submit:${ipHash}`;

    const rateCheck = await checkRateLimit(rateKey, "submit");
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 },
      );
    }

    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from("referral_codes")
      .select("id")
      .eq("code", code)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "This code has already been submitted." },
        { status: 409 },
      );
    }

    const { data, error } = await supabase
      .from("referral_codes")
      .insert({
        code,
        display_name: displayName,
        is_featured: false,
        is_hidden: false,
      })
      .select("code")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "This code has already been submitted." },
          { status: 409 },
        );
      }
      throw error;
    }

    await recordRateLimit(rateKey, "submit");

    return NextResponse.json({
      success: true,
      message: "Code added successfully.",
      code: data.code,
    });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
