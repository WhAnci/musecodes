import type { CodeStatus, ReferralCodeWithStats } from "./types";

export function deriveStatus(code: ReferralCodeWithStats): CodeStatus {
  const { worked_count, failed_count, recent_worked, recent_failed, total_feedback } =
    code;

  if (total_feedback < 3) {
    return "unverified";
  }

  const recentTotal = recent_worked + recent_failed;

  if (recentTotal >= 3) {
    const recentFailRate = recent_failed / recentTotal;
    if (recentFailRate >= 0.75) return "possibly_invalid";
    if (recentFailRate >= 0.35 && recent_worked > 0) return "mixed";
    if (recent_worked > 0) return "working";
  }

  const totalVotes = worked_count + failed_count;
  if (totalVotes === 0) return "unverified";

  const failRate = failed_count / totalVotes;

  if (failRate >= 0.7 && failed_count >= 5) return "possibly_invalid";

  if (worked_count > 0 && failed_count > 0) {
    const minority = Math.min(worked_count, failed_count);
    if (minority / totalVotes >= 0.25) return "mixed";
  }

  if (worked_count > failed_count) return "working";
  if (failed_count > worked_count * 2) return "possibly_invalid";

  return worked_count > 0 ? "working" : "unverified";
}

export const STATUS_LABELS: Record<CodeStatus, string> = {
  working: "Working",
  mixed: "Mixed Results",
  possibly_invalid: "Possibly Invalid",
  unverified: "Unverified",
};

export const STATUS_STYLES: Record<CodeStatus, string> = {
  working: "bg-emerald-50 text-emerald-700 border-emerald-200",
  mixed: "bg-amber-50 text-amber-700 border-amber-200",
  possibly_invalid: "bg-red-50 text-red-700 border-red-200",
  unverified: "bg-slate-50 text-slate-600 border-slate-200",
};
