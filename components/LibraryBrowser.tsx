"use client";

import { useMemo, useState } from "react";
import type { Section } from "@/lib/schema";
import { filterSections } from "@/lib/search";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import CategorySidebar from "./CategorySidebar";
import SectionCard from "./SectionCard";

type Props = {
  sections: Section[];
  categories: string[];
};

export default function LibraryBrowser({ sections, categories }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const results = useMemo(
    () => filterSections(sections, query, category),
    [sections, query, category],
  );

  const counts = useMemo(
    () =>
      categories.map((name) => ({
        name,
        count: sections.filter((s) => s.category === name).length,
      })),
    [categories, sections],
  );

  return (
    <div className="grid gap-8 md:grid-cols-[12rem_1fr] lg:grid-cols-[14rem_1fr]">
      {/* 21st.dev-style category rail (desktop) */}
      <aside className="hidden md:block">
        <CategorySidebar
          categories={counts}
          total={sections.length}
          selected={category}
          onSelect={setCategory}
        />
      </aside>

      <div className="min-w-0 space-y-6">
        <SearchBar value={query} onChange={setQuery} resultCount={results.length} />

        {/* Category chips on mobile, where the rail is hidden */}
        <div className="md:hidden">
          <CategoryFilter categories={categories} selected={category} onSelect={setCategory} />
        </div>

        {results.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No sections match your search. Try a different term or category.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((s) => (
              <SectionCard key={s.slug} section={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
