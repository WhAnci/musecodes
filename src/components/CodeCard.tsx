import Link from "next/link";
import type { ReferralCodeWithStats } from "@/lib/types";
import { deriveStatus, STATUS_LABELS, STATUS_STYLES } from "@/lib/status";
import { formatRelativeTime } from "@/lib/format";
import { CopyButton } from "./CopyButton";
import { OpenMuseButton } from "./OpenMuseButton";

interface CodeCardProps {
  code: ReferralCodeWithStats;
}

export function CodeCard({ code }: CodeCardProps) {
  const status = deriveStatus(code);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <span
          className={`inline-block rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${STATUS_STYLES[status]}`}
        >
          {STATUS_LABELS[status]}
        </span>
        {code.display_name && (
          <span className="text-xs text-slate-500">{code.display_name}</span>
        )}
      </div>

      <Link
        href={`/code/${code.code}`}
        className="font-mono text-2xl font-bold tracking-widest text-slate-900 hover:text-slate-700"
      >
        {code.code}
      </Link>

      <div className="mt-3 space-y-1 text-sm text-slate-600">
        <p>
          <span className="text-emerald-600">✓</span>{" "}
          {code.worked_count} {code.worked_count === 1 ? "person" : "people"}{" "}
          said it worked
        </p>
        <p>
          <span className="text-red-500">✕</span>{" "}
          {code.failed_count} {code.failed_count === 1 ? "person" : "people"}{" "}
          said it didn&apos;t work
        </p>
        <p className="text-slate-500">
          Last confirmed working:{" "}
          {formatRelativeTime(code.last_worked_at)}
        </p>
        <p className="text-xs text-slate-400">
          Submitted {formatRelativeTime(code.created_at)}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <CopyButton code={code.code} />
        <OpenMuseButton />
      </div>
    </article>
  );
}
