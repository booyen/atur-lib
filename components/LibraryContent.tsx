"use client";

import { useMemo } from "react";
import type { Section } from "@/lib/schema";
import { filterSections } from "@/lib/search";
import { useLibraryFilter } from "./shell/LibraryFilterContext";
import CategoryCarousel from "./CategoryCarousel";
import SectionCard from "./SectionCard";

type Props = {
  sections: Section[];
  categories: string[];
};

export default function LibraryContent({ sections, categories }: Props) {
  const { query, category, isFiltering, reset } = useLibraryFilter();

  const results = useMemo(
    () => filterSections(sections, query, category),
    [sections, query, category],
  );

  if (isFiltering) {
    const heading = category ?? `Results for “${query.trim()}”`;
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            {heading}
            <span className="ml-2 font-mono text-sm font-normal text-muted-foreground">
              {results.length}
            </span>
          </h2>
          <button
            type="button"
            onClick={reset}
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            Clear
          </button>
        </div>

        {results.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No sections match. Try a different term or category.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((s) => (
              <SectionCard key={s.slug} section={s} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Browse mode: one horizontal carousel per category.
  return (
    <div className="space-y-10">
      {categories.map((c) => {
        const items = sections.filter((s) => s.category === c);
        if (items.length === 0) return null;
        return <CategoryCarousel key={c} title={c} sections={items} />;
      })}
    </div>
  );
}
