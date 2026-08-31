"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import HUDPanel from "@/components/ui/HUDPanel";
import { Server, Database, Wifi, Layers, Activity, Zap, ArrowDown, ArrowRight } from "lucide-react";

type ArchNode = {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  w: number;
  color: string;
  delay: number;
  description?: string;
  tech?: string[];
};

const NODES: ArchNode[] = [
  {
    id: "clients",
    label: "CLIENTS",
    x: 400,
    y: 42,
    w: 120,
    color: "#71808A",
    delay: 0,
    description: "Web browsers, mobile apps, and API consumers connecting to the platform.",
    tech: ["React", "Next.js", "Mobile"],
  },
  {
    id: "nginx",
    label: "NGINX",
    sub: "REVERSE PROXY",
    x: 400,
    y: 138,
    w: 160,
    color: "#00F5A0",
    delay: 0.25,
    description: "Handles SSL termination, load balancing, rate limiting, and request routing.",
    tech: ["Nginx", "SSL", "Rate Limiting"],
  },
  {
    id: "rest",
    label: "REST API",
    sub: "STATELESS",
    x: 268,
    y: 244,
    w: 150,
    color: "#00D9FF",
    delay: 0.55,
    description: "Stateless HTTP endpoints for CRUD operations and business logic.",
    tech: ["Laravel", "OpenAPI", "JWT"],
  },
  {
    id: "ws",
    label: "WEBSOCKET",
    sub: "REALTIME",
    x: 532,
    y: 244,
    w: 150,
    color: "#00D9FF",
    delay: 0.65,
    description: "Persistent connections for real-time updates and bidirectional communication.",
    tech: ["Socket.io", "Redis Pub/Sub"],
  },
  {
    id: "app",
    label: "APPLICATION LAYER",
    sub: "DOMAIN LOGIC",
    x: 400,
    y: 348,
    w: 220,
    color: "#00F5A0",
    delay: 0.95,
    description: "Core business logic, domain services, and orchestration layer.",
    tech: ["Go", "PHP", "Domain-Driven"],
  },
  {
    id: "queue",
    label: "REDIS / QUEUE",
    sub: "JOB BUS",
    x: 400,
    y: 442,
    w: 190,
    color: "#FFB800",
    delay: 1.25,
    description: "Message broker for async job distribution, caching, and pub/sub events.",
    tech: ["Redis", "Laravel Horizon", "Queues"],
  },
  {
    id: "workers",
    label: "WORKERS",
    sub: "SCALED POOL",
    x: 268,
    y: 536,
    w: 150,
    color: "#00F5A0",
    delay: 1.55,
    description: "Horizontally scalable worker pool for CPU-intensive background jobs.",
    tech: ["Go Workers", "FFmpeg", "ImageMagick"],
  },
  {
    id: "db",
    label: "POSTGRESQL",
    sub: "PERSISTENCE",
    x: 532,
    y: 536,
    w: 170,
    color: "#00D9FF",
    delay: 1.7,
    description: "Primary data store with read replicas, backups, and point-in-time recovery.",
    tech: ["PostgreSQL", "Redis Cache", "Backups"],
  },
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

const nodeIcons: Record<string, React.ElementType> = {
  clients: Layers,
  nginx: Server,
  rest: Activity,
  ws: Wifi,
  app: Zap,
  queue: Activity,
  workers: Server,
  db: Database,
};

export default function Architecture() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [selectedNode, setSelectedNode] = useState<ArchNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const byId = new Map(NODES.map((n) => [n.id, n]));

  const handleNodeClick = useCallback((node: ArchNode) => {
    setSelectedNode((prev) => (prev?.id === node.id ? null : node));
  }, []);

  return (
    <section
      id="architecture"
      className="relative mx-auto max-w-7xl px-5 py-16 sm:px-12 sm:py-24 lg:px-16"
      aria-label="System architecture"
    >
      {/* Background decorative elements */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      >
        <div className="absolute top-1/3 left-10 h-72 w-72 bg-neon/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-10 h-64 w-64 bg-cyan/5 rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <SectionHeading index="04" kicker="trace --topology" title="SYSTEM TOPOLOGY" />
      </motion.div>

      {/* Architecture summary */}
      <motion.div
        className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {[
          { label: "LAYERS", value: "6", color: "#00f5a0", icon: Layers },
          { label: "SERVICES", value: "8", color: "#00d9ff", icon: Server },
          { label: "DATA FLOW", value: "BIDIRECTIONAL", color: "#ffb800", icon: ArrowRight },
          { label: "STATUS", value: "ACTIVE", color: "#00f5a0", icon: Activity },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="p-3 bg-panel/70 border border-neon/10 rounded-sm text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            whileHover={{ scale: 1.03, borderColor: stat.color, boxShadow: `0 0 20px ${stat.color}22` }}
          >
            <stat.icon className="mx-auto h-4 w-4 mb-1" style={{ color: stat.color }} aria-hidden="true" />
            <p className="font-mono text-[8px] tracking-[0.3em] text-muted">{stat.label}</p>
            <p className="mt-0.5 font-mono text-sm font-bold tracking-wider" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main topology map */}
        <motion.div
          className="lg:col-span-2"
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
                  const isHighlighted = hoveredNode === a || hoveredNode === b || selectedNode?.id === a || selectedNode?.id === b;
                  return (
                    <path
                      key={i}
                      d={path}
                      fill="none"
                      stroke={nb.color}
                      strokeWidth={isHighlighted ? 2 : 1}
                      opacity={inView ? (isHighlighted ? 0.8 : 0.35) : 0.08}
                      style={{
                        transition: `opacity .5s ease, stroke-width .3s ease`,
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
                  const isSelected = selectedNode?.id === node.id;
                  const isHovered = hoveredNode === node.id;
                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x - node.w / 2}, ${node.y - 22})`}
                      opacity={active ? 1 : 0.12}
                      style={{ transition: `opacity .7s ease ${node.delay}s`, cursor: "pointer" }}
                      onClick={() => handleNodeClick(node)}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      role="button"
                      tabIndex={0}
                      aria-label={`${node.label} - ${node.description || node.sub || ""}`}
                      onKeyDown={(e) => e.key === "Enter" && handleNodeClick(node)}
                    >
                      {/* Glow effect for selected/hovered */}
                      {(isSelected || isHovered) && (
                        <rect
                          x={-4}
                          y={-4}
                          width={node.w + 8}
                          height={52}
                          fill="none"
                          stroke={node.color}
                          strokeWidth={1}
                          strokeOpacity={0.3}
                          rx={4}
                        >
                          <animate attributeName="stroke-opacity" values="0.3;0.6;0.3" dur="1.5s" repeatCount="indefinite" />
                        </rect>
                      )}
                      <rect
                        width={node.w}
                        height={44}
                        fill={isSelected ? `${node.color}15` : "#0A1117"}
                        stroke={isSelected ? node.color : node.color}
                        strokeWidth={isSelected ? 2 : 1}
                        strokeOpacity={active ? (isSelected ? 1 : 0.8) : 0.25}
                        style={{ transition: `stroke-opacity .7s ease ${node.delay}s, fill .3s ease` }}
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

        {/* Node detail panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.2 }}
        >
          <HUDPanel
            title="node.inspector"
            cornerColor="rgba(255,184,0,.55)"
            status={{ label: selectedNode ? "SELECTED" : "IDLE", tone: selectedNode ? "online" : "idle" }}
            className="h-full"
          >
            <div className="p-6">
              <AnimatePresence mode="wait">
                {selectedNode ? (
                  <motion.div
                    key={selectedNode.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Node header */}
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        className="p-2 bg-black/30 rounded-sm border"
                        style={{ borderColor: `${selectedNode.color}44` }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {(() => {
                          const Icon = nodeIcons[selectedNode.id] || Server;
                          return <Icon className="h-5 w-5" style={{ color: selectedNode.color }} aria-hidden="true" />;
                        })()}
                      </motion.div>
                      <div>
                        <h3 className="font-mono text-sm font-bold tracking-wider" style={{ color: selectedNode.color }}>
                          {selectedNode.label}
                        </h3>
                        {selectedNode.sub && (
                          <p className="font-mono text-[9px] tracking-[0.2em] text-muted">{selectedNode.sub}</p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {selectedNode.description && (
                      <p className="mb-4 font-mono text-[11px] leading-relaxed text-frost/75">
                        {selectedNode.description}
                      </p>
                    )}

                    {/* Tech stack */}
                    {selectedNode.tech && (
                      <div className="mb-4">
                        <p className="mb-2 font-mono text-[9px] tracking-[0.3em] text-muted">TECHNOLOGIES:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedNode.tech.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 bg-black/30 border border-neon/10 font-mono text-[9px] tracking-wider text-muted rounded-sm"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Connections */}
                    <div>
                      <p className="mb-2 font-mono text-[9px] tracking-[0.3em] text-muted">CONNECTIONS:</p>
                      <div className="space-y-1">
                        {LINKS.filter(([a, b]) => a === selectedNode.id || b === selectedNode.id).map(([a, b]) => {
                          const other = a === selectedNode.id ? byId.get(b) : byId.get(a);
                          if (!other) return null;
                          const isIn = b === selectedNode.id;
                          return (
                            <div key={`${a}-${b}`} className="flex items-center gap-2 font-mono text-[10px] text-frost/60">
                              <span style={{ color: other.color }}>•</span>
                              <span>{isIn ? "← FROM" : "→ TO"}</span>
                              <span style={{ color: other.color }}>{other.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <Server className="mx-auto h-10 w-10 text-neon/20 mb-3" aria-hidden="true" />
                    <p className="font-mono text-[10px] tracking-[0.3em] text-muted">CLICK A NODE TO INSPECT</p>
                    <p className="mt-2 font-mono text-[9px] text-muted/60">Select any component in the topology map to view its details, technologies, and connections.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </HUDPanel>
        </motion.div>
      </div>
    </section>
  );
}