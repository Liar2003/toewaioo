"use client";

type StatusIndicatorProps = {
  label: string;
  tone?: "online" | "warning" | "danger" | "idle";
  className?: string;
};

const toneColor: Record<string, string> = {
  online: "#00F5A0",
  warning: "#FFB800",
  danger: "#FF3864",
  idle: "#71808A",
};

export default function StatusIndicator({
  label,
  tone = "online",
  className = "",
}: StatusIndicatorProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] ${className}`}
      style={{ color: toneColor[tone] }}
      role="status"
    >
      <span className="inline-block h-1.5 w-1.5 animate-pulseDot rounded-full bg-current" />
      {label}
    </span>
  );
}
