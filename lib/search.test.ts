import { describe, it, expect } from "vitest";
import { filterSections, type Filterable } from "./search";

const items: Filterable[] = [
  { title: "Centered Hero", category: "Hero", description: "A bold hero", tags: ["cta", "landing"] },
  { title: "Three-Tier Pricing", category: "Pricing", description: "Plans", tags: ["saas", "cards"] },
  { title: "Simple Footer", category: "Footer", description: undefined, tags: ["links"] },
];

describe("filterSections", () => {
  it("returns all items for an empty query and no category", () => {
    expect(filterSections(items, "", null)).toHaveLength(3);
  });

  it("matches on title, case-insensitively", () => {
    const r = filterSections(items, "hero", null);
    expect(r.map((i) => i.title)).toEqual(["Centered Hero"]);
  });

  it("matches on tags", () => {
    const r = filterSections(items, "saas", null);
    expect(r.map((i) => i.title)).toEqual(["Three-Tier Pricing"]);
  });

  it("matches on category text", () => {
    expect(filterSections(items, "footer", null)).toHaveLength(1);
  });

  it("filters by exact category", () => {
    const r = filterSections(items, "", "Pricing");
    expect(r.map((i) => i.title)).toEqual(["Three-Tier Pricing"]);
  });

  it("composes category and query", () => {
    expect(filterSections(items, "hero", "Pricing")).toHaveLength(0);
    expect(filterSections(items, "plans", "Pricing")).toHaveLength(1);
  });

  it("returns nothing for an unmatched query", () => {
    expect(filterSections(items, "zzzz", null)).toHaveLength(0);
  });
});
