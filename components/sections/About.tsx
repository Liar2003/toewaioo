"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import HUDPanel from "@/components/ui/HUDPanel";
import TerminalText from "@/components/ui/TerminalText";
import StatusIndicator from "@/components/ui/StatusIndicator";
import { profile } from "@/data/profile";
import { MapPin, Crosshair } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl px-6 py-24 sm:px-12 lg:px-16" aria-label="About">
      <SectionHeading index="01" kicker="cat operator.dossier" title="THE OPERATOR" />

      <div className="grid gap-8 lg:grid-cols-5">
        {/* dossier */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.05 }}
        >
          <HUDPanel title="operator.dossier" status={{ label: "DECRYPTED" }}>
            <div className="space-y-5 p-6">
              {profile.about.map((paragraph, i) => (
                <p key={i} className="text-sm leading-relaxed text-frost/85 sm:text-base">
                  <span className="mr-2 font-mono text-neon">&gt;</span>
                  {paragraph}
                </p>
              ))}
              <div className="border-t border-neon/10 pt-5">
                <p className="mb-3 font-mono text-[10px] tracking-[0.3em] text-muted">
                  PRIMARY_FOCUS:
                </p>
                <ul className="flex flex-wrap gap-2" aria-label="Focus areas">
                  {profile.focus.map((item) => (
                    <li
                      key={item}
                      className="border border-neon/20 bg-neon/5 px-2.5 py-1 font-mono text-[11px] tracking-wider text-neon/90"
                    >
                      {item.toUpperCase()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </HUDPanel>
        </motion.div>

        {/* identity card */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.15 }}
        >
          <HUDPanel
            title="identity.card"
            cornerColor="rgba(0,217,255,.55)"
            status={{ label: "VERIFIED", tone: "online" }}
            className="h-full"
          >
            <div className="flex flex-col gap-6 p-6">
              <div>
                <Crosshair className="mb-4 h-8 w-8 text-cyan" strokeWidth={1.25} aria-hidden="true" />
                <p className="font-mono text-xl font-bold tracking-widest text-frost">
                  {profile.name.toUpperCase()}
                </p>
                <TerminalText
                  text={`>> ${profile.title.toUpperCase()}`}
                  className="mt-1 block font-mono text-xs tracking-widest text-cyan"
                />
              </div>

              <dl className="space-y-3 border-t border-neon/10 pt-4 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <dt className="tracking-[0.25em] text-muted">LOCATION</dt>
                  <dd className="flex items-center gap-1.5 text-frost">
                    <MapPin className="h-3 w-3 text-neon" aria-hidden="true" />
                    {profile.location.toUpperCase()}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="tracking-[0.25em] text-muted">STATUS</dt>
                  <dd>
                    <StatusIndicator label={profile.availability.toUpperCase()} />
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="tracking-[0.25em] text-muted">CLEARANCE</dt>
                  <dd className="text-neon">FULL-STACK</dd>
                </div>
              </dl>
            </div>
          </HUDPanel>
        </motion.div>
      </div>

      {/* attribute grid — non-numeric capability attributes */}
      <motion.div
        className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-neon/10 bg-neon/5 md:grid-cols-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, delay: 0.1 }}
        aria-label="Engineering attributes"
      >
        {profile.attributes.map((attr) => (
          <div key={attr.label} className="group bg-panel/80 p-6 transition-colors duration-300 hover:bg-panel">
            <p className="font-mono text-[9px] tracking-[0.35em] text-muted transition-colors group-hover:text-cyan">
              {attr.label}
            </p>
            <p className="text-glow mt-2 font-mono text-sm font-bold tracking-widest text-neon sm:text-base">
              {attr.value}
            </p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
