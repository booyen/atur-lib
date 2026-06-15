import { describe, it, expect } from "vitest";
import { buildPreviewDoc } from "./previewDoc";

describe("buildPreviewDoc", () => {
  it("embeds the markup and the Tailwind CDN", () => {
    const doc = buildPreviewDoc("<section>hi</section>");
    expect(doc).toContain("<!doctype html>");
    expect(doc).toContain("<section>hi</section>");
    expect(doc).toContain("https://cdn.tailwindcss.com");
  });

  it("appends the resize script when provided", () => {
    const doc = buildPreviewDoc("<div></div>", "<script>1</script>");
    expect(doc).toContain("<script>1</script>");
  });

  it("clips overflow only when requested", () => {
    expect(buildPreviewDoc("<div></div>", "", true)).toContain("overflow:hidden");
    expect(buildPreviewDoc("<div></div>")).not.toContain("overflow:hidden");
  });
});
