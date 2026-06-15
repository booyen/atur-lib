/**
 * Public URL of a section's bare embed page — the one users paste into the
 * html.to.design Figma plugin's "Import from URL". Kept in one place so the URL
 * shape is consistent and testable.
 */
export function embedUrl(origin: string, slug: string): string {
  return `${origin}/embed/${slug}`;
}
