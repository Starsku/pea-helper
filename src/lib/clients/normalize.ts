export function normalizeClientRef(input: string): string {
  return (input || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}
