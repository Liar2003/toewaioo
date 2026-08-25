"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import HUDPanel from "@/components/ui/HUDPanel";
import { techCategories } from "@/data/techStack";
import { Hexagon } from "lucide-react";

export default function TechStack() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <section id="stack" className="relative mx-auto max-w-7xl px-6 py-24 sm:px-12 lg:px-16" aria-label="Technology stack">
      <SectionHeading index="02" kicker="cat arsenal.sys" title="TECHNOLOGY ARSENAL" />

      {/* constellation header */}
      <div className="mb-10 hidden items-center justify-center font-mono text-[10px] tracking-[0.3em] text-muted md:flex" aria-hidden="true">
        <span>BACKEND</span>
        <span className="mx-4 h-px w-16 bg-neon/30" />
        <span className="text-neon">◆</span>
        <span className="mx-4 h-px w-16 bg-cyan/30" />
        <span>FRONTEND</span>
        <span className="mx-4 h-px w-16 bg-neon/30" />
        <span className="text-neon">◆</span>
        <span className="mx-4 h-px w-16 bg-cyan/30" />
        <span>DATABASE</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {techCategories.map((category, i) => (
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
              cornerColor={activeCategory === category.id ? "rgba(0,217,255,.7)" : undefined}
              className={`h-full transition-shadow duration-300 ${
                activeCategory === category.id ? "shadow-hud border-neon/30" : ""
              }`}
              status={{
                label: `${category.items.length} MODULES`,
                tone: activeCategory === category.id ? "online" : "idle",
              }}
            >
              <div className="p-6">
                <div className="mb-5 flex items-center gap-3">
                  <Hexagon
                    className={`h-4 w-4 transition-colors duration-300 ${
                      activeCategory === category.id ? "text-cyan" : "text-neon"
                    }`}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <h3 className="font-mono text-sm font-bold tracking-[0.25em] text-frost">
                    {category.name}
                  </h3>
                </div>
                <ul className="flex flex-wrap gap-2" aria-label={`${category.name} technologies`}>
                  {category.items.map((item) => (
                    <li
                      key={item}
                      tabIndex={0}
                      className="cursor-default border border-white/8 bg-black/40 px-2.5 py-1 font-mono text-[11px] tracking-wider text-frost/75 transition-all duration-200 hover:border-cyan/50 hover:text-cyan hover:shadow-[0_0_12px_rgba(0,217,255,.15)] focus-visible:border-cyan/60"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </HUDPanel>
          </motion.div>
        ))}

        {/* architecture flow filler panel */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.45, delay: 0.16 }}
        >
          <HUDPanel title="05.cluster_link" cornerColor="rgba(255,184,0,.5)" className="h-full" status={{ label: "LINKED", tone: "warning" }}>
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
    </section>
  );
}
