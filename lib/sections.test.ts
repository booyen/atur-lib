import { describe, it, expect } from "vitest";
import { getAllSections, getSectionBySlug, getCategories } from "./sections";

describe("section loader", () => {
  it("loads and validates the seeded sections", () => {
    const sections = getAllSections();
    expect(sections.length).toBeGreaterThan(0);
    for (const s of sections) {
      expect(s.title).toBeTruthy();
      expect(s.slug).toMatch(/^[a-z0-9-]+$/);
      expect(s.copyPrompt).toBeTruthy();
      expect(s.html.length).toBeGreaterThan(0);
    }
  });

  it("finds a section by slug", () => {
    const s = getSectionBySlug("centered-hero");
    expect(s?.title).toBe("Centered Hero");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getSectionBySlug("does-not-exist")).toBeUndefined();
  });

  it("returns unique, sorted categories", () => {
    const cats = getCategories();
    expect(new Set(cats).size).toBe(cats.length);
    expect([...cats].sort((a, b) => a.localeCompare(b))).toEqual(cats);
  });
});
