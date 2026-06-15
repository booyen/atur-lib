import { buildPreviewDoc } from "@/lib/previewDoc";
import { getAllSections, getSectionBySlug } from "@/lib/sections";

/** Pre-render a bare embed page per section. */
export function generateStaticParams() {
  return getAllSections().map((s) => ({ slug: s.slug }));
}

/**
 * Bare, standalone render of a single section (just the markup + Tailwind CDN,
 * no app shell). This is the URL users paste into the html.to.design Figma
 * plugin's "Import from URL" to bring the section in as editable layers.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const section = getSectionBySlug(slug);

  if (!section) {
    return new Response("Section not found", { status: 404 });
  }

  return new Response(buildPreviewDoc(section.html), {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
