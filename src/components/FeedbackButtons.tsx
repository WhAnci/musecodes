"use client";

import { useEffect, useState } from "react";
import type { FeedbackResult } from "@/lib/types";

interface FeedbackButtonsProps {
  code: string;
  compact?: boolean;
}

const STORAGE_PREFIX = "muse_feedback_";

export function FeedbackButtons({ code, compact = false }: FeedbackButtonsProps) {
  const [loading, setLoading] = useState<FeedbackResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${code}`);
    if (stored) {
      setAlreadySubmitted(true);
    }
  }, [code]);

  async function submitFeedback(result: FeedbackResult) {
    if (alreadySubmitted || loading) return;

    setLoading(result);
    setMessage(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, result }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem(`${STORAGE_PREFIX}${code}`, result);
        setAlreadySubmitted(true);
        setMessage(data.message ?? "Thanks for helping verify this code.");
      } else if (data.alreadySubmitted) {
        localStorage.setItem(`${STORAGE_PREFIX}${code}`, result);
        setAlreadySubmitted(true);
        setMessage("You have already submitted feedback for this code.");
      } else {
        setMessage(data.error ?? "Something went wrong.");
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  if (alreadySubmitted && !message) {
    return (
      <p className="text-sm text-slate-500">
        You have already submitted feedback for this code.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {!compact && (
        <p className="text-sm font-medium text-slate-700">
          Did this code work for you?
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={alreadySubmitted || !!loading}
          onClick={() => submitFeedback("worked")}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          {loading === "worked" ? "Submitting..." : "Worked"}
        </button>
        <button
          type="button"
          disabled={alreadySubmitted || !!loading}
          onClick={() => submitFeedback("failed")}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          {loading === "failed" ? "Submitting..." : "Didn't Work"}
        </button>
      </div>
      {message && (
        <p className="text-sm text-emerald-700">{message}</p>
      )}
    </div>
  );
}
