export type FeedbackResult = "worked" | "failed" | "ineligible" | "invalid";

export type CodeStatus =
  | "working"
  | "mixed"
  | "possibly_invalid"
  | "unverified";

export type SortOption =
  | "recently_verified"
  | "most_successful"
  | "newest"
  | "random";

export interface ReferralCodeWithStats {
  id: string;
  code: string;
  display_name: string | null;
  created_at: string;
  is_featured: boolean;
  is_hidden: boolean;
  worked_count: number;
  failed_count: number;
  ineligible_count: number;
  invalid_count: number;
  last_worked_at: string | null;
  recent_worked: number;
  recent_failed: number;
  total_feedback: number;
}

export interface FeedbackEntry {
  id: string;
  result: FeedbackResult;
  created_at: string;
}

export interface SiteStats {
  totalCodes: number;
  verifiedWorkingToday: number;
  feedbackReports: number;
}
