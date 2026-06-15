"use client";

import { useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import type { Section } from "@/lib/schema";
import SectionCard from "./SectionCard";
import { useLibraryFilter } from "./shell/LibraryFilterContext";

export default function CategoryCarousel({
  title,
  sections,
}: {
  title: string;
  sections: Section[];
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const { setCategory } = useLibraryFilter();

  function scroll(dir: 1 | -1) {
    scroller.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCategory(title)}
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            View all
          </button>
          <div className="flex gap-1">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scroll(-1)}
              className="rounded-full border border-border p-1.5 text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scroll(1)}
              className="rounded-full border border-border p-1.5 text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        className="flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {sections.map((s) => (
          <div key={s.slug} className="w-[300px] shrink-0 snap-start sm:w-[340px] lg:w-[360px]">
            <SectionCard section={s} />
          </div>
        ))}
      </div>
    </section>
  );
}
