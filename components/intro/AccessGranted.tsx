"use client";

import { motion } from "framer-motion";
import GlitchText from "@/components/ui/GlitchText";

export default function AccessGranted() {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1] }}
      transition={{ duration: 0.15 }}
      role="alert"
    >
      <motion.div
        className="absolute inset-0 bg-neon/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0] }}
        transition={{ duration: 0.45, times: [0, 0.12, 1] }}
      />
      <div className="relative border border-neon/40 bg-black/70 px-8 py-6 shadow-neon sm:px-14 sm:py-8">
        <GlitchText
          text="ACCESS GRANTED"
          className="text-glow font-mono text-xl font-bold tracking-[0.35em] text-neon sm:text-3xl"
        />
        <motion.p
          className="mt-3 text-center font-mono text-[10px] tracking-[0.4em] text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          WELCOME, OPERATOR
        </motion.p>
      </div>
    </motion.div>
  );
}
