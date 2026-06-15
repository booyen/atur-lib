"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Section } from "@/lib/schema";
import { PAGE_TYPES, type PageTypeId } from "@/lib/roles";
import {
  candidatesFor,
  generatePage,
  shuffleSlot,
  buildFromSlugs,
  decodeState,
  encodeState,
  missingRequired,
  pageHtml,
  pagePrompt,
  type GeneratedSlot,
} from "@/lib/generator";
import { copyToClipboard } from "@/lib/clipboard";
import PreviewFrame from "./PreviewFrame";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReloadIcon, ShuffleIcon, CubeIcon } from "@radix-ui/react-icons";

const DEFAULT_TYPE: PageTypeId = PAGE_TYPES[0].id;

export default function NicaGenerator({ sections }: { sections: Section[] }) {
  const [pageType, setPageType] = useState<PageTypeId>(DEFAULT_TYPE);
  const [slots, setSlots] = useState<GeneratedSlot[]>([]);

  // Restore from the URL on mount, else generate a fresh page.
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("p");
    const decoded = decodeState(param);
    if (decoded && PAGE_TYPES.some((p) => p.id === decoded.pageType)) {
      setPageType(decoded.pageType);
      setSlots(buildFromSlugs(sections, decoded.pageType, decoded.slugs));
    } else {
      setPageType(DEFAULT_TYPE);
      setSlots(generatePage(sections, DEFAULT_TYPE));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the URL in sync so the current page is always shareable.
  useEffect(() => {
    if (slots.length === 0) return;
    const url = `${window.location.pathname}?p=${encodeState(pageType, slots)}`;
    window.history.replaceState(null, "", url);
  }, [pageType, slots]);

  const changeType = useCallback(
    (next: PageTypeId) => {
      setPageType(next);
      setSlots(generatePage(sections, next));
    },
    [sections],
  );

  const regenerate = useCallback(
    () => setSlots(generatePage(sections, pageType)),
    [sections, pageType],
  );

  const shuffle = useCallback(
    (index: number) =>
      setSlots((prev) =>
        prev.map((s, i) => (i === index ? shuffleSlot(sections, pageType, s) : s)),
      ),
    [sections, pageType],
  );

  const candidateCounts = useMemo(
    () => slots.map((s) => candidatesFor(sections, s.role, pageType).length),
    [slots, sections, pageType],
  );

  const missing = useMemo(() => missingRequired(slots), [slots]);

  async function copy(text: string, label: string) {
    if (await copyToClipboard(text)) toast.success(label);
    else toast.error("Copy failed — press Ctrl+C");
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs value={pageType} onValueChange={(v) => changeType(v as PageTypeId)}>
          <TabsList>
            {PAGE_TYPES.map((p) => (
              <TabsTrigger key={p.id} value={p.id}>
                {p.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap gap-2">
          <Button onClick={regenerate}>
            <ReloadIcon className="size-4" /> Regenerate
          </Button>
          <Button
            variant="secondary"
            onClick={() => copy(pageHtml(slots), "Page code copied")}
          >
            Copy page code
          </Button>
          <Button
            variant="secondary"
            onClick={() => copy(pagePrompt(pageType, slots), "Combined prompt copied")}
          >
            Copy prompt
          </Button>
          <Button
            variant="outline"
            onClick={() => copy(window.location.href, "Shareable link copied")}
          >
            Copy link
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {PAGE_TYPES.find((p) => p.id === pageType)?.description}
      </p>

      {missing.length > 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          Required sections not built yet: {missing.join(", ")}. Shown as placeholders below.
        </div>
      )}

      {/* Assembled page */}
      <div className="space-y-4">
        {slots.length === 0
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-xl border border-border bg-card"
              />
            ))
          : slots.map((slot, i) => (
              <SlotBlock
                key={`${slot.role}-${i}`}
                slot={slot}
                canShuffle={candidateCounts[i] > 1}
                onShuffle={() => shuffle(i)}
              />
            ))}
      </div>
    </div>
  );
}

function SlotBlock({
  slot,
  canShuffle,
  onShuffle,
}: {
  slot: GeneratedSlot;
  canShuffle: boolean;
  onShuffle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="secondary">{slot.role}</Badge>
          {slot.required && <span className="text-xs text-muted-foreground">required</span>}
          {slot.section && (
            <span className="text-muted-foreground">· {slot.section.title}</span>
          )}
        </div>
        {slot.section && canShuffle && (
          <Button size="sm" variant="ghost" onClick={onShuffle}>
            <ShuffleIcon className="size-4" /> Shuffle
          </Button>
        )}
      </div>

      {slot.section ? (
        <div className="bg-white">
          <PreviewFrame
            html={slot.section.html}
            title={`${slot.section.title} preview`}
            autoResize
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <CubeIcon className="size-6 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">{slot.role}</p>
          <p className="text-xs text-muted-foreground">No section yet — coming soon</p>
        </div>
      )}
    </div>
  );
}
