import type { PageTypeId, RoleId } from "./roles";

/**
 * A page template is the *architecture* of a page type: an ordered list of slots,
 * each mapping to a role. Required slots are always placed (or shown as a
 * placeholder if no section exists yet); optional slots are placed only when a
 * fitting section exists. Editing these lists reshapes generated pages.
 *
 * Structures are based on common high-converting landing-page patterns for each
 * page type (hero + proof + features + offer + CTA + footer, with variations).
 */

export type Slot = { role: RoleId; required: boolean };
export type PageTemplate = { pageType: PageTypeId; slots: Slot[] };

const r = (role: RoleId, required = false): Slot => ({ role, required });

export const PAGE_TEMPLATES: Record<PageTypeId, PageTemplate> = {
  marketing: {
    pageType: "marketing",
    slots: [
      r("Navbar", true),
      r("Hero", true),
      r("Logo Cloud"),
      r("Features", true),
      r("How It Works"),
      r("Testimonials"),
      r("Stats"),
      r("Pricing"),
      r("CTA", true),
      r("Footer", true),
    ],
  },
  saas: {
    pageType: "saas",
    slots: [
      r("Navbar", true),
      r("Hero", true),
      r("Logo Cloud"),
      r("Features", true),
      r("Product Showcase"),
      r("How It Works"),
      r("Stats"),
      r("Pricing", true),
      r("Testimonials"),
      r("FAQ"),
      r("CTA", true),
      r("Footer", true),
    ],
  },
  product: {
    pageType: "product",
    slots: [
      r("Navbar", true),
      r("Hero", true),
      r("Product Showcase", true),
      r("Features", true),
      r("Stats"),
      r("Testimonials"),
      r("Pricing"),
      r("FAQ"),
      r("CTA"),
      r("Footer", true),
    ],
  },
};

export function getTemplate(pageType: PageTypeId): PageTemplate {
  return PAGE_TEMPLATES[pageType];
}
