import type { SiteStats } from "@/lib/types";

interface StatsBarProps {
  stats: SiteStats;
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="flex flex-wrap gap-6 text-sm text-slate-500">
      <div>
        <span className="font-medium text-slate-700">{stats.totalCodes}</span>{" "}
        Total Codes
      </div>
      <div>
        <span className="font-medium text-slate-700">
          {stats.verifiedWorkingToday}
        </span>{" "}
        Verified Working Today
      </div>
      <div>
        <span className="font-medium text-slate-700">
          {stats.feedbackReports}
        </span>{" "}
        Feedback Reports
      </div>
    </div>
  );
}
