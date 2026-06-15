import { describe, it, expect } from "vitest";
import { sectionFrontmatterSchema } from "./schema";

const valid = {
  title: "Centered Hero",
  slug: "centered-hero",
  category: "Hero",
  tags: ["hero", "cta"],
  copyPrompt: "Make a hero.",
};

describe("sectionFrontmatterSchema", () => {
  it("accepts valid frontmatter", () => {
    const r = sectionFrontmatterSchema.safeParse(valid);
    expect(r.success).toBe(true);
  });

  it("defaults tags to an empty array when omitted", () => {
    const { tags, ...rest } = valid;
    void tags;
    const r = sectionFrontmatterSchema.parse(rest);
    expect(r.tags).toEqual([]);
  });

  it("rejects missing required fields", () => {
    const { copyPrompt, ...rest } = valid;
    void copyPrompt;
    const r = sectionFrontmatterSchema.safeParse(rest);
    expect(r.success).toBe(false);
  });

  it("rejects a non-kebab-case slug", () => {
    const r = sectionFrontmatterSchema.safeParse({ ...valid, slug: "Centered Hero" });
    expect(r.success).toBe(false);
  });

  it("rejects a non-numeric order", () => {
    const r = sectionFrontmatterSchema.safeParse({ ...valid, order: "first" });
    expect(r.success).toBe(false);
  });
});
