import { createClient } from "./supabase/server";
import type { ReferralCodeWithStats, SiteStats, SortOption } from "./types";

export async function getFeaturedCode(): Promise<ReferralCodeWithStats | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("referral_codes_with_stats")
    .select("*")
    .eq("is_featured", true)
    .eq("is_hidden", false)
    .maybeSingle();

  if (error) throw error;
  return data as ReferralCodeWithStats | null;
}

export async function getCommunityCodes(
  sort: SortOption = "recently_verified",
): Promise<ReferralCodeWithStats[]> {
  const supabase = await createClient();

  let query = supabase
    .from("referral_codes_with_stats")
    .select("*")
    .eq("is_featured", false)
    .eq("is_hidden", false);

  switch (sort) {
    case "recently_verified":
      query = query.order("last_worked_at", {
        ascending: false,
        nullsFirst: false,
      });
      break;
    case "most_successful":
      query = query.order("worked_count", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "random":
      // Postgres random sort via RPC fallback — fetch all and shuffle client-side in server
      break;
  }

  const { data, error } = await query;
  if (error) throw error;

  const codes = (data ?? []) as ReferralCodeWithStats[];

  if (sort === "random") {
    return shuffle(codes);
  }

  return codes;
}

export async function getCodeByCode(
  code: string,
): Promise<ReferralCodeWithStats | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("referral_codes_with_stats")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_hidden", false)
    .maybeSingle();

  if (error) throw error;
  return data as ReferralCodeWithStats | null;
}

export async function getSiteStats(): Promise<SiteStats> {
  const supabase = await createClient();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [codesResult, feedbackResult, todayWorkedResult] = await Promise.all([
    supabase
      .from("referral_codes")
      .select("*", { count: "exact", head: true })
      .eq("is_hidden", false),
    supabase.from("feedback").select("*", { count: "exact", head: true }),
    supabase
      .from("feedback")
      .select("*", { count: "exact", head: true })
      .eq("result", "worked")
      .gte("created_at", todayStart.toISOString()),
  ]);

  return {
    totalCodes: codesResult.count ?? 0,
    feedbackReports: feedbackResult.count ?? 0,
    verifiedWorkingToday: todayWorkedResult.count ?? 0,
  };
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
