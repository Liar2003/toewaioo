"use client";

import StatusIndicator from "@/components/ui/StatusIndicator";
import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="relative border-t border-neon/10 bg-abyss/60" aria-label="Footer">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-12 text-center sm:px-12 lg:px-16">
        <p className="text-glow font-mono text-lg font-bold tracking-[0.35em] text-frost">
          {profile.name.toUpperCase()}
        </p>
        <p className="font-mono text-[10px] tracking-[0.3em] text-muted">
          {profile.title.toUpperCase()}
        </p>
        <StatusIndicator label="SYSTEM STATUS: ONLINE" />

        <p className="mt-2 font-mono text-[11px] tracking-[0.45em] text-neon/80">
          BUILD • SHIP • SCALE
        </p>
        <p className="font-mono text-[9px] tracking-[0.25em] text-muted/70">
          © 2026 {profile.name.toUpperCase()} — ALL SYSTEMS NOMINAL
        </p>
      </div>
    </footer>
  );
}
