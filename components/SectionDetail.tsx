"use client";

import { useState } from "react";
import type { Section } from "@/lib/schema";
import PreviewFrame from "./PreviewFrame";
import CopyButton from "./CopyButton";

type Width = "full" | "tablet" | "mobile";

const WIDTHS: Record<Width, { label: string; max: number | null }> = {
  full: { label: "Desktop", max: null },
  tablet: { label: "Tablet", max: 768 },
  mobile: { label: "Mobile", max: 390 },
};

export default function SectionDetail({ section }: { section: Section }) {
  const [width, setWidth] = useState<Width>("full");
  const max = WIDTHS[width].max;

  return (
    <div className="space-y-8">
      {/* Toolbar: viewport toggles + copy actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-lg bg-secondary p-1" role="group" aria-label="Preview width">
          {(Object.keys(WIDTHS) as Width[]).map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWidth(w)}
              aria-pressed={width === w}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                width === w
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {WIDTHS[w].label}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <CopyButton value={section.html} label="Copy code" />
          <CopyButton value={section.copyPrompt} label="Copy prompt" variant="secondary" />
        </div>
      </div>

      {/* Live preview */}
      <div className="overflow-hidden rounded-xl border border-border bg-muted/40 p-4">
        <div
          className="mx-auto overflow-hidden rounded-lg border border-border bg-white transition-[max-width] duration-300"
          style={{ maxWidth: max ?? "100%" }}
        >
          <PreviewFrame html={section.html} title={`${section.title} preview`} autoResize />
        </div>
      </div>

      {/* Copy prompt text */}
      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          AI Prompt
        </h2>
        <p className="rounded-lg border border-border bg-card p-4 text-sm text-foreground/80">
          {section.copyPrompt}
        </p>
      </section>

      {/* Code */}
      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          HTML + Tailwind
        </h2>
        <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-zinc-950 p-4 text-sm leading-relaxed text-zinc-100">
          <code>{section.html}</code>
        </pre>
      </section>
    </div>
  );
}
