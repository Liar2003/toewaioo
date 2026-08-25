"use client";

import { useEffect, useRef, useState } from "react";

type TerminalLogsProps = {
  lines: string[];
  charSpeed?: number;
  lineDelay?: number;
  onDone?: () => void;
};

export default function TerminalLogs({
  lines,
  charSpeed = 12,
  lineDelay = 130,
  onDone,
}: TerminalLogsProps) {
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const typeNextChar = () => {
      const line = lines[lineIndex];
      setCurrent(line.slice(0, ++charIndex));
      if (charIndex >= line.length) {
        if (interval) clearInterval(interval);
        setCompletedLines((prev) => [...prev, line]);
        setCurrent("");
        lineIndex += 1;
        charIndex = 0;
        if (lineIndex < lines.length) {
          timeout = setTimeout(startLine, lineDelay);
        } else if (!doneRef.current) {
          doneRef.current = true;
          onDoneRef.current?.();
        }
      }
    };

    const startLine = () => {
      if (lineIndex >= lines.length) return;
      interval = setInterval(typeNextChar, charSpeed);
    };

    timeout = setTimeout(startLine, 250);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [lines, charSpeed, lineDelay]);

  return (
    <div className="font-mono text-xs leading-6 sm:text-sm">
      {completedLines.map((line, i) => (
        <p key={i} className="text-neon/80" aria-hidden="true">
          <span className="mr-2 text-muted">&gt;</span>
          {line}
        </p>
      ))}
      {current && (
        <p className="text-frost" aria-hidden="true">
          <span className="mr-2 text-muted">&gt;</span>
          {current}
          <span className="ml-1 inline-block h-[0.9em] w-[0.5em] translate-y-[0.15em] animate-blink bg-neon" />
        </p>
      )}
      <span className="sr-only">System initializing…</span>
    </div>
  );
}
