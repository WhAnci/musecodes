import { MUSE_APP_URL } from "@/lib/validation";

interface OpenMuseButtonProps {
  className?: string;
}

export function OpenMuseButton({ className = "" }: OpenMuseButtonProps) {
  return (
    <a
      href={MUSE_APP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors ${className}`}
    >
      Open Muse
    </a>
  );
}
