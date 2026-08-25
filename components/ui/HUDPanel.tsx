"use client";

import { ReactNode } from "react";

type HUDPanelProps = {
  children: ReactNode;
  title?: string;
  status?: { label: string; tone?: "online" | "warning" | "danger" | "idle" };
  className?: string;
  cornerColor?: string;
};

const toneColor: Record<string, string> = {
  online: "#00F5A0",
  warning: "#FFB800",
  danger: "#FF3864",
  idle: "#71808A",
};

export default function HUDPanel({
  children,
  title,
  status,
  className = "",
  cornerColor = "rgba(0,245,160,.55)",
}: HUDPanelProps) {
  return (
    <div
      className={`hud-corner relative border border-neon/15 bg-panel/70 backdrop-blur-sm ${className}`}
      style={{ ["--corner-color" as never]: cornerColor }}
    >
      {(title || status) && (
        <div className="flex items-center justify-between border-b border-neon/10 px-4 py-2">
          {title && (
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
              {title}
            </span>
          )}
          {status && (
            <span
              className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest"
              style={{ color: toneColor[status.tone ?? "online"] }}
            >
              <span className="inline-block h-1.5 w-1.5 animate-pulseDot rounded-full bg-current" />
              {status.label}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
