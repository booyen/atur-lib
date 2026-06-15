import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SectionDetail from "@/components/SectionDetail";
import { Badge } from "@/components/ui/badge";
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
      <Link href="/" className="text-sm font-medium text-primary hover:text-primary/80">
        ← Back to library
      </Link>

      <header className="mt-4 mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{section.title}</h1>
          <Badge variant="secondary">{section.category}</Badge>
        </div>
        {section.description && <p className="mt-2 text-muted-foreground">{section.description}</p>}
        {section.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {section.tags.map((t) => (
              <Badge key={t} variant="outline" className="font-normal">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </header>

      <SectionDetail section={section} />
    </main>
  );
}
