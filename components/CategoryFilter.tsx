"use client";

type Props = {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
};

export default function CategoryFilter({ categories, selected, onSelect }: Props) {
  const chip = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-medium transition ${
      active
        ? "bg-primary text-primary-foreground"
        : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
    }`;

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      <button type="button" className={chip(selected === null)} onClick={() => onSelect(null)}>
        All
      </button>
      {categories.map((c) => (
        <button
          key={c}
          type="button"
          className={chip(selected === c)}
          aria-pressed={selected === c}
          onClick={() => onSelect(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
