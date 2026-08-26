"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import GlitchText from "@/components/ui/GlitchText";
import StatusIndicator from "@/components/ui/StatusIndicator";
import { useIsMobile, useReducedMotion, useWebGLAvailable } from "@/components/ui/hooks";
import { profile } from "@/data/profile";
import { technologyNodes, scanSequence } from "@/data/technologies";
import { useScanCycle } from "./FocusScanner";
import FocusScannerPanel from "./FocusScanner";
import HeroHUD from "./HeroHUD";
import TechnologyFallback from "./TechnologyFallback";
import type { NodePositions } from "./TechnologyWorld";

const TechnologyWorld = dynamic(() => import("./TechnologyWorld"), { ssr: false });

const INITIAL_POSITIONS: NodePositions = Object.fromEntries(
  technologyNodes.map((n) => [n.id, [...n.position] as [number, number, number]])
);

function useTypingReveal(text: string, start: boolean, speed = 55): string {
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOutput(text);
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setOutput(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [start, text, speed]);

  return output;
}

export default function Hero({ bootDone }: { bootDone: boolean }) {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const webgl = useWebGLAvailable();
  const [nodeDragging, setNodeDragging] = useState(false);
  const [nodePositions, setNodePositions] =
    useState<NodePositions>(INITIAL_POSITIONS);
  const [userPinned, setUserPinned] = useState<string | null>(null);

  const scanningEnabled = bootDone && !reduced && !userPinned;

  const sequenceIds = useMemo(
    () =>
      scanSequence
        .map((id) => technologyNodes.find((n) => n.id === id))
        .filter((n): n is (typeof technologyNodes)[number] => Boolean(n)),
    []
  );

  const [scanIndex] = useScanCycle(
    sequenceIds.length,
    3400,
    nodeDragging || !!userPinned,
    scanningEnabled
  );

  const activeNodeId =
    userPinned ?? (scanningEnabled ? sequenceIds[scanIndex]?.id ?? null : null);

  const activeNode = technologyNodes.find((n) => n.id === activeNodeId) ?? null;
  const activePosition = activeNodeId
    ? nodePositions[activeNodeId] ?? activeNode?.position
    : undefined;

  const typedTitle = useTypingReveal(
    profile.title.toUpperCase(),
    bootDone,
    reduced ? 0 : 60
  );

  const readouts = useMemo(
    () =>
      activeNode && activePosition
        ? [
            {
              label: "NODE_X",
              value: activePosition[0].toFixed(2),
            },
            { label: "NODE_Y", value: activePosition[1].toFixed(2) },
            { label: "NODE_Z", value: activePosition[2].toFixed(2) },
          ]
        : [
            { label: "GRID_REF", value: "SCANNING" },
            { label: "NODES_FOUND", value: String(technologyNodes.length) },
          ],
    [activeNode, activePosition]
  );

  const handleNodeSelect = useCallback((id: string) => {
    setUserPinned((prev) => (prev === id ? null : id));
  }, []);

  const handleNodeMove = useCallback(
    (id: string, position: [number, number, number]) => {
      setNodePositions((prev) => ({ ...prev, [id]: position }));
    },
    []
  );

  const handleDraggingChange = useCallback((dragging: boolean) => {
    setNodeDragging(dragging);
  }, []);

  return (
    <section
      id="hero"
      className="relative flex h-[100svh] min-h-[560px] items-center overflow-hidden"
      aria-label="Introduction"
    >
      {/* 3D layer */}
      <div className="absolute inset-0">
        {webgl === false ? (
          <TechnologyFallback activeNodeId={activeNodeId} />
        ) : (
          <TechnologyWorld
            activeNodeId={activeNodeId}
            positions={nodePositions}
            onNodeSelect={handleNodeSelect}
            onNodeMove={handleNodeMove}
            onDraggingChange={handleDraggingChange}
            reducedMotion={reduced}
            compactLabels={isMobile}
          />
        )}
      </div>

      {/* readability scrims — keep 3D world strictly in the background */}
      <div className="pointer-events-none absolute inset-0 bg-void/45" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-void/95 via-void/40 to-transparent lg:w-2/3" />

      <HeroHUD readouts={readouts} online />

      {/* foreground content */}
      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-12 lg:px-16">
        <div className="pointer-events-auto max-w-2xl">
          <div className="mb-5">
            <StatusIndicator label="SYSTEM ONLINE" tone="online" />
          </div>

          {/* single semantic h1: name + role, visual styling preserved */}
          <h1>
            <span className="block font-mono text-sm tracking-[0.4em] text-muted sm:text-base">
              {profile.name.toUpperCase()}
            </span>
            <span className="mt-3 block text-4xl font-extrabold leading-[1.05] tracking-tight text-frost sm:text-6xl lg:text-7xl">
              <GlitchText text={typedTitle || "\u00A0"} />
            </span>
          </h1>

          <p className="mt-6 max-w-md font-mono text-xs leading-relaxed tracking-wider text-muted sm:text-sm">
            {profile.tagline}
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#projects" className="btn-hud">
              [ VIEW PROJECTS ]
            </a>
            <a href="#contact" className="btn-hud-ghost">
              [ CONTACT ]
            </a>
          </div>
        </div>
      </div>

      {/* target panel */}
      <div className="absolute bottom-24 right-4 z-10 hidden md:block lg:right-8">
        {activeNode ? (
          <FocusScannerPanel
            target={{
              id: activeNode.id,
              name: activeNode.name,
              category: activeNode.category,
              status: "ACTIVE",
            }}
          />
        ) : (
          <div className="vf-frame pointer-events-none relative bg-black/50 px-6 py-4 font-mono text-[10px] tracking-[0.3em] text-muted backdrop-blur-sm">
            <span className="vf-corner vf-tl" aria-hidden="true" />
            <span className="vf-corner vf-tr" aria-hidden="true" />
            <span className="vf-corner vf-bl" aria-hidden="true" />
            <span className="vf-corner vf-br" aria-hidden="true" />
            <span className="vf-tick vf-tick-t" aria-hidden="true" />
            <span className="vf-tick vf-tick-b" aria-hidden="true" />
            <span className="vf-tick vf-tick-l" aria-hidden="true" />
            <span className="vf-tick vf-tick-r" aria-hidden="true" />
            SCANNING GRID...
          </div>
        )}
      </div>

      {/* scroll cue */}
      <a
        href="#about"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-mono text-[9px] tracking-[0.4em] text-muted transition-colors hover:text-neon"
        aria-label="Scroll to about section"
      >
        <span className="animate-floatY block">▼ SCROLL ▼</span>
      </a>
    </section>
  );
}
