"use client";

export default function Scanline() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40">
      <div className="crt-overlay absolute inset-0 opacity-60" />
      <div className="noise-overlay absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-24 animate-scanline bg-gradient-to-b from-transparent via-neon/[0.04] to-transparent" />
      <div className="absolute inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,.85)]" />
    </div>
  );
}
