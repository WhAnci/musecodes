"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CODE_VALIDATION_MESSAGE } from "@/lib/validation";

export function SubmitForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, displayName }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message ?? "Code added successfully.");
        setTimeout(() => router.push(`/code/${data.code}`), 1500);
      } else {
        setError(data.error ?? "Something went wrong.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="code"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Referral Code
        </label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={6}
          required
          placeholder="ABC123"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-mono text-lg uppercase tracking-widest focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
        />
        <p className="mt-1.5 text-sm text-slate-500">
          Enter your 6-character Muse referral code.
        </p>
      </div>

      <div>
        <label
          htmlFor="displayName"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Display Name{" "}
          <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          maxLength={50}
          placeholder="Your name or nickname"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error === "Referral codes must contain exactly 6 letters or numbers."
            ? CODE_VALIDATION_MESSAGE
            : error}
        </p>
      )}

      {success && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
      >
        {loading ? "Submitting..." : "Submit Code"}
      </button>
    </form>
  );
}
