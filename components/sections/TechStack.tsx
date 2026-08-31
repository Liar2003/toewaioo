"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import HUDPanel from "@/components/ui/HUDPanel";
import { usePrefersFinePointer } from "@/components/ui/hooks";
import { techCategories } from "@/data/techStack";
import { Hexagon, Layers, Code, Server, Database, Globe, Shield, Loader2 } from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
  backend: Server,
  frontend: Code,
  databases: Database,
  infrastructure: Globe,
  architecture: Layers,
};

const categoryColors: Record<string, string> = {
  backend: "#00f5a0",
  frontend: "#00d9ff",
  databases: "#ffb800",
  infrastructure: "#ff3864",
  architecture: "#00d9ff",
};

export default function TechStack() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const finePointer = usePrefersFinePointer();

  useEffect(() => {
    const image = new Image();
    image.src = "/images/tech-constellation.svg";
    const handleLoad = () => setImageLoaded(true);
    const handleError = () => setImageLoaded(true);

    image.onload = handleLoad;
    image.onerror = handleError;

    if (image.complete) {
      handleLoad();
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stack"
      className="relative mx-auto max-w-7xl px-5 py-16 sm:px-12 sm:py-24 lg:px-16"
      aria-label="Technology stack"
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
        <div className="absolute top-1/4 right-10 h-80 w-80 bg-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-10 h-64 w-64 bg-neon/5 rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <SectionHeading index="02" kicker="cat arsenal.sys" title="TECHNOLOGY ARSENAL" />
      </motion.div>

      {/* Constellation Header */}
      <motion.div
        className="mb-10 hidden items-center justify-center font-mono text-[10px] tracking-[0.3em] text-muted md:flex"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        aria-hidden="true"
      >
        <span>BACKEND</span>
        <span className="mx-4 h-px w-16 bg-neon/30" />
        <span className="text-neon">◆</span>
        <span className="mx-4 h-px w-16 bg-cyan/30" />
        <span>FRONTEND</span>
        <span className="mx-4 h-px w-16 bg-neon/30" />
        <span className="text-neon">◆</span>
        <span className="mx-4 h-px w-16 bg-cyan/30" />
        <span>DATABASE</span>
      </motion.div>

      {/* Tech Constellation Visualization */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <HUDPanel
          title="tech.constellation"
          cornerColor="rgba(0,217,255,.55)"
          status={{ label: inView ? "MAPPED" : "LOADING", tone: inView ? "online" : "idle" }}
        >
          <motion.div
            className="relative overflow-hidden rounded-[22px] border border-neon/15 bg-[radial-gradient(circle_at_top,_rgba(0,245,160,0.12),_transparent_35%),rgba(5,11,13,0.82)] p-3 shadow-[0_0_30px_rgba(0,245,160,0.08)] sm:p-6"
            whileHover={finePointer ? { y: -4 } : undefined}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <AnimatePresence mode="wait">
              {!imageLoaded && (
                <motion.div
                  key="loading"
                  className="flex aspect-[16/9] items-center justify-center rounded-md border border-neon/10 bg-gradient-to-br from-panel/60 to-panel/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center">
                    <Loader2 className="mx-auto h-10 w-10 text-cyan/40 animate-spin" aria-hidden="true" />
                    <p className="mt-4 font-mono text-[9px] tracking-[0.3em] text-cyan/60">MAPPING CONSTELLATION...</p>
                    <motion.div
                      className="mt-2 h-px w-48 mx-auto bg-cyan/30 overflow-hidden"
                      animate={{ width: ["0%", "100%", "0%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="h-full w-1/3 bg-cyan animate-ping" />
                    </motion.div>
                  </div>
                </motion.div>
              )}
              {imageLoaded && (
                <motion.img
                  key="constellation"
                  src="/images/tech-constellation.svg"
                  alt="Technology constellation map showing backend, frontend, data, and infrastructure clusters with connections"
                  className="mx-auto h-auto w-full max-w-5xl object-contain"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                  style={{ filter: "contrast(1.08) saturate(1.1)" }}
                  initial={{ scale: 1.02, opacity: 0, filter: "blur(8px)" }}
                  animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              )}
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,_rgba(255,255,255,0.03),_transparent_25%,_transparent_75%,_rgba(255,255,255,0.015))]" />
          </motion.div>
        </HUDPanel>
      </motion.div>

      {/* Category Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {techCategories.map((category, i) => {
          const Icon = categoryIcons[category.id] || Hexagon;
          const color = categoryColors[category.id] || "#00f5a0";
          const isActive = activeCategory === category.id;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              onMouseEnter={() => setActiveCategory(category.id)}
              onMouseLeave={() => setActiveCategory(null)}
              onFocus={() => setActiveCategory(category.id)}
              onBlur={() => setActiveCategory(null)}
            >
              <HUDPanel
                title={`${String(i + 1).padStart(2, "0")}.cluster`}
                cornerColor={isActive ? "rgba(0,217,255,.7)" : undefined}
                className={`h-full transition-all duration-300 ${
                  isActive ? "shadow-hud border-neon/30 scale-[1.02]" : ""
                }`}
                status={{
                  label: `${category.items.length} MODULES`,
                  tone: isActive ? "online" : "idle",
                }}
              >
                <div className="p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <motion.div
                      className="p-2 bg-black/30 rounded-sm border border-neon/10"
                      animate={{
                        borderColor: isActive ? color : "rgba(0,245,160,.1)",
                        boxShadow: isActive ? `0 0 20px ${color}33, inset 0 0 20px ${color}11` : "none",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: isActive ? color : "#71808a" }}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </motion.div>
                    <div>
                      <h3 className="font-mono text-sm font-bold tracking-[0.25em] text-frost">
                        {category.name}
                      </h3>
                      <p className="font-mono text-[9px] tracking-[0.2em] text-muted mt-0.5">
                        {category.items.length} technologies
                      </p>
                    </div>
                  </div>

                  <ul className="flex flex-wrap gap-2" aria-label={`${category.name} technologies`}>
                    {category.items.map((item, j) => (
                      <motion.li
                        key={item}
                        tabIndex={0}
                        className="cursor-default border border-white/8 bg-black/40 px-2.5 py-1 font-mono text-[11px] tracking-wider text-frost/75 transition-all duration-200 hover:border-cyan/50 hover:text-cyan hover:shadow-[0_0_12px_rgba(0,217,255,.15)] focus-visible:border-cyan/60"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + j * 0.03 }}
                        whileHover={{ y: -2, scale: 1.05 }}
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </HUDPanel>
            </motion.div>
          );
        })}

        {/* Architecture Flow Panel */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.45, delay: 0.16 }}
        >
          <HUDPanel
            title="06.cluster_link"
            cornerColor="rgba(255,184,0,.5)"
            className="h-full"
            status={{ label: "LINKED", tone: "warning" }}
          >
            <div className="flex flex-col justify-between gap-4 p-6">
              <pre className="overflow-x-auto font-mono text-[11px] leading-5 text-muted" aria-hidden="true">
{`        BACKEND
           │
   ┌───────┼───────┐
 PHP   LARAVEL    GO
   │       │       │
   └───────┼───────┘
           │
       DATABASE
           │
 POSTGRESQL / REDIS`}
              </pre>
              <p className="font-mono text-[10px] leading-relaxed tracking-wider text-muted">
                &gt; Clusters interconnect — every layer is designed against the whole system.
              </p>
            </div>
          </HUDPanel>
        </motion.div>
      </div>

      {/* Summary Stats */}
      <motion.div
        className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {[
          { label: "LANGUAGES", value: "8+", color: "#00f5a0" },
          { label: "FRAMEWORKS", value: "12+", color: "#00d9ff" },
          { label: "DATABASES", value: "3", color: "#ffb800" },
          { label: "INFRA TOOLS", value: "7+", color: "#ff3864" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="p-4 bg-panel/70 border border-neon/10 rounded-sm text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            whileHover={{
              scale: 1.03,
              borderColor: stat.color,
              boxShadow: `0 0 24px ${stat.color}22, inset 0 0 20px ${stat.color}08`,
            }}
          >
            <p className="font-mono text-[9px] tracking-[0.3em] text-muted">{stat.label}</p>
            <motion.p
              className="mt-1 font-mono text-2xl font-bold tracking-wider"
              style={{ color: stat.color }}
              animate={{
                textShadow: [
                  `0 0 12px ${stat.color}73`,
                  `0 0 24px ${stat.color}b3, 0 0 48px ${stat.color}4d`,
                  `0 0 12px ${stat.color}73`,
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
            >
              {stat.value}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}