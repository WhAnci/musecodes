const CODE_REGEX = /^[A-Z0-9]{6}$/;

export function normalizeCode(input: string): string {
  return input.trim().toUpperCase();
}

export function isValidCode(input: string): boolean {
  return CODE_REGEX.test(normalizeCode(input));
}

export function sanitizeDisplayName(input: string | null | undefined): string | null {
  if (!input?.trim()) return null;
  return input
    .trim()
    .slice(0, 50)
    .replace(/[<>&"']/g, "")
    .replace(/\s+/g, " ");
}

export const CODE_VALIDATION_MESSAGE =
  "Referral codes must contain exactly 6 letters or numbers.";

export const MUSE_APP_URL = "https://www.muse.ai/";
