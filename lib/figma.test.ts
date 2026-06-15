import { describe, it, expect } from "vitest";
import { embedUrl } from "./figma";

describe("embedUrl", () => {
  it("builds the bare embed path for a slug", () => {
    expect(embedUrl("https://atur.example", "centered-hero")).toBe(
      "https://atur.example/embed/centered-hero",
    );
  });
});
