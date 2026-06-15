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
        <div className="inline-flex rounded-lg bg-gray-100 p-1" role="group" aria-label="Preview width">
          {(Object.keys(WIDTHS) as Width[]).map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWidth(w)}
              aria-pressed={width === w}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                width === w ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
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
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div
          className="mx-auto overflow-hidden rounded-lg border border-gray-200 bg-white transition-[max-width] duration-300"
          style={{ maxWidth: max ?? "100%" }}
        >
          <PreviewFrame html={section.html} title={`${section.title} preview`} autoResize />
        </div>
      </div>

      {/* Copy prompt text */}
      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
          AI Prompt
        </h2>
        <p className="rounded-lg border border-gray-200 bg-indigo-50/40 p-4 text-sm text-gray-700">
          {section.copyPrompt}
        </p>
      </section>

      {/* Code */}
      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
          HTML + Tailwind
        </h2>
        <pre className="max-h-96 overflow-auto rounded-lg bg-gray-900 p-4 text-sm leading-relaxed text-gray-100">
          <code>{section.html}</code>
        </pre>
      </section>
    </div>
  );
}
