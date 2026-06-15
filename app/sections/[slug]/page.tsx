import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SectionDetail from "@/components/SectionDetail";
import { getAllSections, getSectionBySlug } from "@/lib/sections";

export function generateStaticParams() {
  return getAllSections().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const section = getSectionBySlug(slug);
  if (!section) return { title: "Section not found — Atur" };
  return {
    title: `${section.title} — Atur`,
    description: section.description,
  };
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const section = getSectionBySlug(slug);
  if (!section) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
        ← Back to library
      </Link>

      <header className="mt-4 mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{section.title}</h1>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
            {section.category}
          </span>
        </div>
        {section.description && <p className="mt-2 text-gray-600">{section.description}</p>}
        {section.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {section.tags.map((t) => (
              <span key={t} className="rounded bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600">
                {t}
              </span>
            ))}
          </div>
        )}
      </header>

      <SectionDetail section={section} />
    </main>
  );
}
