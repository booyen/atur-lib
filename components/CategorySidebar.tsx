"use client";

type Props = {
  categories: { name: string; count: number }[];
  total: number;
  selected: string | null;
  onSelect: (category: string | null) => void;
};

export default function CategorySidebar({ categories, total, selected, onSelect }: Props) {
  const row = (active: boolean) =>
    `flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${
      active
        ? "bg-secondary font-medium text-foreground"
        : "text-muted-foreground hover:bg-accent hover:text-foreground"
    }`;

  return (
    <nav className="sticky top-20" aria-label="Categories">
      <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Categories
      </p>
      <ul className="space-y-0.5">
        <li>
          <button type="button" className={row(selected === null)} onClick={() => onSelect(null)}>
            <span>All</span>
            <span className="font-mono text-xs text-muted-foreground">{total}</span>
          </button>
        </li>
        {categories.map((c) => (
          <li key={c.name}>
            <button
              type="button"
              className={row(selected === c.name)}
              aria-pressed={selected === c.name}
              onClick={() => onSelect(c.name)}
            >
              <span>{c.name}</span>
              <span className="font-mono text-xs text-muted-foreground">{c.count}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
