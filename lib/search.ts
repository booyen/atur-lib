import type { Section } from "./schema";

export type Filterable = Pick<Section, "title" | "tags" | "category" | "description">;

/**
 * Client-side filtering: case-insensitive substring match on title, tags,
 * category and description, composed with an optional exact category filter.
 * Pure and dependency-free so it is trivial to test and cheap to run on input.
 * (Swap in Fuse.js later if fuzzy matching is needed.)
 */
export function filterSections<T extends Filterable>(
  sections: T[],
  query: string,
  category: string | null,
): T[] {
  const q = query.trim().toLowerCase();

  return sections.filter((s) => {
    if (category && s.category !== category) return false;
    if (!q) return true;

    const haystack = [
      s.title,
      s.category,
      s.description ?? "",
      ...s.tags,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}
