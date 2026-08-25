"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StatusIndicator from "@/components/ui/StatusIndicator";
import GlitchText from "@/components/ui/GlitchText";
import { profile } from "@/data/profile";

const LINKS = [
  { label: "ABOUT", href: "#about" },
  { label: "STACK", href: "#stack" },
  { label: "PROJECTS", href: "#projects" },
  { label: "ARCHITECTURE", href: "#architecture" },
  { label: "EXPERIENCE", href: "#experience" },
  { label: "CONTACT", href: "#contact" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "border-b border-neon/10 bg-void/85 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-12 lg:px-16"
          aria-label="Primary"
        >
          <a
            href="#hero"
            className="font-mono text-sm font-bold tracking-[0.3em] text-frost transition-colors hover:text-neon"
          >
            <GlitchText text={`[${profile.name.toUpperCase()}]`} className="text-sm" />
          </a>

          {/* desktop links */}
          <ul className="hidden items-center gap-7 md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="group relative font-mono text-[11px] tracking-[0.25em] text-muted transition-colors hover:text-neon"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-neon shadow-neon-sm transition-all duration-300 group-hover:w-full" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <StatusIndicator label="[ ONLINE ]" />
          </div>

          {/* mobile menu trigger */}
          <button
            onClick={() => setOpen(true)}
            className="btn-hud !px-3 !py-1.5 !text-[10px] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-command-menu"
          >
            &gt; MENU
          </button>
        </nav>
      </header>

      {/* mobile command menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-command-menu"
            className="fixed inset-0 z-[70] flex flex-col bg-void/97 backdrop-blur-lg md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
          >
            <div className="crt-overlay pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
            <div className="flex items-center justify-between px-6 py-4">
              <span className="font-mono text-xs tracking-[0.35em] text-neon">CMD://NAVIGATE</span>
              <button
                onClick={() => setOpen(false)}
                className="border border-danger/40 px-3 py-1.5 font-mono text-[10px] tracking-[0.25em] text-danger transition-colors hover:bg-danger/10"
              >
                [ CLOSE ]
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center px-8" aria-label="Mobile">
              <ul className="space-y-5">
                {LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i, duration: 0.3 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 font-mono text-2xl font-bold tracking-widest text-frost transition-colors hover:text-neon"
                    >
                      <span className="text-xs text-cyan">[{String(i + 1).padStart(2, "0")}]</span>
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="px-8 pb-10">
              <StatusIndicator label="SYSTEM STATUS: ONLINE" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
