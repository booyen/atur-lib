import LibraryContent from "@/components/LibraryContent";
import { getAllSections, getCategories } from "@/lib/sections";

export default function Home() {
  const sections = getAllSections();
  const categories = getCategories();

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
      <header className="mb-8">
        <p className="text-sm font-medium text-emerald-600">The copy-paste section library</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tighter leading-none sm:text-4xl">
          Components
        </h1>
        <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-muted-foreground">
          Browse production-ready web sections. Copy the HTML + Tailwind code, or copy a
          ready-made prompt that adapts to your own design system.
        </p>
      </header>

      <LibraryContent sections={sections} categories={categories} />
    </main>
  );
}
