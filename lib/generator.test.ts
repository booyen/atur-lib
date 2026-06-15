import { describe, it, expect } from "vitest";
import type { Section } from "./schema";
import {
  candidatesFor,
  generatePage,
  shuffleSlot,
  buildFromSlugs,
  encodeState,
  decodeState,
  missingRequired,
  pageHtml,
  pagePrompt,
  seededRng,
} from "./generator";
import { getTemplate } from "./pageTemplates";

function section(partial: Partial<Section> & Pick<Section, "slug" | "category">): Section {
  return {
    title: partial.title ?? partial.slug,
    slug: partial.slug,
    category: partial.category,
    tags: partial.tags ?? [],
    copyPrompt: partial.copyPrompt ?? `prompt for ${partial.slug}`,
    pageTypes: partial.pageTypes ?? [],
    html: partial.html ?? `<div>${partial.slug}</div>`,
    weight: partial.weight,
    description: partial.description,
    order: partial.order,
  };
}

const sections: Section[] = [
  section({ slug: "hero-a", category: "Hero", pageTypes: ["marketing", "saas"] }),
  section({ slug: "hero-b", category: "Hero", pageTypes: ["marketing"] }),
  section({ slug: "footer-a", category: "Footer", pageTypes: ["marketing", "saas", "product"] }),
  section({ slug: "cta-a", category: "CTA", pageTypes: ["marketing"] }),
  section({ slug: "pricing-saas", category: "Pricing", pageTypes: ["saas"] }),
];

describe("candidatesFor", () => {
  it("filters by role and page type", () => {
    expect(candidatesFor(sections, "Hero", "marketing").map((s) => s.slug)).toEqual([
      "hero-a",
      "hero-b",
    ]);
    expect(candidatesFor(sections, "Hero", "product")).toEqual([]);
    expect(candidatesFor(sections, "Pricing", "saas").map((s) => s.slug)).toEqual([
      "pricing-saas",
    ]);
  });
});

describe("generatePage", () => {
  it("returns one entry per template slot, in order", () => {
    const slots = generatePage(sections, "marketing", seededRng(1));
    expect(slots.map((s) => s.role)).toEqual(getTemplate("marketing").slots.map((s) => s.role));
  });

  it("only fills slots with a fitting section, leaving others null", () => {
    const slots = generatePage(sections, "marketing", seededRng(1));
    const hero = slots.find((s) => s.role === "Hero")!;
    const navbar = slots.find((s) => s.role === "Navbar")!;
    expect(["hero-a", "hero-b"]).toContain(hero.section?.slug);
    expect(navbar.section).toBeNull();
  });

  it("is deterministic for a given seed", () => {
    const a = generatePage(sections, "marketing", seededRng(42)).map((s) => s.section?.slug);
    const b = generatePage(sections, "marketing", seededRng(42)).map((s) => s.section?.slug);
    expect(a).toEqual(b);
  });
});

describe("shuffleSlot", () => {
  it("picks a different section when alternatives exist", () => {
    const slot = { role: "Hero" as const, required: true, section: sections[0] };
    const next = shuffleSlot(sections, "marketing", slot, seededRng(3));
    expect(next.section?.slug).toBe("hero-b");
  });
});

describe("missingRequired", () => {
  it("reports required roles with no content", () => {
    const slots = generatePage(sections, "marketing", seededRng(1));
    // Navbar and Features are required in the marketing template but unbuilt here.
    expect(missingRequired(slots)).toContain("Navbar");
    expect(missingRequired(slots)).toContain("Features");
  });
});

describe("URL state", () => {
  it("round-trips through encode/decode and rebuilds the same slugs", () => {
    const slots = generatePage(sections, "marketing", seededRng(7));
    const encoded = encodeState("marketing", slots);
    const decoded = decodeState(encoded)!;
    expect(decoded.pageType).toBe("marketing");

    const rebuilt = buildFromSlugs(sections, "marketing", decoded.slugs);
    expect(rebuilt.map((s) => s.section?.slug ?? null)).toEqual(
      slots.map((s) => s.section?.slug ?? null),
    );
  });

  it("returns null for malformed input", () => {
    expect(decodeState("")).toBeNull();
    expect(decodeState("no-separator")).toBeNull();
  });
});

describe("copy helpers", () => {
  it("includes section HTML and placeholder comments in page code", () => {
    const slots = generatePage(sections, "marketing", seededRng(1));
    const html = pageHtml(slots);
    expect(html).toContain("<!-- Navbar: no section yet -->");
    expect(html).toMatch(/hero-(a|b)/);
  });

  it("builds a combined prompt covering every slot", () => {
    const slots = generatePage(sections, "marketing", seededRng(1));
    const prompt = pagePrompt("marketing", slots);
    expect(prompt).toContain("marketing landing page");
    expect(prompt.split("\n").length).toBeGreaterThan(slots.length);
  });
});
