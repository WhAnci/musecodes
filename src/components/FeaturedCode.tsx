import type { ReferralCodeWithStats } from "@/lib/types";
import { formatRelativeTime } from "@/lib/format";
import { CopyButton } from "./CopyButton";
import { OpenMuseButton } from "./OpenMuseButton";

interface FeaturedCodeProps {
  code: ReferralCodeWithStats;
}

export function FeaturedCode({ code }: FeaturedCodeProps) {
  return (
    <section className="rounded-xl border-2 border-amber-200 bg-amber-50/50 p-6">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
          Featured / Site Owner Code
        </span>
      </div>

      <p className="mb-4 text-sm text-amber-800/80">
        This placement is reserved for the site owner and is not part of
        community ranking.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-medium text-slate-600">
            Featured Code
          </p>
          <p className="font-mono text-3xl font-bold tracking-widest text-slate-900">
            {code.code}
          </p>
          <p className="mt-1 text-xs text-slate-500">Site Owner</p>
        </div>
        <div className="flex gap-2">
          <CopyButton code={code.code} label="Copy Code" />
          <OpenMuseButton />
        </div>
      </div>

      <div className="mt-4 border-t border-amber-200/60 pt-4 text-sm text-slate-600">
        <p>
          Worked: <span className="font-medium">{code.worked_count}</span>
          {" · "}
          Didn&apos;t work:{" "}
          <span className="font-medium">{code.failed_count}</span>
        </p>
        <p className="mt-1 text-slate-500">
          Last confirmed working:{" "}
          {formatRelativeTime(code.last_worked_at)}
        </p>
      </div>
    </section>
  );
}
