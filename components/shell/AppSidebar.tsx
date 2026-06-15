"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  StackIcon,
  MagicWandIcon,
  GitHubLogoIcon,
  GearIcon,
} from "@radix-ui/react-icons";
import { useLibraryFilter } from "./LibraryFilterContext";

type Props = {
  categories: { name: string; count: number }[];
  total: number;
  /** Called after a navigation action, so the mobile drawer can close itself. */
  onNavigate?: () => void;
};

export default function AppSidebar({ categories, total, onNavigate }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { query, setQuery, category, setCategory } = useLibraryFilter();
  const searchRef = useRef<HTMLInputElement>(null);
  const onHome = pathname === "/";

  // Focus search on Cmd/Ctrl+K.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function goHome() {
    if (!onHome) router.push("/");
  }

  function pickCategory(c: string | null) {
    setCategory(c);
    goHome();
    onNavigate?.();
  }

  const navItem = (active: boolean) =>
    `flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition ${
      active
        ? "bg-secondary font-medium text-foreground"
        : "text-muted-foreground hover:bg-accent hover:text-foreground"
    }`;

  const catRow = (active: boolean) =>
    `flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm transition ${
      active
        ? "bg-secondary font-medium text-foreground"
        : "text-muted-foreground hover:bg-accent hover:text-foreground"
    }`;

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2 px-4">
        <Link href="/" onClick={onNavigate} className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-xs font-bold text-white">
            A
          </span>
          Atur
        </Link>
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <div className="relative">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              goHome();
            }}
            placeholder="Search"
            aria-label="Search sections"
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-12 text-sm outline-none focus:border-ring"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Primary nav */}
      <nav className="px-3">
        <Link href="/" onClick={() => { setCategory(null); onNavigate?.(); }} className={navItem(onHome)}>
          <StackIcon className="size-4" /> Library
        </Link>
        <Link href="/generator" onClick={onNavigate} className={navItem(pathname.startsWith("/generator"))}>
          <MagicWandIcon className="size-4" /> Nica Generator
        </Link>
      </nav>

      {/* Categories */}
      <div className="mt-5 min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        <p className="px-3 pb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Categories
        </p>
        <button type="button" className={catRow(onHome && category === null)} onClick={() => pickCategory(null)}>
          <span>All</span>
          <span className="font-mono text-xs text-muted-foreground">{total}</span>
        </button>
        {categories.map((c) => (
          <button
            key={c.name}
            type="button"
            className={catRow(onHome && category === c.name)}
            onClick={() => pickCategory(c.name)}
          >
            <span>{c.name}</span>
            <span className="font-mono text-xs text-muted-foreground">{c.count}</span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <a
          href="https://github.com/booyen/atur-lib"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <GitHubLogoIcon className="size-4" /> Source
        </a>
        <GearIcon className="size-4 text-muted-foreground" />
      </div>
    </div>
  );
}
