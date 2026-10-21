/**
 * Converts arbitrary text into a URL-friendly slug.
 * Accents are stripped, everything outside [a-z0-9] becomes a dash,
 * and the result is capped at 200 characters.
 * Returns an empty string when the input has no alphanumeric characters.
 */
export function toSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200)
    .replace(/-+$/g, "");
}
