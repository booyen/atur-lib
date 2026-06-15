"use client";

import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
};

export default function SearchBar({ value, onChange, resultCount }: Props) {
  return (
    <div className="relative">
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search sections by name, tag or category…"
        aria-label="Search sections"
        className="h-12 pr-28 text-base"
      />
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        {resultCount} {resultCount === 1 ? "result" : "results"}
      </span>
    </div>
  );
}
