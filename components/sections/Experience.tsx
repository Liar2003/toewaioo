"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import HUDPanel from "@/components/ui/HUDPanel";
import { experience, principles, type ExperienceEntry } from "@/data/experience";
import { Briefcase, Code, BookOpen, ChevronRight, Zap, TrendingUp, Shield, Lock, Wrench, Eye } from "lucide-react";

const typeConfig = {
  work: { icon: Briefcase, color: "#00f5a0", label: "PROFESSIONAL" },
  project: { icon: Code, color: "#00d9ff", label: "PERSONAL PROJECT" },
  learning: { icon: BookOpen, color: "#ffb800", label: "LEARNING" },
};

const principleIcons: Record<string, React.ElementType> = {
  Performance: Zap,
  Scalability: TrendingUp,
  Reliability: Shield,
  Security: Lock,
  Maintainability: Wrench,
  Observability: Eye,
};

const principleColors: Record<string, string> = {
  Performance: "#00f5a0",
  Scalability: "#00d9ff",
  Reliability: "#ffb800",
  Security: "#ff3864",
  Maintainability: "#00d9ff",
  Observability: "#00f5a0",
};

function ExperienceCard({ entry, index }: { entry: ExperienceEntry; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const config = typeConfig[entry.type];
  const Icon = config.icon;

  return (
    <motion.div
      className="group relative pb-10 last:pb-0"
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Timeline connector */}
      <div className="absolute -left-8 top-0 bottom-0 w-px bg-gradient-to-b from-neon/40 via-neon/20 to-transparent" aria-hidden="true" />
      
      {/* Timeline node */}
      <motion.span
        className="absolute -left-10 top-1 inline-block h-[19px] w-[19px] border-2 bg-void transition-all duration-300 group-hover:shadow-neon-sm"
        style={{ borderColor: config.color }}
        whileHover={{ scale: 1.2 }}
        aria-hidden="true"
      >
        <motion.span
          className="absolute inset-[4px]"
          style={{ backgroundColor: config.color }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
        />
      </motion.span>

      {/* Year badge */}
      <motion.div
        className="flex items-center gap-3 mb-2"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 + index * 0.1 }}
      >
        <span
          className="font-mono text-xs tracking-[0.2em] font-bold sm:tracking-[0.35em]"
          style={{ color: config.color }}
        >
          {entry.year}
        </span>
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 border rounded-sm font-mono text-[8px] tracking-widest"
          style={{ borderColor: `${config.color}44`, color: config.color, backgroundColor: `${config.color}11` }}
        >
          <Icon className="h-2.5 w-2.5" aria-hidden="true" />
          {config.label}
        </span>
      </motion.div>

      {/* Role */}
      <motion.h3
        className="text-lg font-bold tracking-wide text-frost"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 + index * 0.1 }}
      >
        {entry.role.toUpperCase()}
      </motion.h3>

      {entry.company && (
        <motion.p
          className="mt-1 font-mono text-xs tracking-wider text-cyan"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + index * 0.1 }}
        >
          @ {entry.company}
        </motion.p>
      )}

      {/* Description */}
      <motion.p
        className="mt-2 max-w-md font-mono text-[11px] leading-relaxed tracking-wide text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 + index * 0.1 }}
      >
        {entry.description}
      </motion.p>

      {/* Highlights expandable */}
      {entry.highlights && entry.highlights.length > 0 && (
        <motion.div
          className="mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          <button
            onClick={() => setExpanded(!expanded)}
            className="group/btn flex items-center gap-1.5 font-mono text-[10px] tracking-wider transition-colors hover:text-neon"
            style={{ color: config.color }}
            aria-expanded={expanded}
          >
            <motion.span
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ChevronRight className="h-3 w-3" />
            </motion.span>
            {expanded ? "HIDE DETAILS" : "VIEW HIGHLIGHTS"}
          </button>
          
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="overflow-hidden"
              >
                <ul className="mt-3 space-y-1.5 pl-4 border-l border-neon/10">
                  {entry.highlights.map((highlight, i) => (
                    <motion.li
                      key={highlight}
                      className="flex items-start gap-2 font-mono text-[10px] leading-relaxed text-frost/75"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <motion.span
                        className="mt-0.5"
                        style={{ color: config.color }}
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                        aria-hidden="true"
                      >
                        ▸
                      </motion.span>
                      {highlight}
                    </motion.li>
                  ))}
                </ul>

                {entry.technologies && entry.technologies.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {entry.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 bg-black/30 border border-neon/10 font-mono text-[9px] tracking-wider text-muted rounded-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative mx-auto max-w-7xl px-5 py-16 sm:px-12 sm:py-24 lg:px-16"
      aria-label="Experience and engineering principles"
    >
      {/* Background decorative elements */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      >
        <div className="absolute top-20 left-20 h-64 w-64 bg-neon/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 h-80 w-80 bg-cyan/5 rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <SectionHeading index="05" kicker="tail -f career.log" title="OPERATION LOG" />
      </motion.div>

      {/* Summary stats */}
      <motion.div
        className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {[
          { label: "EXPERIENCE", value: "3+ YEARS", color: "#00f5a0" },
          { label: "PROJECTS", value: "6+", color: "#00d9ff" },
          { label: "TECHNOLOGIES", value: "20+", color: "#ffb800" },
          { label: "STATUS", value: "LEARNING", color: "#ff3864" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="p-3 bg-panel/70 border border-neon/10 rounded-sm text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            whileHover={{ scale: 1.03, borderColor: stat.color, boxShadow: `0 0 20px ${stat.color}22` }}
          >
            <p className="font-mono text-[8px] tracking-[0.3em] text-muted">{stat.label}</p>
            <p className="mt-1 font-mono text-sm font-bold tracking-wider" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Timeline */}
        <div className="relative pl-8" aria-label="Experience timeline">
          <div className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-neon/60 via-neon/20 to-transparent" aria-hidden="true" />
          {experience.map((entry, i) => (
            <ExperienceCard key={entry.year + entry.role} entry={entry} index={i} />
          ))}
        </div>

        {/* Principles */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <HUDPanel
            title="engineering_protocol"
            status={{ label: "ENFORCED", tone: "online" }}
            className="h-full"
          >
            <div className="p-6">
              <p className="mb-4 font-mono text-[10px] tracking-[0.3em] text-muted">CORE PRINCIPLES:</p>
              <ul className="space-y-1">
                {principles.map((principle, i) => {
                  const Icon = principleIcons[principle.title] || Zap;
                  const color = principleColors[principle.title] || "#00f5a0";
                  return (
                    <motion.li
                      key={principle.title}
                      className="group p-4 rounded-sm border border-transparent transition-all duration-300 hover:bg-white/[0.02] hover:border-neon/10"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-start gap-3">
                        <motion.div
                          className="mt-0.5 p-1.5 bg-black/30 rounded-sm border border-neon/10 flex-shrink-0"
                          whileHover={{ scale: 1.1, rotate: 15 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <Icon className="h-4 w-4" style={{ color }} aria-hidden="true" />
                        </motion.div>
                        <div>
                          <p className="font-mono text-xs font-bold tracking-[0.25em]" style={{ color }}>
                            {principle.title.toUpperCase()}
                          </p>
                          <p className="mt-1 font-mono text-[11px] leading-relaxed tracking-wide text-muted">
                            {principle.statement}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </HUDPanel>
        </motion.div>
      </div>
    </section>
  );
}