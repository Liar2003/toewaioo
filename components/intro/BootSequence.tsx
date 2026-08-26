"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AccessGranted from "./AccessGranted";
import { useReducedMotion } from "@/components/ui/hooks";

const BOOT_STEPS = [
  { label: "INITIALIZING", detail: "kernel modules :: loaded" },
  { label: "SCANNING", detail: "node mesh :: 12 signals found" },
  { label: "VERIFYING", detail: "identity hash :: matched" },
  { label: "DECRYPTING", detail: "profile cipher :: aes-256-gcm" },
  { label: "COMPLETE", detail: "all systems nominal" },
];

type Phase = "expand" | "boot" | "collapse" | "granted" | "split" | "done";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_SPLIT: [number, number, number, number] = [0.76, 0, 0.24, 1];

const FRAME_HIDDEN = { scaleX: 0.04, scaleY: 0.015, opacity: 0 };
const FRAME_SHOWN = { scaleX: 1, scaleY: 1, opacity: 1 };

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("expand");
  const [stepIndex, setStepIndex] = useState(-1);
  const [stepProgress, setStepProgress] = useState(0);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setPhase("done");
    onComplete();
  }, [onComplete]);

  // phase chain timing
  useEffect(() => {
    const d = (ms: number) => (reduced ? Math.min(ms, 120) : ms);
    let t: ReturnType<typeof setTimeout> | undefined;
    if (phase === "expand") t = setTimeout(() => setPhase("boot"), d(1150));
    else if (phase === "collapse") t = setTimeout(() => setPhase("granted"), d(650));
    else if (phase === "granted") t = setTimeout(() => setPhase("split"), d(1500));
    else if (phase === "split") t = setTimeout(finish, d(1150));
    return () => clearTimeout(t);
  }, [phase, reduced, finish]);

  // sequential step runner
  useEffect(() => {
    if (phase !== "boot") return;
    let cancelled = false;
    const pause = (ms: number) =>
      new Promise<void>((res) => setTimeout(res, cancelled ? 0 : ms));

    (async () => {
      await pause(reduced ? 80 : 320);
      for (let i = 0; i < BOOT_STEPS.length; i++) {
        if (cancelled) return;
        setStepIndex(i);
        const dur =
          reduced || i === BOOT_STEPS.length - 1
            ? reduced ? 90 : 430
            : 480 + Math.random() * 220;
        const start = performance.now();
        for (;;) {
          if (cancelled) return;
          const t = Math.min(1, (performance.now() - start) / dur);
          setStepProgress(t * 100);
          if (t >= 1) break;
          await pause(32);
        }
        setStepProgress(100);
        if (i < BOOT_STEPS.length - 1) await pause(reduced ? 60 : 170);
      }
      if (!cancelled) setPhase("collapse");
    })();

    return () => {
      cancelled = true;
    };
  }, [phase, reduced]);

  // safety: never block longer than 9s
  useEffect(() => {
    const t = setTimeout(finish, 9000);
    return () => clearTimeout(t);
  }, [finish]);

  const overall =
    phase === "boot" && stepIndex >= 0
      ? Math.min(100, ((stepIndex + stepProgress / 100) / BOOT_STEPS.length) * 100)
      : phase === "expand"
        ? 0
        : 100;

  const screen = (
    <BootScreen
      phase={phase}
      stepIndex={stepIndex}
      stepProgress={stepProgress}
      overall={overall}
      reduced={reduced}
    />
  );

  const splitDur = reduced ? 0.2 : 0.95;

  return (
    <motion.div
      className="fixed inset-0 z-[60]"
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
    >
      {phase === "split" ? (
        <>
          <motion.div
            key="panel-top"
            className="absolute inset-x-0 top-0 h-[calc(50%+1px)] overflow-hidden"
            initial={{ y: 0 }}
            animate={{ y: "-102%" }}
            transition={{ duration: splitDur, ease: EASE_SPLIT }}
          >
            <div className="absolute inset-x-0 top-0 h-[100svh]">{screen}</div>
            <div className="absolute inset-x-0 bottom-0 z-10 h-[2px] bg-neon shadow-neon-sm" />
          </motion.div>
          <motion.div
            key="panel-bottom"
            className="absolute inset-x-0 bottom-0 h-[calc(50%+1px)] overflow-hidden"
            initial={{ y: 0 }}
            animate={{ y: "102%" }}
            transition={{ duration: splitDur, ease: EASE_SPLIT }}
          >
            <div className="absolute inset-x-0 bottom-0 h-[100svh]">{screen}</div>
            <div className="absolute inset-x-0 top-0 z-10 h-[2px] bg-neon shadow-neon-sm" />
          </motion.div>
        </>
      ) : (
        screen
      )}

      {phase !== "split" && phase !== "granted" && (
        <button
          onClick={finish}
          className="absolute bottom-6 right-6 z-30 border border-muted/30 px-3 py-1.5 font-mono text-[10px] tracking-[0.25em] text-muted transition-colors hover:border-neon/50 hover:text-neon"
        >
          [ SKIP_INTRO ]
        </button>
      )}
    </motion.div>
  );
}

