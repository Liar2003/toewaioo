"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { usePrefersFinePointer } from "@/components/ui/hooks";
import { projects, type Project } from "@/data/projects";
import { ChevronDown, ExternalLink, Github, Image as ImageIcon, Maximize, Minimize, Loader2, CheckCircle, XCircle } from "lucide-react";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, scale: 1 });
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalProgress, setModalProgress] = useState(0);
  const finePointer = usePrefersFinePointer();
  
  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ).current;

  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Spring-based smooth values for 60fps interactions
  const springTiltX = useSpring(tilt.rx, { stiffness: 300, damping: 20 });
  const springTiltY = useSpring(tilt.ry, { stiffness: 300, damping: 20 });
  const springScale = useSpring(tilt.scale, { stiffness: 400, damping: 25 });

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (reduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -py * 10, ry: px * 12, scale: 1.025 });
  }, [reduced]);

  const resetTilt = useCallback(() => {
    setTilt({ rx: 0, ry: 0, scale: 1 });
    setHovered(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const openModal = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
    document.body.style.overflow = "hidden";
    // Animate modal progress
    let start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / 300, 1);
      setModalProgress(progress);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    document.body.style.overflow = "";
    setModalProgress(0);
  }, []);

  const cardVariants = {
    initial: { opacity: 0, y: 40, scale: 0.98 },
    inView: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    hover: {
      y: -10,
      boxShadow: "0 40px 80px -16px rgba(0, 245, 160, 0.18), 0 0 0 1px rgba(0, 245, 160, 0.35)",
      transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const imageVariants = {
    initial: { scale: 1.12, opacity: 0, filter: "blur(8px)" },
    loaded: { scale: 1, opacity: 1, filter: "blur(0px)", transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] } },
    hover: { scale: 1.06, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  const skeletonVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { delay: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <>
      <motion.article
        ref={cardRef}
        className="hud-corner group relative z-10 border bg-panel/70 backdrop-blur-sm overflow-hidden"
        style={{
          transformStyle: "preserve-3d",
          transform: reduced
            ? undefined
            : `perspective(1000px) rotateX(${springTiltX.get()}deg) rotateY(${springTiltY.get()}deg) scale(${springScale.get()})`,
          zIndex: hovered ? 30 : 10,
          transition:
            tilt.rx === 0 && tilt.ry === 0 && tilt.scale === 1
              ? "transform .6s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
              : "transform .08s linear",
        }}
        onMouseMove={(e) => {
          if (!finePointer) return;
          handleMove(e);
        }}
        onMouseEnter={() => finePointer && setHovered(true)}
        onMouseLeave={resetTilt}
        onTouchStart={() => setHovered(true)}
        onTouchEnd={resetTilt}
        variants={cardVariants}
        initial="initial"
        animate={hovered ? "hover" : "inView"}
        viewport={{ once: true, margin: "-80px" }}
        aria-label={`${project.name} — ${project.category}`}
      >
        {/* Animated border glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 border"
          animate={{
            borderColor: hovered ? "rgba(0,245,160,.7)" : "rgba(255,255,255,.06)",
            boxShadow: hovered
              ? "0 0 40px rgba(0,245,160,.3), inset 0 0 60px rgba(0,245,160,.1)"
              : "none",
          }}
          transition={{ duration: 0.35 }}
          aria-hidden="true"
        />

        {/* Scanline overlay on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              to bottom,
              transparent 0px,
              transparent 2px,
              rgba(0, 245, 160, ${hovered ? "0.04" : "0"}) 3px,
              rgba(0, 245, 160, ${hovered ? "0.04" : "0"}) 4px
            )`,
          }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          aria-hidden="true"
        />

        {/* Subtle particle burst on hover */}
        <AnimatePresence>
          {hovered && !reduced && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-hidden="true"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-1 w-1 rounded-full bg-neon/60"
                  style={{
                    left: `${50 + (Math.random() - 0.5) * 40}%`,
                    top: `${50 + (Math.random() - 0.5) * 40}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1, 0], opacity: [0, 0.6, 0], x: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 80], y: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 80] }}
                  transition={{ duration: 1.2, delay: i * 0.05, ease: "easeOut" }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project Image / Thumbnail */}
        <motion.div
          ref={imageRef}
          className="relative aspect-video overflow-hidden cursor-zoom-in"
          style={{ background: "linear-gradient(135deg, #0a1117 0%, #030508 100%)" }}
          variants={imageVariants}
          initial="initial"
          animate={imageLoaded ? "loaded" : "initial"}
          whileHover={hovered && !imageError ? "hover" : undefined}
          onClick={openModal}
        >
          {/* Skeleton shimmer while loading */}
          <AnimatePresence mode="wait">
            {!imageLoaded && !imageError && (
              <motion.div
                key="skeleton"
                className="absolute inset-0"
                variants={skeletonVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-panel via-panel/50 to-panel" style={{ backgroundSize: "200% 100%" }}>
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(0,245,160,.08), transparent)", backgroundSize: "200% 100%" }}
                    animate={{ backgroundPositionX: ["-200%", "200%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="mx-auto h-10 w-10 text-neon/40 animate-spin" aria-hidden="true" />
                  <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.3em] text-neon/50">DECODING SCHEMATIC...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {project.image && !imageError && (
            <motion.img
              src={project.image}
              alt={project.imageAlt || `${project.name} architecture diagram`}
              className="absolute inset-0 w-full h-full object-cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ filter: "contrast(1.1) saturate(1.2)" }}
            />
          )}

          {/* Error fallback */}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center p-6 bg-panel/90">
              <div className="text-center">
                <XCircle className="mx-auto h-10 w-10 text-danger/50" aria-hidden="true" />
                <p className="mt-2 font-mono text-[10px] tracking-[0.3em] text-danger/70">IMAGE UNAVAILABLE</p>
              </div>
            </div>
          )}

          {/* Hover overlay with quick actions */}
          <motion.div
            className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full flex items-center justify-between">
              <button
                onClick={openModal}
                className="btn-hud !px-3 !py-1.5 !text-[9px] group"
                aria-label={`View ${project.name} schematic fullscreen`}
              >
                <Maximize className="mr-1.5 h-3 w-3 transition-transform group-hover:scale-110" aria-hidden="true" />
                VIEW SCHEMATIC
              </button>
              <span className="font-mono text-[9px] tracking-[0.25em] text-neon/70">
                {project.technologies.length} TECHS
              </span>
            </div>
          </motion.div>

          {/* Status badge corner */}
          <motion.div
            className="absolute top-3 left-3"
            animate={{ opacity: hovered ? 1 : 0.7, scale: hovered ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur border border-neon/30 rounded-sm font-mono text-[8px] tracking-widest text-neon">
              <motion.span
                className="inline-block h-1.5 w-1.5 rounded-full bg-neon"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              />
              {project.status.toUpperCase()}
            </span>
          </motion.div>
        </motion.div>

        <div className="relative p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <motion.p
                className="font-mono text-[10px] tracking-[0.35em] transition-all duration-300"
                animate={{ color: hovered ? "#00d9ff" : "#71808a" }}
              >
                {project.codeName}
              </motion.p>
              <motion.p
                className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-muted"
                animate={{ opacity: hovered ? 0.7 : 1 }}
              >
                {project.category}
              </motion.p>
            </div>
            {project.featured && (
              <motion.span
                className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-neon"
                animate={{ scale: hovered ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-neon"
                  animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden="true"
                />
                {project.status.toUpperCase()}
              </motion.span>
            )}
          </div>

          <motion.h3
            className="glitch mt-4 text-xl font-bold tracking-tight text-frost sm:text-2xl"
            data-text={project.name}
            animate={{ letterSpacing: hovered ? "0.04em" : "0" }}
            transition={{ duration: 0.3 }}
          >
            {project.name}
          </motion.h3>

          <motion.p
            className="mt-3 min-h-[60px] text-sm leading-relaxed text-frost/70"
            animate={{ opacity: hovered ? 0.85 : 1 }}
          >
            {project.description}
          </motion.p>

          {/* Role & Year */}
          {(project.role || project.year) && (
            <motion.div
              className="mt-4 flex flex-wrap items-center gap-3 text-xs"
              animate={{ opacity: hovered ? 0.9 : 1 }}
            >
              {project.role && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan/10 border border-cyan/20 rounded-sm font-mono text-[9px] text-cyan">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan" aria-hidden="true" />
                  {project.role.toUpperCase()}
                </span>
              )}
              {project.year && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-warn/10 border border-warn/20 rounded-sm font-mono text-[9px] text-warn">
                  <span className="h-1.5 w-1.5 rounded-full bg-warn" aria-hidden="true" />
                  {project.year}
                </span>
              )}
            </motion.div>
          )}

          <motion.div
            className="mt-5"
            animate={{ x: hovered ? 4 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-2 font-mono text-[9px] tracking-[0.3em] text-muted">STACK:</p>
            <motion.p
              className="font-mono text-[11px] leading-relaxed tracking-wide text-neon/85"
              animate={{ color: hovered ? "#00f5a0" : "#00f5a0dd" }}
            >
              {project.technologies.join(" • ")}
            </motion.p>
          </motion.div>

          {/* Metrics Preview */}
          {project.metrics && project.metrics.length > 0 && (
            <motion.div
              className="mt-5 grid grid-cols-2 gap-3"
              animate={{ opacity: hovered ? 1 : 0.7, y: hovered ? 0 : 4 }}
              transition={{ duration: 0.3 }}
            >
              {project.metrics.slice(0, 4).map((metric, i) => (
                <motion.div
                  key={metric.label}
                  className="p-2.5 bg-black/40 border border-neon/10 rounded-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <p className="font-mono text-[8px] tracking-[0.2em] text-muted">{metric.label.toUpperCase()}</p>
                  <p className="font-mono text-sm font-bold tracking-wide text-neon">{metric.value}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            className="mt-6 flex flex-wrap items-center gap-3"
            animate={{ opacity: open ? 0.7 : 1 }}
          >
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls={`${project.id}-details`}
              className="btn-hud !px-4 !py-2 !text-[10px] group"
            >
              <span className="flex items-center gap-2">
                {open ? "[ CLOSE CASE STUDY ]" : "[ VIEW CASE STUDY ]"}
                <motion.div
                  className="flex"
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <ChevronDown className="h-3 w-3" aria-hidden="true" />
                </motion.div>
              </span>
            </button>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hud-ghost !px-4 !py-2 !text-[10px] group flex items-center gap-2"
              >
                <Github className="h-3 w-3 transition-transform group-hover:scale-110" aria-hidden="true" />
                [ SOURCE CODE ]
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hud-ghost !px-4 !py-2 !text-[10px] group flex items-center gap-2"
                style={{ borderColor: "rgba(0,217,255,0.35)", color: "#00d9ff" }}
              >
                <ExternalLink className="h-3 w-3 transition-transform group-hover:scale-110" aria-hidden="true" />
                [ LIVE DEMO ]
              </a>
            )}
          </motion.div>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={`${project.id}-details`}
                initial={{ height: 0, opacity: 0, y: -20 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="overflow-hidden"
              >
                <motion.div
                  className="mt-6 grid gap-6 border-t border-neon/15 pt-5 md:grid-cols-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, staggerChildren: 0.08 }}
                >
                  {project.image && (
                    <motion.div
                      className="md:col-span-2 relative aspect-video rounded-sm overflow-hidden border border-neon/10"
                      style={{ background: "linear-gradient(135deg, #0a1117 0%, #030508 100%)" }}
                    >
                      <img
                        src={project.image}
                        alt={project.imageAlt || `${project.name} architecture diagram`}
                        className="w-full h-full object-cover"
                        style={{ filter: "contrast(1.1) saturate(1.2)" }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent font-mono text-[9px] tracking-[0.2em] text-neon/80">
                        ARCHITECTURE SCHEMATIC — CLICK TO EXPAND
                      </div>
                    </motion.div>
                  )}

                  {project.architecture && (
                    <motion.div>
                      <p className="mb-3 font-mono text-[9px] tracking-[0.3em] text-cyan">SYSTEM_FLOW:</p>
                      <ol className="space-y-1.5 font-mono text-[11px] tracking-wide">
                        {project.architecture.map((step, i) => (
                          <motion.li
                            key={step}
                            className="flex items-center gap-2 text-frost/80 group"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ x: 6 }}
                          >
                            <span className="text-neon">{String(i + 1).padStart(2, "0")}</span>
                            {step.toUpperCase()}
                            {i < project.architecture!.length - 1 && (
                              <motion.span
                                className="text-muted"
                                animate={{ y: [0, -2, 0], opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                                aria-hidden="true"
                              >
                                ↓
                              </motion.span>
                            )}
                          </motion.li>
                        ))}
                      </ol>
                    </motion.div>
                  )}

                  {(project.highlights ?? project.features) && (
                    <motion.div>
                      <p className="mb-3 font-mono text-[9px] tracking-[0.3em] text-cyan">
                        {project.highlights ? "ENGINEERING_TOPICS:" : "CAPABILITIES:"}
                      </p>
                      <ul className="grid grid-cols-1 gap-1.5 font-mono text-[11px] tracking-wide text-frost/75 sm:grid-cols-2 md:grid-cols-1">
                        {(project.highlights ?? project.features)!.map((item) => (
                          <motion.li
                            key={item}
                            className="flex items-center gap-2 group"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ x: 4 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          >
                            <motion.span
                              className="text-neon"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                              aria-hidden="true"
                            >
                              ▸
                            </motion.span>
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Full Metrics */}
                  {project.metrics && project.metrics.length > 0 && (
                    <motion.div className="md:col-span-2">
                      <p className="mb-3 font-mono text-[9px] tracking-[0.3em] text-cyan">PERFORMANCE_METRICS:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {project.metrics.map((metric, i) => (
                          <motion.div
                            key={metric.label}
                            className="p-3 bg-black/40 border border-neon/10 rounded-sm group"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                            whileHover={{ scale: 1.03, borderColor: "rgba(0,245,160,.4)", boxShadow: "0 8px 24px rgba(0,245,160,.1)" }}
                          >
                            <p className="font-mono text-[8px] tracking-[0.2em] text-muted">{metric.label.toUpperCase()}</p>
                            <p className="font-mono text-base font-bold tracking-wide text-neon mt-1">{metric.value}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.article>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {showModal && project.image && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.name} schematic fullscreen`}
          >
            <motion.div
              className="relative flex h-full w-full flex-col items-center justify-center gap-4 p-4 sm:p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button — top-right of viewport on mobile, above image on desktop */}
              <button
                onClick={closeModal}
                className="absolute right-3 top-3 z-20 flex items-center gap-1.5 border border-neon/30 bg-panel/90 p-2 font-mono text-[9px] tracking-[0.2em] text-neon backdrop-blur transition-colors hover:bg-neon/10 sm:right-4 sm:top-4 sm:gap-2 sm:p-2.5 sm:text-[10px]"
                aria-label="Close fullscreen view"
              >
                <Minimize className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                <span className="hidden sm:inline">[ CLOSE ]</span>
              </button>

              <div className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-sm border border-neon/20" style={{ background: "linear-gradient(135deg, #0a1117 0%, #030508 100%)" }}>
                <img
                  src={project.image}
                  alt={project.imageAlt || `${project.name} architecture diagram`}
                  className="w-full h-full object-contain p-3 sm:p-4"
                  style={{ filter: "contrast(1.1) saturate(1.2)" }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 font-mono text-[8px] tracking-[0.2em] text-neon/80 sm:p-4 sm:text-[9px]">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span className="truncate">{project.name.toUpperCase()} — ARCHITECTURE SCHEMATIC</span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="h-3 w-3 text-neon" aria-hidden="true" />
                      SVG VECTOR FORMAT
                    </span>
                  </div>
                </div>
              </div>

              {/* Project info card — below image, always in view */}
              <motion.div
                className="w-full max-w-5xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="border border-neon/20 bg-panel/95 p-3 backdrop-blur sm:p-4">
                  <p className="mb-1 font-mono text-base font-bold tracking-tight text-frost sm:mb-2 sm:text-xl">{project.name}</p>
                  <p className="mb-2 text-xs text-frost/70 sm:mb-3 sm:text-sm">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {project.technologies.slice(0, 8).map((tech) => (
                      <span key={tech} className="rounded-sm border border-neon/10 bg-black/40 px-2 py-1 font-mono text-[9px] text-neon/80 sm:text-[10px]">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 8 && (
                      <span className="rounded-sm border border-neon/10 bg-black/40 px-2 py-1 font-mono text-[9px] text-muted sm:text-[10px]">
                        +{project.technologies.length - 8} MORE
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Scroll progress for background parallax
  const scrollY = useMotionValue(0);
  const scrollYProgress = useTransform(scrollY, (latest) => (typeof window !== "undefined" ? Math.min(latest / (window.innerHeight * 3), 1) : 0));

  useEffect(() => {
    const handleScroll = () => scrollY.set(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative mx-auto max-w-7xl px-5 py-16 sm:px-12 sm:py-24 lg:px-16"
      aria-label="Projects"
    >
      {/* Background decorative elements with scroll parallax */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 0.5, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          transform: useTransform(scrollYProgress, [0, 1], ["translateY(0px)", "translateY(-100px)"]),
        }}
        aria-hidden="true"
      >
        <div className="absolute top-20 left-10 h-64 w-64 bg-neon/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 h-80 w-80 bg-cyan/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 bg-warn/5 rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <SectionHeading index="03" kicker="ls /deployments" title="DEPLOYED MISSIONS" />
      </motion.div>

      <motion.div
        className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.2, staggerChildren: 0.08 }}
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </motion.div>
    </section>
  );
}