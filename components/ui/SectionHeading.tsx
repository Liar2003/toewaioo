"use client";

import { motion } from "framer-motion";
import GlitchText from "./GlitchText";

type SectionHeadingProps = {
  index: string;
  kicker: string;
  title: string;
};

export default function SectionHeading({ index, kicker, title }: SectionHeadingProps) {
  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
    >
      <p className="font-mono text-[10px] tracking-[0.35em] text-neon">
        [ {index} // {kicker} ]
      </p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-frost sm:text-4xl lg:text-5xl">
        <GlitchText text={title} />
      </h2>
      <div className="mt-4 h-px w-24 bg-gradient-to-r from-neon/70 to-transparent" />
    </motion.div>
  );
}
