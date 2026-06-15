"use client";

import { createContext, useContext, useMemo, useState } from "react";

type LibraryFilter = {
  query: string;
  setQuery: (q: string) => void;
  category: string | null;
  setCategory: (c: string | null) => void;
  /** True when the user is searching or has picked a category (grid view). */
  isFiltering: boolean;
  reset: () => void;
};

const Ctx = createContext<LibraryFilter | null>(null);

export function LibraryFilterProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const value = useMemo<LibraryFilter>(
    () => ({
      query,
      setQuery,
      category,
      setCategory,
      isFiltering: query.trim().length > 0 || category !== null,
      reset: () => {
        setQuery("");
        setCategory(null);
      },
    }),
    [query, category],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLibraryFilter(): LibraryFilter {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLibraryFilter must be used within LibraryFilterProvider");
  return ctx;
}
