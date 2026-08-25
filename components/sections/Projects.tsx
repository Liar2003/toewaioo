"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { projects, type Project } from "@/data/projects";
import { ChevronDown } from "lucide-react";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ).current;

  const handleMove = (e: React.MouseEvent) => {
    if (reduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -py * 6, ry: px * 8 });
  };

  const resetTilt = () => {
    setTilt({ rx: 0, ry: 0 });
    setHovered(false);
  };

  return (
    <motion.article
      ref={cardRef}
      className="hud-corner group relative border bg-panel/70 backdrop-blur-sm transition-colors duration-300"
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: tilt.rx === 0 && tilt.ry === 0 ? "transform .5s ease" : "transform .08s linear",
      }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={resetTilt}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      aria-label={`${project.name} — ${project.category}`}
    >
      {/* border glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 border transition-all duration-300"
        style={{
          borderColor: hovered ? "rgba(0,245,160,.55)" : "rgba(255,255,255,.06)",
          boxShadow: hovered ? "0 0 24px rgba(0,245,160,.18), inset 0 0 20px rgba(0,245,160,.05)" : "none",
        }}
        aria-hidden="true"
      />

      <div className="relative p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`font-mono text-[10px] tracking-[0.35em] transition-all duration-300 ${hovered ? "text-cyan" : "text-muted"}`}>
              {project.codeName}
            </p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-muted">
              {project.category}
            </p>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-neon">
            <span className="inline-block h-1.5 w-1.5 animate-pulseDot rounded-full bg-neon" aria-hidden="true" />
            {project.status.toUpperCase()}
          </span>
        </div>

        <h3 className="glitch mt-4 text-xl font-bold tracking-tight text-frost sm:text-2xl" data-text={project.name}>
          {project.name}
        </h3>

        <p className="mt-3 min-h-[60px] text-sm leading-relaxed text-frost/70">
          {project.description}
        </p>

        <div className="mt-5">
          <p className="mb-2 font-mono text-[9px] tracking-[0.3em] text-muted">STACK:</p>
          <p className="font-mono text-[11px] leading-relaxed tracking-wide text-neon/85">
            {project.technologies.join(" • ")}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={`${project.id}-details`}
            className="btn-hud !px-4 !py-2 !text-[10px]"
          >
            {open ? "[ CLOSE CASE STUDY ]" : "[ VIEW CASE STUDY ]"}
            <ChevronDown
              className={`h-3 w-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
          <button
            aria-disabled={!project.github}
            title={project.github ? undefined : "Source link not configured"}
            className="btn-hud-ghost !px-4 !py-2 !text-[10px]"
          >
            [ SOURCE CODE ]
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={`${project.id}-details`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-6 grid gap-6 border-t border-neon/15 pt-5 md:grid-cols-2">
                {project.architecture && (
                  <div>
                    <p className="mb-3 font-mono text-[9px] tracking-[0.3em] text-cyan">SYSTEM_FLOW:</p>
                    <ol className="space-y-1.5 font-mono text-[11px] tracking-wide">
                      {project.architecture.map((step, i) => (
                        <li key={step} className="flex items-center gap-2 text-frost/80">
                          <span className="text-neon">{String(i + 1).padStart(2, "0")}</span>
                          {step.toUpperCase()}
                          {i < project.architecture!.length - 1 && (
                            <span className="text-muted" aria-hidden="true">↓</span>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {(project.highlights ?? project.features) && (
                  <div>
                    <p className="mb-3 font-mono text-[9px] tracking-[0.3em] text-cyan">
                      {project.highlights ? "ENGINEERING_TOPICS:" : "CAPABILITIES:"}
                    </p>
                    <ul className="grid grid-cols-1 gap-1.5 font-mono text-[11px] tracking-wide text-frost/75 sm:grid-cols-2 md:grid-cols-1">
                      {(project.highlights ?? project.features)!.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="text-neon" aria-hidden="true">▸</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative mx-auto max-w-7xl px-6 py-24 sm:px-12 lg:px-16" aria-label="Projects">
      <SectionHeading index="03" kicker="ls /deployments" title="DEPLOYED MISSIONS" />
      <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
