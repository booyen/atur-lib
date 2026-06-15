import Link from "next/link";
import type { Section } from "@/lib/schema";
import PreviewFrame from "./PreviewFrame";

export default function SectionCard({ section }: { section: Section }) {
  return (
    <Link
      href={`/sections/${section.slug}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <div className="h-56 overflow-hidden border-b border-gray-100 bg-gray-50">
        <PreviewFrame
          html={section.html}
          title={`${section.title} preview`}
          height={224}
          interactive={false}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">
            {section.title}
          </h3>
          <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            {section.category}
          </span>
        </div>
        {section.description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">{section.description}</p>
        )}
        {section.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {section.tags.slice(0, 4).map((t) => (
              <span key={t} className="rounded bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
