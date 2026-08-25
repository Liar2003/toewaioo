"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

type TerminalTextProps = {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
  cursor?: boolean;
  immediate?: boolean;
};

export default function TerminalText({
  text,
  className = "",
  speed = 28,
  startDelay = 0,
  cursor = true,
  immediate = false,
}: TerminalTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [output, setOutput] = useState("");
  const [started, setStarted] = useState(immediate);

  useEffect(() => {
    if (inView) setStarted(true);
  }, [inView]);

  useEffect(() => {
    if (!started) return;
    if (typeof window !== "undefined") {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        setOutput(text);
        return;
      }
    }
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setOutput(text.slice(0, i));
        if (i >= text.length && interval) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [started, text, speed, startDelay]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{output}</span>
      {cursor && started && (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] animate-blink bg-current"
        />
      )}
    </span>
  );
}
