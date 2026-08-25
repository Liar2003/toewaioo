"use client";

import { useEffect, useState } from "react";
import StatusIndicator from "@/components/ui/StatusIndicator";
import { profile } from "@/data/profile";

type Readout = { label: string; value: string };

export default function HeroHUD({
  readouts,
  online,
}: {
  readouts: Readout[];
  online: boolean;
}) {
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(
        [d.getHours(), d.getMinutes(), d.getSeconds()]
          .map((v) => String(v).padStart(2, "0"))
          .join(":")
      );
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {/* top-right system readout */}
      <div className="pointer-events-none absolute right-4 top-20 hidden text-right font-mono text-[9px] leading-5 tracking-[0.2em] text-muted md:block lg:right-8">
        <p>SYS_TIME :: {clock}</p>
        {readouts.map((r) => (
          <p key={r.label}>
            {r.label} :: <span className="text-cyan">{r.value}</span>
          </p>
        ))}
        <p>OPERATOR :: {profile.name.toUpperCase()}</p>
      </div>

      {/* left edge vertical marker */}
      <div className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex">
        <span className="h-16 w-px bg-gradient-to-b from-transparent to-neon/50" />
        <span className="font-mono text-[9px] tracking-[0.35em] text-muted [writing-mode:vertical-rl]">
          SURVEILLANCE_GRID // ACTIVE_SECTOR
        </span>
        <span className="h-16 w-px bg-gradient-to-t from-transparent to-neon/50" />
      </div>

      {/* bottom-left availability */}
      <div className="pointer-events-none absolute bottom-24 left-4 hidden md:block lg:left-8">
        <StatusIndicator label={online ? profile.availability.toUpperCase() : "OFFLINE"} tone={online ? "online" : "danger"} />
      </div>
    </>
  );
}
