"use client";

type GlitchTextProps = {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  active?: boolean;
};

export default function GlitchText({
  text,
  className = "",
  as: Tag = "span",
  active = true,
}: GlitchTextProps) {
  return (
    <Tag
      className={`glitch ${active ? "" : "pointer-events-none"} ${className}`}
      data-text={text}
    >
      {text}
    </Tag>
  );
}
