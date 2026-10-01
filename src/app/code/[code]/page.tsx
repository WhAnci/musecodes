import { notFound } from "next/navigation";
import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { OpenMuseButton } from "@/components/OpenMuseButton";
import { FeedbackButtons } from "@/components/FeedbackButtons";
import { getCodeByCode } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { deriveStatus, STATUS_LABELS, STATUS_STYLES } from "@/lib/status";
import { formatDate, formatRelativeTime, FEEDBACK_LABELS } from "@/lib/format";
import { isValidCode, normalizeCode } from "@/lib/validation";
import type { FeedbackEntry } from "@/lib/types";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface CodePageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({
  params,
}: CodePageProps): Promise<Metadata> {
  const { code } = await params;
  const normalized = normalizeCode(code);
  return {
    title: isValidCode(normalized) ? `Code ${normalized}` : "Code Not Found",
  };
}

async function getRecentFeedback(
  referralCodeId: string,
): Promise<FeedbackEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("feedback")
    .select("id, result, created_at")
    .eq("referral_code_id", referralCodeId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) return [];
  return (data ?? []) as FeedbackEntry[];
}

export default async function CodePage({ params }: CodePageProps) {
  const { code: rawCode } = await params;
  const code = normalizeCode(rawCode);

  if (!isValidCode(code)) {
    notFound();
  }

  const referralCode = await getCodeByCode(code);

  if (!referralCode) {
    notFound();
  }

  const status = deriveStatus(referralCode);
  const recentFeedback = await getRecentFeedback(referralCode.id);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-slate-500 hover:text-slate-700"
      >
        ← All codes
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Muse Referral Code</p>

        {referralCode.is_featured && (
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
            Featured / Site Owner Code
          </p>
        )}

        <h1 className="mt-2 font-mono text-4xl font-bold tracking-widest text-slate-900">
          {referralCode.code}
        </h1>

        <div className="mt-4">
          <p className="text-sm text-slate-500">Status</p>
          <span
            className={`mt-1 inline-block rounded-md border px-2.5 py-1 text-sm font-semibold ${STATUS_STYLES[status]}`}
          >
            {STATUS_LABELS[status]}
          </span>
        </div>

        <div className="mt-4 space-y-1 text-sm text-slate-600">
          <p>
            <span className="font-medium text-emerald-600">
              {referralCode.worked_count}
            </span>{" "}
            successful reports
          </p>
          <p>
            <span className="font-medium text-red-500">
              {referralCode.failed_count}
            </span>{" "}
            unsuccessful reports
          </p>
          {referralCode.last_worked_at && (
            <p className="text-slate-500">
              Last confirmed working:{" "}
              {formatDate(referralCode.last_worked_at)}
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <CopyButton code={referralCode.code} label="Copy Code" />
          <OpenMuseButton />
        </div>

        <div className="mt-6 border-t border-slate-100 pt-6">
          <FeedbackButtons code={referralCode.code} />
        </div>
      </div>

      {recentFeedback.length > 0 && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">
            Recent Feedback
          </h2>
          <ul className="space-y-2">
            {recentFeedback.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between text-sm text-slate-600"
              >
                <span>{FEEDBACK_LABELS[entry.result]}</span>
                <span className="text-slate-400">
                  {formatRelativeTime(entry.created_at)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
