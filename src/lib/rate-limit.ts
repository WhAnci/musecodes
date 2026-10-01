import { createAdminClient } from "./supabase/admin";

interface RateLimitConfig {
  maxAttempts: number;
  windowMinutes: number;
}

const LIMITS: Record<string, RateLimitConfig> = {
  submit: { maxAttempts: 5, windowMinutes: 60 },
  feedback: { maxAttempts: 20, windowMinutes: 60 },
};

export async function checkRateLimit(
  key: string,
  action: keyof typeof LIMITS,
): Promise<{ allowed: boolean; retryAfterMinutes?: number }> {
  const config = LIMITS[action];
  const supabase = createAdminClient();
  const windowStart = new Date(
    Date.now() - config.windowMinutes * 60 * 1000,
  ).toISOString();

  const { count, error } = await supabase
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("key", key)
    .eq("action", action)
    .gte("created_at", windowStart);

  if (error) {
    console.error("Rate limit check failed:", error.message);
    return { allowed: true };
  }

  if ((count ?? 0) >= config.maxAttempts) {
    return { allowed: false, retryAfterMinutes: config.windowMinutes };
  }

  return { allowed: true };
}

export async function recordRateLimit(
  key: string,
  action: keyof typeof LIMITS,
): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("rate_limits").insert({ key, action });
}
