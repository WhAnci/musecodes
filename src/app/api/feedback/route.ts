import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, recordRateLimit } from "@/lib/rate-limit";
import {
  getClientIp,
  hashIp,
  SESSION_COOKIE,
} from "@/lib/session";
import { isValidCode, normalizeCode } from "@/lib/validation";
import type { FeedbackResult } from "@/lib/types";

const VALID_RESULTS: FeedbackResult[] = [
  "worked",
  "failed",
  "ineligible",
  "invalid",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = normalizeCode(body.code ?? "");
    const result = body.result as FeedbackResult;

    if (!isValidCode(code)) {
      return NextResponse.json({ error: "Invalid code." }, { status: 400 });
    }

    if (!VALID_RESULTS.includes(result)) {
      return NextResponse.json({ error: "Invalid feedback." }, { status: 400 });
    }

    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session required. Please refresh the page." },
        { status: 400 },
      );
    }

    const ip = getClientIp(request);
    const ipHash = hashIp(ip);
    const rateKey = `feedback:${ipHash}`;

    const rateCheck = await checkRateLimit(rateKey, "feedback");
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many feedback submissions. Please try again later." },
        { status: 429 },
      );
    }

    const supabase = createAdminClient();

    const { data: referralCode, error: codeError } = await supabase
      .from("referral_codes")
      .select("id")
      .eq("code", code)
      .eq("is_hidden", false)
      .maybeSingle();

    if (codeError) throw codeError;

    if (!referralCode) {
      return NextResponse.json({ error: "Code not found." }, { status: 404 });
    }

    const { data: existingFeedback } = await supabase
      .from("feedback")
      .select("id, result")
      .eq("referral_code_id", referralCode.id)
      .eq("anonymous_identifier", sessionId)
      .maybeSingle();

    if (existingFeedback) {
      return NextResponse.json(
        {
          error: "You have already submitted feedback for this code.",
          alreadySubmitted: true,
        },
        { status: 409 },
      );
    }

    const { error: insertError } = await supabase.from("feedback").insert({
      referral_code_id: referralCode.id,
      result,
      anonymous_identifier: sessionId,
      ip_hash: ipHash,
    });

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json(
          {
            error: "You have already submitted feedback for this code.",
            alreadySubmitted: true,
          },
          { status: 409 },
        );
      }
      throw insertError;
    }

    await recordRateLimit(rateKey, "feedback");

    return NextResponse.json({
      success: true,
      message: "Thanks for helping verify this code.",
    });
  } catch (err) {
    console.error("Feedback error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
