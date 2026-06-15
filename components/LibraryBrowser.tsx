"use client";

import { useMemo, useState } from "react";
import type { Section } from "@/lib/schema";
import { filterSections } from "@/lib/search";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
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

  return (
    <div className="space-y-6">
      <SearchBar value={query} onChange={setQuery} resultCount={results.length} />
      <CategoryFilter categories={categories} selected={category} onSelect={setCategory} />

      {results.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          No sections match your search. Try a different term or category.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((s) => (
            <SectionCard key={s.slug} section={s} />
          ))}
        </div>
      )}
    </div>
  );
}
