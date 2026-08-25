"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type ScanTarget = {
  id: string;
  name: string;
  category: string;
  status: string;
  description?: string;
  position?: [number, number, number];
};

/**
 * Cycles an index through a target list on an interval.
 * Pauses while `paused` is true. Never runs when reduced motion is preferred.
 */
export function useScanCycle(
  count: number,
  intervalMs = 3400,
  paused = false,
  enabled = true
): [number, (i: number) => void] {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!enabled || paused || count === 0) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [enabled, paused, count, intervalMs]);

  return [index, setIndex];
}

type FocusFrameProps = {
  target: ScanTarget | null;
};

/** DOM-side "TARGET ACQUIRED" readout that mirrors the active scan node. */
export default function FocusScanner({ target }: FocusFrameProps) {
  const [displayed, setDisplayed] = useState<ScanTarget | null>(target);
  const [flashKey, setFlashKey] = useState(0);

  useEffect(() => {
    if (!target) return;
    setDisplayed(target);
    setFlashKey((k) => k + 1);
  }, [target]);

  if (!displayed) return null;

  return (
    <div
      className="hud-corner pointer-events-none w-64 border border-neon/25 bg-black/60 p-4 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div key={flashKey} className="animate-flicker font-mono text-[9px] tracking-[0.35em] text-neon">
        TARGET ACQUIRED
      </div>
      <div className="mt-3 text-center">
        <span
          className="text-glow font-mono text-2xl font-bold tracking-[0.25em] text-frost"
          aria-label={displayed.name}
        >
          {displayed.name}
        </span>
      </div>
      <div className="mt-3 space-y-1 border-t border-neon/10 pt-2 font-mono text-[9px] tracking-[0.2em] text-muted">
        <p>
          CATEGORY: <span className="text-cyan">{displayed.category.toUpperCase()}</span>
        </p>
        <p>
          STATUS: <span className="text-neon">{displayed.status.toUpperCase()}</span>
        </p>
      </div>
    </div>
  );
}
