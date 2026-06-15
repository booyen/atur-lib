"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
};

export default function SearchBar({ value, onChange, resultCount }: Props) {
  return (
    <div className="relative">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search sections by name, tag or category…"
        aria-label="Search sections"
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-28 text-base text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
        {resultCount} {resultCount === 1 ? "result" : "results"}
      </span>
    </div>
  );
}
