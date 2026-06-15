"use client";

import { useEffect, useRef, useState } from "react";

const HEIGHT_MESSAGE = "atur-preview-height";

type Props = {
  /** Raw HTML + Tailwind markup to render. */
  html: string;
  /** Accessible title for the iframe. */
  title: string;
  /**
   * Auto-resize the frame height to its content (detail view).
   * When false, the frame fills its container (card thumbnails).
   */
  autoResize?: boolean;
  /** Fixed height in px used when autoResize is false. */
  height?: number;
  /** Allow interaction (clicks/scroll). Off for thumbnails. */
  interactive?: boolean;
  /** Fill the parent's height (e.g. an aspect-ratio card) instead of a fixed px height. */
  fill?: boolean;
};

/**
 * Renders untrusted-by-default markup inside a sandboxed iframe so it cannot
 * touch the host page. Tailwind is provided via the Play CDN inside the frame,
 * so authored sections render exactly as written without a build step.
 */
export default function PreviewFrame({
  html,
  title,
  autoResize = false,
  height = 288,
  interactive = true,
  fill = false,
}: Props) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [measured, setMeasured] = useState<number | null>(null);

  useEffect(() => {
    if (!autoResize) return;
    function onMessage(e: MessageEvent) {
      if (
        e.source === ref.current?.contentWindow &&
        e.data?.type === HEIGHT_MESSAGE &&
        typeof e.data.height === "number"
      ) {
        setMeasured(Math.ceil(e.data.height));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [autoResize]);

  const resizeScript = autoResize
    ? `<script>
        function send(){parent.postMessage({type:'${HEIGHT_MESSAGE}',height:document.documentElement.scrollHeight},'*');}
        window.addEventListener('load',send);
        if(window.ResizeObserver){new ResizeObserver(send).observe(document.documentElement);}
        else{window.addEventListener('resize',send);}
      </script>`
    : "";

  const srcDoc = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>html,body{margin:0;}${autoResize ? "" : "html,body{overflow:hidden;}"}</style>
  </head>
  <body>${html}${resizeScript}</body>
</html>`;

  return (
    <iframe
      ref={ref}
      title={title}
      srcDoc={srcDoc}
      sandbox="allow-scripts"
      loading="lazy"
      tabIndex={interactive ? 0 : -1}
      className={`w-full border-0 bg-white ${fill ? "h-full" : ""}`}
      style={{
        height: fill ? "100%" : autoResize ? (measured ?? height) : height,
        pointerEvents: interactive ? "auto" : "none",
      }}
    />
  );
}
