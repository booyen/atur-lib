"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Text placed on the clipboard. */
  value: string;
  /** Button label (idle state). */
  label: string;
  /** Visual style. */
  variant?: "primary" | "secondary";
};

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy path
  }
  // Legacy fallback for non-secure contexts / older browsers.
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

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
    "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2";
  const styles =
    variant === "primary"
      ? "bg-indigo-600 text-white hover:bg-indigo-500"
      : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50";

  const text =
    state === "copied" ? "Copied!" : state === "error" ? "Press Ctrl+C" : label;

  return (
    <button type="button" onClick={handleClick} className={`${base} ${styles}`}>
      {text}
    </button>
  );
}
