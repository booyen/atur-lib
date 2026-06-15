/**
 * Role taxonomy and page types for the Nica Generator.
 *
 * A "role" is the function a section plays in a page (its slot). A section's
 * `category` IS its role, so the strings here must match the categories used in
 * content/sections/*.mdx. Roles may exist here before any section fills them —
 * the generator renders a placeholder for empty roles so the architecture is
 * defined up front and content can be added later.
 */

export const PAGE_TYPES = [
  {
    id: "marketing",
    label: "Marketing",
    description: "A general marketing landing page focused on a single offer and conversion.",
  },
  {
    id: "saas",
    label: "SaaS",
    description: "A software product page: features, proof, pricing and FAQ to drive sign-ups.",
  },
  {
    id: "product",
    label: "Product",
    description: "A focused product page showcasing one product with visuals and proof.",
  },
] as const;

export type PageTypeId = (typeof PAGE_TYPES)[number]["id"];

export const PAGE_TYPE_IDS = PAGE_TYPES.map((p) => p.id) as PageTypeId[];

export function getPageType(id: string) {
  return PAGE_TYPES.find((p) => p.id === id);
}

/**
 * Every role the system knows about. `built: false` roles have no content yet —
 * they render as placeholders in the generator until a section is authored.
 */
export const ROLES = [
  { id: "Navbar", built: false },
  { id: "Hero", built: true },
  { id: "Logo Cloud", built: false },
  { id: "Features", built: true },
  { id: "Product Showcase", built: true },
  { id: "How It Works", built: false },
  { id: "Stats", built: false },
  { id: "Pricing", built: true },
  { id: "Testimonials", built: true },
  { id: "FAQ", built: true },
  { id: "CTA", built: true },
  { id: "Footer", built: true },
] as const;

export type RoleId = (typeof ROLES)[number]["id"];
