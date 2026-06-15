import type { Metadata } from "next";
import NicaGenerator from "@/components/NicaGenerator";
import { getAllSections } from "@/lib/sections";

export const metadata: Metadata = {
  title: "Nica Generator — Atur",
  description:
    "Generate a full landing page by combining sections that best fit your page type — marketing, SaaS or product.",
};

export default function GeneratorPage() {
  const sections = getAllSections();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Nica Generator</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Pick a page type and we&apos;ll assemble a full page from the sections that fit it
          best. Regenerate, shuffle any slot, then copy the code, the prompt, or a shareable
          link.
        </p>
      </header>

      <NicaGenerator sections={sections} />
    </main>
  );
}
