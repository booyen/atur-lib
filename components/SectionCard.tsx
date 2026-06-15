import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import type { Section } from "@/lib/schema";
import { Badge } from "@/components/ui/badge";
import PreviewFrame from "./PreviewFrame";

export default function SectionCard({ section }: { section: Section }) {
  return (
    <Link
      href={`/sections/${section.slug}`}
      className="group relative block h-60 overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:border-foreground/20 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <PreviewFrame
        html={section.html}
        title={`${section.title} preview`}
        height={240}
        interactive={false}
      />

      {/* Category pill — always visible, top-right */}
      <div className="absolute right-2 top-2 z-10">
        <Badge
          variant="secondary"
          className="border border-border/60 bg-secondary/85 backdrop-blur supports-[backdrop-filter]:bg-secondary/70"
        >
          {section.category}
        </Badge>
      </div>

      {/* Hover detail bar — slides up on hover */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between gap-3 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-3 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="flex min-w-0 items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-white">
          <span className="truncate">{section.title}</span>
          {section.tags[0] && (
            <span className="shrink-0 text-white/50">| {section.tags[0]}</span>
          )}
        </div>
        <span className="flex shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white">
          View <ArrowRightIcon className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}
