"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  CheckCircledIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  SunIcon,
  ReloadIcon,
  Link2Icon,
  BookmarkIcon,
  BookmarkFilledIcon,
  ExternalLinkIcon,
  ClipboardCopyIcon,
  FrameIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import type { Section } from "@/lib/schema";
import { sectionPrompt } from "@/lib/prompts";
import { embedUrl } from "@/lib/figma";
import { copyToClipboard } from "@/lib/clipboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PreviewFrame from "./PreviewFrame";

export default function SectionCard({ section }: { section: Section }) {
  const [reloadKey, setReloadKey] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [lightCanvas, setLightCanvas] = useState(false);
  const href = `/sections/${section.slug}`;

  async function copy(text: string, label: string) {
    if (await copyToClipboard(text)) toast.success(label);
    else toast.error("Copy failed — press Ctrl+C");
  }

  return (
    <Dialog>
      <DialogTrigger className="group relative block aspect-video w-full overflow-hidden rounded-xl bg-white text-left shadow-sm transition hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        <PreviewFrame
          html={section.html}
          title={`${section.title} preview`}
          interactive={false}
          fill
        />

        {/* Hover detail bar — floating frosted bar, inset from edges */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 opacity-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="truncate text-xs font-semibold uppercase tracking-wider text-white">
            {section.title}
          </span>
          <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white">
            <CheckCircledIcon className="size-4 text-white/70" />
            See live <ChevronRightIcon className="size-4" />
          </span>
        </div>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="flex h-[85vh] w-[calc(100%-2rem)] max-w-6xl flex-col gap-0 overflow-hidden p-0 sm:max-w-6xl"
      >
        {/* Toolbar */}
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-xs font-bold text-white">
              A
            </span>
            <DialogTitle className="truncate text-sm font-semibold">{section.title}</DialogTitle>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle preview background"
              onClick={() => setLightCanvas((v) => !v)}
              className="hidden sm:inline-flex"
            >
              <SunIcon className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Reload preview"
              onClick={() => setReloadKey((k) => k + 1)}
            >
              <ReloadIcon className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Copy link"
              onClick={() =>
                copy(`${window.location.origin}${href}`, "Link copied")
              }
              className="hidden sm:inline-flex"
            >
              <Link2Icon className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Bookmark"
              aria-pressed={bookmarked}
              onClick={() => setBookmarked((v) => !v)}
              className="hidden sm:inline-flex"
            >
              {bookmarked ? <BookmarkFilledIcon className="size-4" /> : <BookmarkIcon className="size-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open in new tab"
              render={<a href={href} target="_blank" rel="noreferrer" />}
            >
              <ExternalLinkIcon className="size-4" />
            </Button>

            <a
              href={href}
              className="ml-1 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              Open
            </a>

            {/* Copy prompt split button */}
            <div className="ml-1 flex">
              <Button
                onClick={() => copy(sectionPrompt(section), "Prompt copied")}
                className="gap-2 rounded-r-none bg-emerald-600 text-white hover:bg-emerald-500"
              >
                <ClipboardCopyIcon className="size-4" /> Copy prompt
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      aria-label="More copy options"
                      className="rounded-l-none border-l border-emerald-700/60 bg-emerald-600 px-2 text-white hover:bg-emerald-500"
                    />
                  }
                >
                  <ChevronDownIcon className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => copy(section.html, "Code copied")}>
                    <ClipboardCopyIcon className="size-4" /> Copy code
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copy(sectionPrompt(section), "Prompt copied")}>
                    <ClipboardCopyIcon className="size-4" /> Copy prompt
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      copy(
                        embedUrl(window.location.origin, section.slug),
                        "Figma URL copied — in Figma, open the html.to.design plugin → Import from URL → paste",
                      )
                    }
                  >
                    <FrameIcon className="size-4" /> Copy for Figma
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <DialogClose
              render={<Button variant="ghost" size="icon" aria-label="Close" />}
              className="ml-1"
            >
              <Cross2Icon className="size-4" />
            </DialogClose>
          </div>
        </div>

        {/* Preview canvas */}
        <div
          className={`relative flex-1 overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            lightCanvas ? "bg-white" : "bg-background"
          }`}
        >
          <div className="mx-auto w-full max-w-5xl p-6">
            <div className="overflow-hidden rounded-xl border border-border bg-white">
              <PreviewFrame
                key={reloadKey}
                html={section.html}
                title={`${section.title} full preview`}
                autoResize
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
