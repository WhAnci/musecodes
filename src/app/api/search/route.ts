import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deriveStatus } from "@/lib/status";
import { isValidCode, normalizeCode } from "@/lib/validation";
import type { ReferralCodeWithStats } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("q") ?? "";
  const code = normalizeCode(raw);

  if (!code) {
    return NextResponse.json({ found: false, error: "Enter a code to search." });
  }

  if (!isValidCode(code)) {
    return NextResponse.json({
      found: false,
      error: "Referral codes must contain exactly 6 letters or numbers.",
    });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("referral_codes_with_stats")
    .select("*")
    .eq("code", code)
    .eq("is_hidden", false)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { found: false, error: "Search failed." },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({ found: false, code });
  }

  const stats = data as ReferralCodeWithStats;

  return NextResponse.json({
    found: true,
    code: stats.code,
    status: deriveStatus(stats),
    worked_count: stats.worked_count,
    failed_count: stats.failed_count,
    last_worked_at: stats.last_worked_at,
    is_featured: stats.is_featured,
    url: `/code/${stats.code}`,
  });
}
