/**
 * Builds a self-contained HTML document for a section's markup: the raw HTML plus
 * the Tailwind Play CDN so it renders faithfully without a build step.
 *
 * Shared by the sandboxed preview iframe (components/PreviewFrame.tsx) and the
 * bare /embed/[slug] endpoint used for Figma import, so both stay in sync.
 *
 * @param html        the section's HTML + Tailwind markup
 * @param resizeScript optional <script> appended to the body (used by the iframe
 *                     preview to report its height); pass "" for a static doc
 * @param clip         when true, clip overflow (used for fixed-height thumbnails)
 */
export function buildPreviewDoc(html: string, resizeScript = "", clip = false): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>html,body{margin:0;}${clip ? "html,body{overflow:hidden;}" : ""}</style>
  </head>
  <body>${html}${resizeScript}</body>
</html>`;
}
