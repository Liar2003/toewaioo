"use client";

import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import HUDPanel from "@/components/ui/HUDPanel";
import TerminalText from "@/components/ui/TerminalText";
import StatusIndicator from "@/components/ui/StatusIndicator";
import { usePrefersFinePointer } from "@/components/ui/hooks";
import { profile } from "@/data/profile";
import { MapPin, Crosshair, Shield, Cpu, Database, Globe, Target, Zap, Code, Server } from "lucide-react";

const attributeIcons = {
  "Backend Architecture": Cpu,
  "System Design": Database,
  "DevOps & Infrastructure": Globe,
  "Security & Performance": Shield,
};

const focusIcons = {
  "Backend Architecture": Server,
  "Full-Stack Development": Code,
  "API Engineering": Zap,
  "Database Design": Database,
  "DevOps": Globe,
  "Automation": Target,
};

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [skillsLoaded, setSkillsLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const finePointer = usePrefersFinePointer();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const headingParallax = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  // Smooth mouse tracking for parallax (desktop only)
  const springMouseX = useSpring(mousePos.x, { stiffness: 100, damping: 20 });
  const springMouseY = useSpring(mousePos.y, { stiffness: 100, damping: 20 });

  useEffect(() => {
    if (!finePointer) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [finePointer]);

  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ).current;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative mx-auto max-w-7xl px-5 py-16 sm:px-12 sm:py-24 lg:px-16"
      aria-label="About"
      onMouseMove={(e) => {
        if (!finePointer) return;
        const rect = sectionRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
        setMousePos({ x, y });
      }}
    >
      {/* Background decorative elements with mouse parallax */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.1, 1],
        }}
        style={reduced ? undefined : { x: springMouseX, y: springMouseY }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/4 h-72 w-72 bg-neon/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 bg-cyan/5 rounded-full blur-3xl" />
        {/* Floating geometric shapes — desktop only */}
        <motion.div
          className="absolute top-20 left-20 hidden h-16 w-16 border border-neon/10 rounded-lg rotate-45 lg:block"
          animate={{ rotate: [45, 405], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-30 right-30 hidden h-12 w-12 border border-cyan/10 rounded-full lg:block"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-10 hidden h-8 w-8 border border-warn/10 rotate-12 lg:block"
          animate={{ rotate: [12, 372], y: [-10, 10, -10] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      <motion.div
        style={{ y: headingParallax, opacity: headingOpacity }}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <SectionHeading index="01" kicker="cat operator.dossier" title="THE OPERATOR" />
      </motion.div>

      <motion.div
        className="grid gap-8 lg:grid-cols-5"
        initial="initial"
        animate={inView ? "inView" : "initial"}
        variants={{
          initial: { opacity: 0 },
          inView: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
          },
        }}
      >
        {/* Avatar / Profile Visual */}
        <motion.div
          className="lg:col-span-2"
          variants={{
            initial: { opacity: 0, y: 40, scale: 0.98 },
            inView: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
            },
          }}
        >
          <HUDPanel
            title="operator.avatar"
            cornerColor="rgba(0,245,160,.55)"
            status={{ label: "ACTIVE", tone: "online" }}
            className="h-full relative overflow-hidden"
          >
            <div className="relative p-6">
              {/* Avatar Image with hover effects */}
              <div className="relative mx-auto max-w-xs mb-6">
                <div className="relative aspect-square overflow-hidden rounded-xl border border-neon/20 bg-gradient-to-br from-panel/50 to-panel/20">
                  {/* Glow ring behind avatar */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      background: "radial-gradient(circle at center, rgba(0,245,160,0.2) 0%, transparent 70%)",
                    }}
                  />
                  
                  <AnimatePresence mode="wait">
                    {!avatarLoaded && (
                      <motion.div
                        key="loading"
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="text-center">
                          <motion.div
                            className="mx-auto h-16 w-16 border-2 border-neon/20 border-t-neon rounded-full animate-spin"
                          />
                          <p className="mt-4 font-mono text-[9px] tracking-[0.3em] text-neon/60">LOADING AVATAR</p>
                          <motion.div
                            className="mt-2 h-px w-32 mx-auto bg-neon/30 overflow-hidden"
                            animate={{ width: ["0%", "100%", "0%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          >
                            <div className="h-full w-1/3 bg-neon animate-ping" />
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                    {avatarLoaded && (
                      <motion.img
                        key="avatar"
                        src="/images/profile-avatar.svg"
                        alt={`${profile.name} — Full-Stack Engineer avatar`}
                        className="absolute inset-0 w-full h-full object-cover"
                        onLoad={() => setAvatarLoaded(true)}
                        onError={() => setAvatarLoaded(true)}
                        style={{ filter: "contrast(1.05) saturate(1.1)" }}
                        initial={{ scale: 1.1, opacity: 0, filter: "blur(10px)" }}
                        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Corner brackets overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="vf-frame" style={{ "--vf-color": "rgba(0,245,160,0.6)" } as React.CSSProperties}>
                      <div className="vf-corner vf-tl" />
                      <div className="vf-corner vf-tr" />
                      <div className="vf-corner vf-bl" />
                      <div className="vf-corner vf-br" />
                      <div className="vf-tick vf-tick-t" />
                      <div className="vf-tick vf-tick-b" />
                      <div className="vf-tick vf-tick-l" />
                      <div className="vf-tick vf-tick-r" />
                      <motion.div
                        className="vf-sweep"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      />
                    </div>
                  </div>

                  {/* Status indicator pulse */}
                  <motion.div
                    className="absolute -bottom-2 -right-2 h-6 w-6 bg-neon border-4 border-void rounded-full"
                    animate={{ boxShadow: ["0 0 0 0 rgba(0,245,160,0.6)", "0 0 0 8px rgba(0,245,160,0)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>

              {/* Name & Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-center"
              >
                <motion.div
                  className="mb-3 inline-block"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <Crosshair className="h-8 w-8 text-cyan mx-auto" strokeWidth={1.25} aria-hidden="true" />
                </motion.div>
                <motion.p
                  className="font-mono text-xl font-bold tracking-widest text-frost sm:text-2xl"
                  animate={{ letterSpacing: ["0.2em", "0.25em", "0.2em"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {profile.name.toUpperCase()}
                </motion.p>
                <TerminalText
                  text={`>> ${profile.title.toUpperCase()}`}
                  className="mt-1 block font-mono text-xs tracking-widest text-cyan"
                />
              </motion.div>

              {/* Details */}
              <motion.dl
                className="space-y-4 border-t border-neon/10 pt-4 font-mono text-xs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <motion.div
                  className="flex items-center justify-between group"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <dt className="tracking-[0.25em] text-muted">LOCATION</dt>
                  <dd className="flex items-center gap-1.5 text-frost">
                    <motion.span whileHover={{ scale: 1.2, rotate: 180 }} transition={{ duration: 0.5 }}>
                      <MapPin className="h-3 w-3 text-neon" aria-hidden="true" />
                    </motion.span>
                    {profile.location.toUpperCase()}
                  </dd>
                </motion.div>
                <motion.div
                  className="flex items-center justify-between group"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <dt className="tracking-[0.25em] text-muted">STATUS</dt>
                  <dd>
                    <StatusIndicator label={profile.availability.toUpperCase()} />
                  </dd>
                </motion.div>
                <motion.div
                  className="flex items-center justify-between group"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <dt className="tracking-[0.25em] text-muted">CLEARANCE</dt>
                  <dd className="text-neon">FULL-STACK</dd>
                </motion.div>
              </motion.dl>
            </div>
          </HUDPanel>
        </motion.div>

        {/* Dossier / Bio */}
        <motion.div
          className="lg:col-span-3"
          variants={{
            initial: { opacity: 0, y: 40, scale: 0.98 },
            inView: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.65, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
            },
          }}
        >
          <HUDPanel title="operator.dossier" status={{ label: "DECRYPTED" }}>
            <div className="space-y-5 p-6">
              {profile.about.map((paragraph, i) => (
                <motion.p
                  key={i}
                  className="text-sm leading-relaxed text-frost/85 sm:text-base"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                >
                  <motion.span
                    className="mr-2 font-mono text-neon"
                    animate={{ opacity: [0.7, 1, 0.7], x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    {'>'}
                  </motion.span>
                  {paragraph}
                </motion.p>
              ))}
              <motion.div
                className="border-t border-neon/10 pt-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <p className="mb-3 font-mono text-[10px] tracking-[0.3em] text-muted">PRIMARY_FOCUS:</p>
                <ul className="flex flex-wrap gap-2" aria-label="Focus areas">
                  {profile.focus.map((item, i) => {
                    const Icon = focusIcons[item as keyof typeof focusIcons] || Code;
                    return (
                      <motion.li
                        key={item}
                        className="group relative flex items-center gap-1.5 border border-neon/20 bg-neon/5 px-2.5 py-1.5 font-mono text-[11px] tracking-wider text-neon/90 cursor-default"
                        initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        whileHover={{ scale: 1.05, y: -2, borderColor: "rgba(0,245,160,.6)", boxShadow: "0 8px 24px rgba(0,245,160,.15)" }}
                        transition={{ delay: 0.55 + i * 0.05, type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Icon className="h-3 w-3 text-neon/60 group-hover:text-neon transition-colors" aria-hidden="true" />
                        {item.toUpperCase()}
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.div>
            </div>
          </HUDPanel>
        </motion.div>
      </motion.div>

      {/* Skills Map Visualization */}
      <motion.div
        className="mt-10 relative"
        initial="initial"
        animate={inView ? "inView" : "initial"}
        variants={{
          initial: { opacity: 0, y: 40 },
          inView: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
          },
        }}
      >
        <HUDPanel
          title="skills.topology"
          cornerColor="rgba(0,217,255,.55)"
          status={{ label: "MAPPED", tone: "online" }}
        >
          <div className="relative p-6">
            <AnimatePresence mode="wait">
              {!skillsLoaded && (
                <motion.div
                  key="loading"
                  className="aspect-[2/1] flex items-center justify-center bg-gradient-to-br from-panel/50 to-panel/20 border border-neon/10 rounded-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center">
                    <motion.div
                      className="mx-auto h-12 w-12 border-2 border-cyan/20 border-t-cyan rounded-full animate-spin"
                    />
                    <p className="mt-4 font-mono text-[9px] tracking-[0.3em] text-cyan/60">MAPPING SKILL TOPOLOGY</p>
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
              {skillsLoaded && (
                <motion.img
                  key="skills"
                  src="/images/skills-map.svg"
                  alt="Skills topology map showing Full-Stack Engineer at center connected to Backend, Frontend, Database, DevOps, Architecture, API Engineering, Automation, and Security"
                  className="w-full h-auto max-h-[300px] object-contain"
                  onLoad={() => setSkillsLoaded(true)}
                  onError={() => setSkillsLoaded(true)}
                  style={{ filter: "contrast(1.05) saturate(1.1)" }}
                  initial={{ scale: 1.02, opacity: 0, filter: "blur(8px)" }}
                  animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              )}
            </AnimatePresence>

            {/* Interactive legend */}
            <motion.div
              className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {[
                { label: "BACKEND", color: "#00f5a0", icon: Server, desc: "PHP • Go • Laravel" },
                { label: "FRONTEND", color: "#00d9ff", icon: Code, desc: "React • Next.js • TS" },
                { label: "DATABASE", color: "#ffb800", icon: Database, desc: "PostgreSQL • Redis" },
                { label: "DEVOPS", color: "#ff3864", icon: Globe, desc: "Docker • CI/CD • Linux" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="group relative p-3 bg-black/30 border border-neon/10 rounded-sm transition-all duration-300 hover:border-neon/30 hover:bg-neon/5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 + i * 0.05 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className="h-4 w-4" style={{ color: item.color }} aria-hidden="true" />
                    <span className="font-mono text-[9px] tracking-[0.3em]" style={{ color: item.color }}>{item.label}</span>
                  </div>
                  <p className="font-mono text-[10px] text-muted">{item.desc}</p>
                  <motion.div
                    className="absolute bottom-0 left-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: item.color, width: "100%" }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </HUDPanel>
      </motion.div>

      {/* Engineering Attributes Grid */}
      <motion.div
        className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-neon/10 bg-neon/5 md:grid-cols-4"
        initial="initial"
        animate={inView ? "inView" : "initial"}
        variants={{
          initial: { opacity: 0 },
          inView: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.5 },
          },
        }}
        aria-label="Engineering attributes"
      >
        {profile.attributes.map((attr, i) => {
          const Icon = attributeIcons[attr.label as keyof typeof attributeIcons] || Cpu;
          return (
            <motion.div
              key={attr.label}
              className="group relative bg-panel/80 p-6 transition-colors duration-300 hover:bg-panel overflow-hidden"
              variants={{
                initial: { opacity: 0, y: 30, scale: 0.95 },
                inView: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
                },
              }}
              whileHover={{
                y: -4,
                scale: 1.02,
                borderColor: "rgba(0,245,160,.4)",
                boxShadow: "0 16px 48px rgba(0,245,160,.1), inset 0 0 40px rgba(0,245,160,.05)",
              }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Animated background glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-neon/10 via-transparent to-cyan/10 opacity-0"
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                aria-hidden="true"
              />
              <motion.div
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                aria-hidden="true"
              />
              <motion.div
                className="mb-4 inline-block p-2 bg-black/30 rounded-sm border border-neon/10 group-hover:border-neon/30 group-hover:bg-neon/10"
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.1, rotate: 15 }}
              >
                <Icon className="h-5 w-5 text-neon" aria-hidden="true" />
              </motion.div>
              <motion.p
                className="font-mono text-[9px] tracking-[0.35em] text-muted transition-colors group-hover:text-cyan"
              >
                {attr.label}
              </motion.p>
              <motion.p
                className="text-glow mt-2 font-mono text-sm font-bold tracking-widest text-neon sm:text-base"
                animate={{ textShadow: ["0 0 12px rgba(0,245,160,.45)", "0 0 24px rgba(0,245,160,.7), 0 0 48px rgba(0,245,160,.3)", "0 0 12px rgba(0,245,160,.45)"] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
              >
                {attr.value}
              </motion.p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Floating code snippets background */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10 hidden opacity-5 sm:block"
        animate={{ opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      >
        {[
          "const deploy = () => Promise.resolve();",
          "async function scale(workers) { return workers.map(w => w.replicate()); }",
          "interface System { health: 'optimal'; latency: '<50ms'; }",
          "type Result<T> = { ok: true; data: T } | { ok: false; error: Error };",
        ].map((snippet, i) => (
          <motion.div
            key={i}
            className="absolute font-mono text-[10px] text-neon/30 whitespace-nowrap"
            style={{
              top: `${15 + i * 22}%`,
              left: `${5 + (i % 2) * 45}%`,
            }}
            animate={{
              x: [-5, 5, -5],
              y: [-3, 3, -3],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 1 }}
          >
            {snippet}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}