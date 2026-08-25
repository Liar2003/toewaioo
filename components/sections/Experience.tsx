"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import HUDPanel from "@/components/ui/HUDPanel";
import { experience, principles } from "@/data/experience";

export default function Experience() {
  return (
    <section id="experience" className="relative mx-auto max-w-7xl px-6 py-24 sm:px-12 lg:px-16" aria-label="Experience and engineering principles">
      <SectionHeading index="05" kicker="tail -f career.log" title="OPERATION LOG" />

      <div className="grid gap-10 lg:grid-cols-2">
        {/* timeline */}
        <div className="relative pl-8" aria-label="Experience timeline">
          <div className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-neon/60 via-neon/20 to-transparent" aria-hidden="true" />
          {experience.map((entry, i) => (
            <motion.div
              key={entry.year}
              className="group relative pb-10 last:pb-0"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <span
                className="absolute -left-8 top-1 inline-block h-[15px] w-[15px] border border-neon/60 bg-void transition-all duration-300 group-hover:shadow-neon-sm"
                aria-hidden="true"
              >
                <span className="absolute inset-[4px] bg-neon/70 transition-colors group-hover:bg-neon" />
              </span>
              <p className="font-mono text-xs tracking-[0.35em] text-neon">
                {entry.year}
              </p>
              <h3 className="mt-1.5 text-lg font-bold tracking-wide text-frost">
                {entry.role.toUpperCase()}
              </h3>
              <p className="mt-1.5 max-w-md font-mono text-xs leading-relaxed tracking-wide text-muted">
                {entry.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* principles */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <HUDPanel title="engineering_protocol" status={{ label: "ENFORCED", tone: "online" }} className="h-full">
            <ul className="divide-y divide-neon/10">
              {principles.map((principle) => (
                <li key={principle.title} className="group p-5 transition-colors duration-200 hover:bg-white/[0.02]">
                  <p className="flex items-center gap-3 font-mono text-xs font-bold tracking-[0.3em] text-cyan">
                    <span className="text-neon transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">▸</span>
                    {principle.title.toUpperCase()}
                  </p>
                  <p className="mt-2 pl-6 font-mono text-[11px] leading-relaxed tracking-wide text-muted">
                    {principle.statement}
                  </p>
                </li>
              ))}
            </ul>
          </HUDPanel>
        </motion.div>
      </div>
    </section>
  );
}
