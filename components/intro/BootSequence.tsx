"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TerminalLogs from "./TerminalLogs";
import AccessGranted from "./AccessGranted";
import { useReducedMotion } from "@/components/ui/hooks";

const BOOT_LINES = [
  "BOOTING PORTFOLIO OS...",
  "INITIALIZING NEURAL INTERFACE...",
  "LOADING SECURITY MODULES...",
  "ESTABLISHING ENCRYPTED CHANNEL...",
  "SCANNING NETWORK...",
  "VERIFYING IDENTITY...",
  "DECRYPTING PROFILE...",
  "SYSTEM READY",
];

const RANDOM_STATUSES = [
  "mem_check :: OK",
  "0x7F3A handshake",
  "tls_1.3 :: sealed",
  "node_mesh sync",
  "firewall :: active",
  "entropy pool full",
  "kernel modules ok",
  "trace_route masked",
];

type Phase = "boot" | "granted" | "done";

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("boot");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(RANDOM_STATUSES[0]);
  const completedRef = useRef(false);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }, [onComplete]);

  // Progress ticker
  useEffect(() => {
    if (reduced || phase !== "boot") return;
    const interval = setInterval(() => {
      setProgress((p) => Math.min(100, p + Math.random() * 7 + 2));
    }, 90);
    return () => clearInterval(interval);
  }, [reduced, phase]);

  // Random status flicker
  useEffect(() => {
    if (reduced || phase !== "boot") return;
    const interval = setInterval(() => {
      setStatus(RANDOM_STATUSES[Math.floor(Math.random() * RANDOM_STATUSES.length)]);
    }, 260);
    return () => clearInterval(interval);
  }, [reduced, phase]);

  const handleLogsDone = useCallback(() => {
    setProgress(100);
    setPhase("granted");
    setTimeout(finish, reduced ? 500 : 1400);
  }, [finish, reduced]);

  // Reduced-motion path: brief static pass
  useEffect(() => {
    if (!reduced || phase !== "boot") return;
    setProgress(100);
    const t = setTimeout(() => {
      setPhase("granted");
      setTimeout(finish, 450);
    }, 350);
    return () => clearTimeout(t);
  }, [reduced, phase, finish]);

  // Safety: never block longer than 6s
  useEffect(() => {
    const t = setTimeout(finish, 6000);
    return () => clearTimeout(t);
  }, [finish]);

  return (
    <>
      <AnimatePresence>
        {phase !== "done" && (
          <motion.div
            key="boot-screen"
            className="fixed inset-0 z-[60] flex flex-col bg-void"
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            aria-hidden="true"
          >
            <div className="crt-overlay absolute inset-0 opacity-70" />
            <div className="noise-overlay absolute inset-0" />
            <div className="absolute inset-x-0 top-0 h-20 animate-scanline bg-gradient-to-b from-transparent via-neon/[0.05] to-transparent" />

            <div className="relative z-10 flex flex-1 flex-col justify-center px-6 sm:px-12 lg:px-24">
              <div className="mx-auto w-full max-w-2xl">
                <div className="mb-8 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-muted">
                  <span>MG.MG_OS v3.7.1</span>
                  <span className="hidden sm:inline">{status}</span>
                </div>

                {reduced ? (
                  <div className="font-mono text-xs text-neon/80 sm:text-sm">
                    {BOOT_LINES.map((line) => (
                      <p key={line}>
                        <span className="mr-2 text-muted">&gt;</span>
                        {line}
                      </p>
                    ))}
                  </div>
                ) : (
                  <TerminalLinesWrapper onDone={handleLogsDone} />
                )}

                <div className="mt-10">
                  <div className="flex items-end justify-between font-mono text-[10px] tracking-[0.25em] text-muted">
                    <span>LOADING</span>
                    <span className="text-neon">
                      {Math.min(100, Math.floor(progress))}%
                    </span>
                  </div>
                  <div className="mt-2 h-[3px] w-full overflow-hidden bg-white/5">
                    <div
                      className="h-full bg-neon shadow-neon-sm transition-[width] duration-150 ease-out"
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-1 opacity-40">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[2px] font-mono"
                      style={{
                        background:
                          (i * 7 + Math.floor(progress / 4)) % 9 === 0
                            ? "#00F5A0"
                            : "#12242C",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={finish}
              className="absolute bottom-6 right-6 z-20 border border-muted/30 px-3 py-1.5 font-mono text-[10px] tracking-[0.25em] text-muted transition-colors hover:border-neon/50 hover:text-neon"
            >
              [ SKIP_INTRO ]
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "granted" && !completedRef.current && <AccessGranted />}
    </>
  );
}

function TerminalLinesWrapper({ onDone }: { onDone: () => void }) {
  return <TerminalLogs lines={BOOT_LINES} onDone={onDone} />;
}
