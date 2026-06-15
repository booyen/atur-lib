import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { sectionFrontmatterSchema, type Section } from "./schema";

const SECTIONS_DIR = path.join(process.cwd(), "content", "sections");

/**
 * Reads, parses and validates every section file once. Throws at build time if a
 * file has invalid frontmatter, naming the file so the error is actionable.
 */
function loadSections(): Section[] {
  if (!fs.existsSync(SECTIONS_DIR)) return [];

  const files = fs
    .readdirSync(SECTIONS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md") || f.endsWith(".html"));

  const sections = files.map((file) => {
    const raw = fs.readFileSync(path.join(SECTIONS_DIR, file), "utf8");
    const { data, content } = matter(raw);

    const parsed = sectionFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      const details = parsed.error.issues
        .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("\n");
      throw new Error(`Invalid frontmatter in content/sections/${file}:\n${details}`);
    }

    return { ...parsed.data, html: content.trim() } satisfies Section;
  });

  // Stable ordering: by category, then explicit `order`, then title.
  return sections.sort(
    (a, b) =>
      a.category.localeCompare(b.category) ||
      (a.order ?? Infinity) - (b.order ?? Infinity) ||
      a.title.localeCompare(b.title),
  );
}

let cache: Section[] | null = null;
function all(): Section[] {
  if (cache === null) cache = loadSections();
  return cache;
}

/** Every section, sorted. */
export function getAllSections(): Section[] {
  return all();
}

/** A single section by slug, or undefined if not found. */
export function getSectionBySlug(slug: string): Section | undefined {
  return all().find((s) => s.slug === slug);
}

/** Unique category names, alphabetically sorted. */
export function getCategories(): string[] {
  return [...new Set(all().map((s) => s.category))].sort((a, b) => a.localeCompare(b));
}
