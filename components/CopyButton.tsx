"use client";

import { useEffect, useRef, useState } from "react";
import { copyToClipboard } from "@/lib/clipboard";

type Props = {
  /** Text placed on the clipboard. */
  value: string;
  /** Button label (idle state). */
  label: string;
  /** Visual style. */
  variant?: "primary" | "secondary";
};

export default function CopyButton({ value, label, variant = "primary" }: Props) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function handleClick() {
    const ok = await copyToClipboard(value);
    setState(ok ? "copied" : "error");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 1800);
  }

  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "border border-border bg-card text-foreground hover:bg-accent";

  const text =
    state === "copied" ? "Copied!" : state === "error" ? "Press Ctrl+C" : label;

  return (
    <button type="button" onClick={handleClick} className={`${base} ${styles}`}>
      {text}
    </button>
  );
}
