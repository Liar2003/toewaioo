"use client";

import { useEffect, useState } from "react";
import { technologyNodes } from "@/data/technologies";
import TechIcon from "./TechIcon";

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

/**
 * Camera-viewfinder style "TARGET ACQUIRED" readout. Corner brackets + edge
 * ticks replace the old square border; every new lock replays a focus punch-in
 * and a single AF-style sweep across the frame.
 */
export default function FocusScanner({ target }: FocusFrameProps) {
  const [displayed, setDisplayed] = useState<ScanTarget | null>(target);
  const [flashKey, setFlashKey] = useState(0);

  useEffect(() => {
    if (!target) return;
    setDisplayed(target);
    setFlashKey((k) => k + 1);
  }, [target]);

  if (!displayed) return null;

  const accent =
    technologyNodes.find((n) => n.id === displayed.id)?.color ?? "#00F5A0";

  return (
    <div
      key={flashKey}
      className="vf-frame animate-focus-lock pointer-events-none w-64 bg-black/60 p-4 backdrop-blur-sm"
      style={{ ["--vf-color" as string]: accent }}
      role="status"
      aria-live="polite"
    >
      {/* camera focus brackets */}
      <span className="vf-corner vf-tl" aria-hidden="true" />
      <span className="vf-corner vf-tr" aria-hidden="true" />
      <span className="vf-corner vf-bl" aria-hidden="true" />
      <span className="vf-corner vf-br" aria-hidden="true" />
      <span className="vf-tick vf-tick-t" aria-hidden="true" />
      <span className="vf-tick vf-tick-b" aria-hidden="true" />
      <span className="vf-tick vf-tick-l" aria-hidden="true" />
      <span className="vf-tick vf-tick-r" aria-hidden="true" />
      <span className="vf-sweep" aria-hidden="true" />

      <div className="flex items-center gap-2">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center border"
          style={{ borderColor: `${accent}55`, background: "rgba(3,5,8,.7)" }}
          aria-hidden="true"
        >
          <TechIcon id={displayed.id} size={14} color={accent} />
        </span>
        <div className="animate-flicker font-mono text-[9px] tracking-[0.35em]" style={{ color: accent }}>
          TARGET ACQUIRED
        </div>
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
          STATUS: <span style={{ color: accent }}>{displayed.status.toUpperCase()}</span>
        </p>
      </div>
    </div>
  );
}
