"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import HUDPanel from "@/components/ui/HUDPanel";

type ArchNode = {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  w: number;
  color: string;
  delay: number;
};

const NODES: ArchNode[] = [
  { id: "clients", label: "CLIENTS", x: 400, y: 42, w: 120, color: "#71808A", delay: 0 },
  { id: "nginx", label: "NGINX", sub: "REVERSE PROXY", x: 400, y: 138, w: 160, color: "#00F5A0", delay: 0.25 },
  { id: "rest", label: "REST API", sub: "STATELESS", x: 268, y: 244, w: 150, color: "#00D9FF", delay: 0.55 },
  { id: "ws", label: "WEBSOCKET", sub: "REALTIME", x: 532, y: 244, w: 150, color: "#00D9FF", delay: 0.65 },
  { id: "app", label: "APPLICATION LAYER", sub: "DOMAIN LOGIC", x: 400, y: 348, w: 220, color: "#00F5A0", delay: 0.95 },
  { id: "queue", label: "REDIS / QUEUE", sub: "JOB BUS", x: 400, y: 442, w: 190, color: "#FFB800", delay: 1.25 },
  { id: "workers", label: "WORKERS", sub: "SCALED POOL", x: 268, y: 536, w: 150, color: "#00F5A0", delay: 1.55 },
  { id: "db", label: "POSTGRESQL", sub: "PERSISTENCE", x: 532, y: 536, w: 170, color: "#00D9FF", delay: 1.7 },
];

const LINKS: [string, string][] = [
  ["clients", "nginx"],
  ["nginx", "rest"],
  ["nginx", "ws"],
  ["rest", "app"],
  ["ws", "app"],
  ["app", "queue"],
  ["queue", "workers"],
  ["queue", "db"],
];

const PACKET_PATHS = [
  "M400,64 L400,116",
  "M400,160 L268,222",
  "M400,160 L532,222",
  "M268,266 L400,326",
  "M532,266 L400,326",
  "M400,370 L400,420",
  "M400,464 L268,514",
  "M400,464 L532,514",
];

export default function Architecture() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const byId = new Map(NODES.map((n) => [n.id, n]));

  return (
    <section id="architecture" className="relative mx-auto max-w-7xl px-6 py-24 sm:px-12 lg:px-16" aria-label="System architecture">
      <SectionHeading index="04" kicker="trace --topology" title="SYSTEM TOPOLOGY" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55 }}
      >
        <HUDPanel
          title="topology.map"
          status={{ label: inView ? "TRAFFIC FLOWING" : "STANDBY", tone: inView ? "online" : "idle" }}
          cornerColor="rgba(0,217,255,.55)"
        >
          <div ref={ref} className="overflow-x-auto p-4 sm:p-8">
            <svg
              viewBox="0 0 800 600"
              className="mx-auto min-w-[560px] max-w-3xl font-mono"
              role="img"
              aria-label="Architecture diagram: clients connect through Nginx to REST and WebSocket APIs, into the application layer, through Redis queue to workers and PostgreSQL"
            >
              {/* links */}
              {LINKS.map(([a, b], i) => {
                const na = byId.get(a)!;
                const nb = byId.get(b)!;
                const midY = (na.y + nb.y) / 2;
                const path = `M${na.x},${na.y + 22} L${na.x},${midY} L${nb.x},${midY} L${nb.x},${nb.y - 22}`;
                return (
                  <path
                    key={i}
                    d={path}
                    fill="none"
                    stroke={nb.color}
                    strokeWidth={1}
                    opacity={inView ? 0.35 : 0.08}
                    style={{
                      transition: `opacity .8s ease ${nb.delay}s`,
                      strokeDasharray: inView ? undefined : "4 6",
                    }}
                  />
                );
              })}

              {/* traveling data packets */}
              {inView &&
                PACKET_PATHS.map((d, i) => (
                  <circle key={i} r={2.5} fill={i % 2 === 0 ? "#00F5A0" : "#00D9FF"} opacity={0}>
                    <animateMotion dur="1.6s" begin={`${i * 0.22}s`} repeatCount="indefinite" path={d} />
                    <animate attributeName="opacity" values="0;.95;.95;0" keyTimes="0;.15;.85;1" dur="1.6s" begin={`${i * 0.22}s`} repeatCount="indefinite" />
                  </circle>
                ))}

              {/* nodes */}
              {NODES.map((node) => {
                const active = inView;
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x - node.w / 2}, ${node.y - 22})`}
                    opacity={active ? 1 : 0.12}
                    style={{ transition: `opacity .7s ease ${node.delay}s` }}
                  >
                    <rect
                      width={node.w}
                      height={44}
                      fill="#0A1117"
                      stroke={node.color}
                      strokeWidth={1}
                      strokeOpacity={active ? 0.8 : 0.25}
                      style={{ transition: `stroke-opacity .7s ease ${node.delay}s` }}
                    />
                    {/* corner accents */}
                    <path d={`M0,8 V0 H8`} stroke={node.color} strokeWidth={2} fill="none" opacity={active ? 1 : 0} style={{ transition: `opacity .5s ease ${node.delay + 0.15}s` }} />
                    <path d={`M${node.w},36 V44 H${node.w - 8}`} stroke={node.color} strokeWidth={2} fill="none" opacity={active ? 1 : 0} style={{ transition: `opacity .5s ease ${node.delay + 0.15}s` }} />
                    <text
                      x={node.w / 2}
                      y={node.sub ? 20 : 27}
                      textAnchor="middle"
                      fontSize={12}
                      letterSpacing={2}
                      fill={node.color}
                      fontWeight={700}
                    >
                      {node.label}
                    </text>
                    {node.sub && (
                      <text x={node.w / 2} y={34} textAnchor="middle" fontSize={7} letterSpacing={2} fill="#71808A">
                        {node.sub}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2 border-t border-neon/10 px-6 py-3 font-mono text-[9px] tracking-[0.25em] text-muted">
            <span><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-neon align-middle" aria-hidden="true" />COMPUTE</span>
            <span><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-cyan align-middle" aria-hidden="true" />INTERFACE / DATA</span>
            <span><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-warn align-middle" aria-hidden="true" />QUEUE</span>
            <span className="ml-auto hidden sm:inline">PACKETS :: SIMULATED VISUALIZATION</span>
          </div>
        </HUDPanel>
      </motion.div>
    </section>
  );
}
