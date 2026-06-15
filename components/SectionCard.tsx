"use client";

import { ArrowRightIcon } from "@radix-ui/react-icons";
import type { Section } from "@/lib/schema";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PreviewFrame from "./PreviewFrame";
import SectionDetail from "./SectionDetail";

export default function SectionCard({ section }: { section: Section }) {
  return (
    <Dialog>
      <DialogTrigger className="group relative block h-60 w-full overflow-hidden rounded-xl border border-border bg-white text-left shadow-sm transition hover:border-foreground/20 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
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

        {/* Hover detail bar — frosted glass, slides up on hover */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between gap-3 border-t border-white/10 bg-gradient-to-t from-black/60 to-black/10 p-3 opacity-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
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
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <header className="space-y-2 pr-8">
          <div className="flex flex-wrap items-center gap-3">
            <DialogTitle className="text-xl font-bold tracking-tight">{section.title}</DialogTitle>
            <Badge variant="secondary">{section.category}</Badge>
          </div>
          {section.description && (
            <p className="text-sm text-muted-foreground">{section.description}</p>
          )}
          {section.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {section.tags.map((t) => (
                <Badge key={t} variant="outline" className="font-normal">
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <SectionDetail section={section} />
      </DialogContent>
    </Dialog>
  );
}
