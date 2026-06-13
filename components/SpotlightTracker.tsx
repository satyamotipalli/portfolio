"use client";

import { useEffect } from "react";

// Mounted once. On pointer move, finds the card under the cursor and writes the
// local mouse position into --mx/--my so the CSS spotlight glow follows the cursor.
export default function SpotlightTracker() {
  useEffect(() => {
    function onMove(e: PointerEvent) {
      const target = e.target as HTMLElement | null;
      const card = target?.closest?.(".card-base") as HTMLElement | null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    }
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
