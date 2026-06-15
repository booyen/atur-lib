import type { Section } from "./schema";
import type { PageTypeId, RoleId } from "./roles";
import { getTemplate } from "./pageTemplates";

/** One slot of a generated page: a role plus the section chosen for it (or null = no content yet). */
export type GeneratedSlot = {
  role: RoleId;
  required: boolean;
  section: Section | null;
};

export type RNG = () => number;

/** Deterministic PRNG (mulberry32) for reproducible generation in tests. */
export function seededRng(seed: number): RNG {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Sections that fit a role (category) AND the given page type. */
export function candidatesFor(
  sections: Section[],
  role: RoleId,
  pageType: PageTypeId,
): Section[] {
  return sections.filter((s) => s.category === role && s.pageTypes.includes(pageType));
}

/** Weighted random pick (by `weight`, default 1). Returns null for an empty list. */
function pickWeighted(candidates: Section[], rng: RNG): Section | null {
  if (candidates.length === 0) return null;
  const weights = candidates.map((c) => c.weight ?? 1);
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = rng() * total;
  for (let i = 0; i < candidates.length; i++) {
    roll -= weights[i];
    if (roll < 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
}

/**
 * Assemble a page for a page type: every template slot is rendered (filled when a
 * fitting section exists, otherwise left as a placeholder so the intended
 * architecture is visible). Only *which* section fills a slot is random.
 */
export function generatePage(
  sections: Section[],
  pageType: PageTypeId,
  rng: RNG = Math.random,
): GeneratedSlot[] {
  return getTemplate(pageType).slots.map((slot) => ({
    role: slot.role,
    required: slot.required,
    section: pickWeighted(candidatesFor(sections, slot.role, pageType), rng),
  }));
}

/** Re-pick a single slot, excluding the currently shown section when alternatives exist. */
export function shuffleSlot(
  sections: Section[],
  pageType: PageTypeId,
  slot: GeneratedSlot,
  rng: RNG = Math.random,
): GeneratedSlot {
  const candidates = candidatesFor(sections, slot.role, pageType);
  const others = candidates.filter((c) => c.slug !== slot.section?.slug);
  const pool = others.length > 0 ? others : candidates;
  return { ...slot, section: pickWeighted(pool, rng) };
}

/** Rebuild slots from a list of chosen slugs (for restoring shareable URLs). */
export function buildFromSlugs(
  sections: Section[],
  pageType: PageTypeId,
  slugs: (string | null)[],
): GeneratedSlot[] {
  return getTemplate(pageType).slots.map((slot, i) => {
    const slug = slugs[i] ?? null;
    const section = slug ? sections.find((s) => s.slug === slug) ?? null : null;
    return { role: slot.role, required: slot.required, section };
  });
}

/** Slots whose required section has no content yet (surfaced as warnings). */
export function missingRequired(slots: GeneratedSlot[]): RoleId[] {
  return slots.filter((s) => s.required && !s.section).map((s) => s.role);
}

// ---- URL state (shareable links, no backend) ------------------------------

export type GeneratorState = { pageType: PageTypeId; slugs: (string | null)[] };

/** Encode state into a compact `type~slug,slug,,slug` string for the URL. */
export function encodeState(pageType: PageTypeId, slots: GeneratedSlot[]): string {
  return `${pageType}~${slots.map((s) => s.section?.slug ?? "").join(",")}`;
}

/** Parse the URL string back into a page type + per-slot slugs. Null if invalid. */
export function decodeState(value: string | null | undefined): GeneratorState | null {
  if (!value) return null;
  const sep = value.indexOf("~");
  if (sep === -1) return null;
  const pageType = value.slice(0, sep) as PageTypeId;
  const slugs = value
    .slice(sep + 1)
    .split(",")
    .map((s) => (s === "" ? null : s));
  return { pageType, slugs };
}

// ---- Copy helpers ---------------------------------------------------------

/** Concatenate the chosen sections' HTML into one page, with placeholders noted. */
export function pageHtml(slots: GeneratedSlot[]): string {
  return slots
    .map((s) =>
      s.section ? s.section.html : `<!-- ${s.role}: no section yet -->`,
    )
    .join("\n\n");
}

/** A combined AI prompt to recreate the whole page from its sections' prompts. */
export function pagePrompt(pageType: PageTypeId, slots: GeneratedSlot[]): string {
  const intro = `Build a complete ${pageType} landing page using HTML and Tailwind CSS, composed of the following sections in order. Keep a cohesive visual style across all sections.`;
  const parts = slots.map((s, i) => {
    const n = i + 1;
    if (s.section) return `${n}. ${s.role} — ${s.section.copyPrompt}`;
    return `${n}. ${s.role} — design an appropriate ${s.role.toLowerCase()} section for a ${pageType} page.`;
  });
  return [intro, "", ...parts].join("\n");
}