function BootScreen({
  phase,
  stepIndex,
  stepProgress,
  overall,
  reduced,
}: {
  phase: Phase;
  stepIndex: number;
  stepProgress: number;
  overall: number;
  reduced: boolean;
}) {
  const showFrame =
    phase === "expand" || phase === "boot" || phase === "collapse";
  const showGranted = phase === "granted" || phase === "split";

  return (
    <div className="absolute inset-0 overflow-hidden bg-void">
      {/* atmosphere */}
      <motion.div
        className="crt-overlay absolute inset-0 opacity-70"
        aria-hidden="true"
        animate={showGranted && !reduced ? { x: [0, -4, 3, -2, 0] } : { x: 0 }}
        transition={{ duration: 0.35 }}
      />
      <div className="noise-overlay absolute inset-0" aria-hidden="true" />
      <div
        className="absolute inset-x-0 top-0 h-20 animate-scanline bg-gradient-to-b from-transparent via-neon/[0.05] to-transparent"
        aria-hidden="true"
      />

      {/* center HUD frame */}
      <AnimatePresence>
        {showFrame && (
          <motion.div
            key="frame"
            className="absolute inset-0 z-10 flex items-center justify-center px-5 sm:px-8"
            initial={FRAME_HIDDEN}
            animate={phase === "collapse" ? { scaleX: 0, scaleY: 0.01, opacity: 0 } : FRAME_SHOWN}
            transition={
              phase === "collapse"
                ? {
                    scaleY: { duration: reduced ? 0.001 : 0.34, ease: "easeIn" },
                    scaleX: {
                      delay: reduced ? 0 : 0.26,
                      duration: reduced ? 0.001 : 0.32,
                      ease: "easeIn",
                    },
                    opacity: { delay: reduced ? 0 : 0.46, duration: 0.18 },
                  }
                : {
                    scaleX: { duration: reduced ? 0.001 : 0.55, ease: EASE_OUT },
                    scaleY: {
                      delay: reduced ? 0 : 0.42,
                      duration: reduced ? 0.001 : 0.6,
                      ease: EASE_OUT,
                    },
                    opacity: { duration: 0.25 },
                  }
            }
          >
            <div className="relative w-full max-w-xl">
              {/* corner brackets — appear once expansion completes */}
              <AnimatePresence>
                {phase !== "expand" && (
                  <motion.div
                    key="corners"
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 1.15 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -inset-2.5 pointer-events-none"
                  >
                    <span className="absolute -left-2 -top-2 h-4 w-4 border-l border-t border-neon/70" />
                    <span className="absolute -right-2 -top-2 h-4 w-4 border-r border-t border-neon/70" />
                    <span className="absolute -bottom-2 -left-2 h-4 w-4 border-b border-l border-neon/70" />
                    <span className="absolute -bottom-2 -right-2 h-4 w-4 border-b border-r border-neon/70" />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="hud-corner relative overflow-hidden border border-neon/25 bg-abyss/85 shadow-neon backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduced ? 0 : 0.9, duration: 0.35 }}
              >
                {/* header */}
                <div className="flex items-center justify-between border-b border-neon/15 px-4 py-2 font-mono text-[10px] tracking-[0.3em] text-muted sm:px-6">
                  <span>TOEWAIOO_OS v1.0.0</span>
                  <span className="flex items-center gap-2 text-neon/80">
                    <span className="inline-block h-1.5 w-1.5 animate-pulseDot bg-neon" />
                    SECURE_BOOT
                  </span>
                </div>

                {/* sequential steps */}
                <div className="min-h-[188px] px-4 py-5 sm:min-h-[204px] sm:px-6">
                  <div className="space-y-3 font-mono">
                    {BOOT_STEPS.map((step, i) => {
                      if (i > stepIndex) return null;
                      const isLast = i === BOOT_STEPS.length - 1;
                      const done = i < stepIndex || (isLast && stepProgress >= 100);
                      const active = i === stepIndex && !done;
                      return (
                        <motion.div
                          key={step.label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.22 }}
                        >
                          <div className="flex items-baseline gap-3 text-xs sm:text-sm">
                            <span className="text-muted">
                              [{String(i + 1).padStart(2, "0")}]
                            </span>
                            <span
                              className={`tracking-[0.2em] ${
                                done ? "text-frost" : "text-neon"
                              }`}
                            >
                              {step.label}
                            </span>
                            {active && (
                              <span className="inline-block h-[0.9em] w-[7px] translate-y-[0.1em] animate-blink bg-neon" />
                            )}
                            <span
                              className={`ml-auto text-[10px] tracking-[0.25em] ${
                                done ? "text-neon/80" : "text-neon"
                              }`}
                            >
                              {done ? "[ OK ]" : `${Math.floor(stepProgress)}%`}
                            </span>
                          </div>
                          <p
                            className={`mt-0.5 pl-9 text-[10px] leading-4 ${
                              done ? "text-muted/50" : "text-muted"
                            }`}
                          >
                            &gt; {step.detail}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* footer progress */}
                <div className="border-t border-neon/15 px-4 py-3 sm:px-6">
                  <div className="flex items-end justify-between font-mono text-[9px] tracking-[0.3em] text-muted">
                    <span>SYSTEM LOAD</span>
                    <span className="text-neon">{Math.floor(overall)}%</span>
                  </div>
                  <div className="mt-1.5 h-[3px] w-full overflow-hidden bg-white/5">
                    <div
                      className="h-full bg-neon shadow-neon-sm"
                      style={{
                        width: `${overall}%`,
                        transition: reduced ? "none" : "width 90ms linear",
                      }}
                    />
                  </div>
                </div>

                <div className="crt-overlay pointer-events-none absolute inset-0 opacity-40" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showGranted && <AccessGranted />}
    </div>
  );
}
