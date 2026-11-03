export function slugify(input: string): string {
  const slug = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || "post";
}

export function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function makeExcerpt(html: string, max = 160): string {
  const text = stripTags(html);
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

export function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata", // the server runs in UTC; show the date as it was in India
  });
}

/** Date for a post card: the last-updated date when the post was edited on a later day, otherwise the publish date. */
export function postCardDate(publishedAt: Date | null | undefined, updatedAt: Date): string {
  const published = formatDate(publishedAt);
  const updated = formatDate(updatedAt);
  if (!published) return updated;
  return publishedAt && updatedAt > publishedAt && updated !== published ? `Updated ${updated}` : published;
}

export function formatMonthYear(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
}
