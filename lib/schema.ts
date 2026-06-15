import { z } from "zod";

/**
 * Schema for the YAML frontmatter of each section file in content/sections/*.mdx.
 * Validated at build time — a missing or malformed field fails the build with a
 * message naming the offending file (see lib/sections.ts).
 */
export const sectionFrontmatterSchema = z.object({
  title: z.string().min(1, "title is required"),
  slug: z
    .string()
    .min(1, "slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case (a-z, 0-9, hyphens)"),
  description: z.string().optional(),
  category: z.string().min(1, "category is required"),
  tags: z.array(z.string()).default([]),
  copyPrompt: z.string().min(1, "copyPrompt is required"),
  order: z.number().optional(),
});

export type SectionFrontmatter = z.infer<typeof sectionFrontmatterSchema>;

/** A fully-loaded section: validated frontmatter plus the raw HTML/Tailwind markup body. */
export type Section = SectionFrontmatter & {
  /** Raw HTML + Tailwind markup that gets previewed and copied. */
  html: string;
};

/** Lightweight metadata shape shipped to the client for search/filtering. */
export type SectionMeta = Omit<Section, "html"> & { html: string };
