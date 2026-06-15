import Link from "next/link";
import type { Section } from "@/lib/schema";
import { Badge } from "@/components/ui/badge";
import PreviewFrame from "./PreviewFrame";

export default function SectionCard({ section }: { section: Section }) {
  return (
    <Link
      href={`/sections/${section.slug}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="h-56 overflow-hidden border-b border-border bg-white">
        <PreviewFrame
          html={section.html}
          title={`${section.title} preview`}
          height={224}
          interactive={false}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary">
            {section.title}
          </h3>
          <Badge variant="secondary" className="shrink-0">
            {section.category}
          </Badge>
        </div>
        {section.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {section.description}
          </p>
        )}
        {section.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {section.tags.slice(0, 4).map((t) => (
              <Badge key={t} variant="outline" className="text-xs font-normal">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
