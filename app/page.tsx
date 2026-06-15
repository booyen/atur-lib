import LibraryBrowser from "@/components/LibraryBrowser";
import { getAllSections, getCategories } from "@/lib/sections";

export default function Home() {
  const sections = getAllSections();
  const categories = getCategories();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Atur Section Library
        </h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Browse production-ready web sections. Copy the HTML + Tailwind code, or copy a
          ready-made prompt to recreate and customize it with your AI tool.
        </p>
      </header>

      <LibraryBrowser sections={sections} categories={categories} />
    </main>
  );
}
