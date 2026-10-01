import { SubmitForm } from "@/components/SubmitForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Your Code",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
        Add Your Code
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Share your Muse referral code with the community. Only 6-character codes
        (A–Z, 0–9) are accepted.
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <SubmitForm />
      </div>
    </div>
  );
}
