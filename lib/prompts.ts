import type { Section } from "./schema";

/**
 * Framework-agnostic instruction appended to every copied prompt. It tells the
 * AI to implement the section in the *consuming* project's own stack and design
 * system, rather than reproducing Atur's specific styling. This keeps copied
 * prompts portable across design systems (Tailwind, CSS, MUI, Chakra, etc.).
 */
export const DESIGN_SYSTEM_DIRECTIVE =
  "Implement this in the target project's existing framework and design system. " +
  "Reuse its design tokens, color palette, typography, spacing scale, and component " +
  "primitives — do not hardcode specific colors, fonts, or visual styles, and follow " +
  "the conventions of the surrounding codebase. Keep the markup semantic, responsive, " +
  "and accessible. Treat the description below as structure and intent, not exact visuals.";

/** The prompt a user copies for a single section: structural intent + adapter directive. */
export function sectionPrompt(section: Section): string {
  return `${section.copyPrompt}\n\n${DESIGN_SYSTEM_DIRECTIVE}`;
}
