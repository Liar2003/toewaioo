"use client";

import { technologyNodes } from "@/data/technologies";

const EDGES: [string, string][] = [
  ["php", "laravel"],
  ["laravel", "postgresql"],
  ["postgresql", "redis"],
  ["redis", "docker"],
  ["docker", "go"],
  ["go", "nextjs"],
  ["nextjs", "react"],
  ["react", "javascript"],
  ["javascript", "typescript"],
  ["typescript", "restapi"],
  ["restapi", "websocket"],
  ["websocket", "nginx"],
  ["nginx", "linux"],
  ["linux", "docker"],
  ["git", "cicd"],
  ["cicd", "docker"],
];

function project(pos: [number, number, number]): { x: number; y: number } {
  const x = ((pos[0] + 7) / 14) * 78 + 11;
  const y = 72 - pos[2] * 4.2 - pos[1] * 3.2;
  return { x, y: Math.min(88, Math.max(12, y)) };
}

export default function TechnologyFallback({
  activeNodeId,
}: {
  activeNodeId: string | null;
}) {
  const projected = technologyNodes.map((n) => ({
    ...n,
    ...project(n.position),
  }));
  const byId = new Map(projected.map((n) => [n.id, n]));

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,245,160,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,245,160,.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {EDGES.map(([a, b], i) => {
          const na = byId.get(a);
          const nb = byId.get(b);
          if (!na || !nb) return null;
          const isActive = a === activeNodeId || b === activeNodeId;
          return (
            <line
              key={i}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke={isActive ? "#00F5A0" : "#0E3A3A"}
              strokeWidth={isActive ? 0.25 : 0.15}
              opacity={isActive ? 0.9 : 0.55}
            />
          );
        })}
      </svg>
      {projected.map((n) => {
        const active = n.id === activeNodeId;
        return (
          <div
            key={n.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <span
              className="block h-2 w-2 rounded-full transition-all duration-500"
              style={{
                background: n.color ?? "#00F5A0",
                boxShadow: active
                  ? `0 0 16px ${n.color ?? "#00F5A0"}`
                  : `0 0 6px ${(n.color ?? "#00F5A0") + "66"}`,
                transform: active ? "scale(1.7)" : "scale(1)",
              }}
            />
            <span
              className={`mt-1 block whitespace-nowrap font-mono text-[9px] tracking-widest transition-colors duration-300 ${
                active ? "text-neon" : "text-muted"
              }`}
            >
              {n.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
