"use client";

import { motion } from "framer-motion";
import GlitchText from "@/components/ui/GlitchText";

export default function AccessGranted() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
      role="alert"
    >
      {/* full-screen flash */}
      <motion.div
        className="absolute inset-0 bg-neon"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.85, 0] }}
        transition={{ duration: 0.5, times: [0, 0.08, 1] }}
        aria-hidden="true"
      />

      <motion.div
        className="relative px-6 text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{
          scale: [0.5, 1.06, 1],
          opacity: [0, 1, 1],
          x: [0, -8, 6, -3, 0],
        }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <GlitchText
          text="ACCESS GRANTED"
          className="glitching text-glow font-mono text-2xl font-bold tracking-[0.28em] text-neon sm:text-5xl lg:text-6xl"
        />
        <motion.p
          className="mt-4 font-mono text-[10px] tracking-[0.5em] text-muted sm:text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          WELCOME, OPERATOR
        </motion.p>
      </motion.div>

      {/* horizontal glitch bars */}
      {[16, 42, 68, 86].map((top, i) => (
        <motion.div
          key={top}
          className="absolute inset-x-0 h-[2px] bg-neon/40"
          style={{ top: `${top}%` }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 0.35] }}
          transition={{ duration: 0.45, delay: 0.08 + i * 0.11, ease: "easeOut" }}
          aria-hidden="true"
        />
      ))}
    </motion.div>
  );
}
