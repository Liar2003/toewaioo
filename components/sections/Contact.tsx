"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import HUDPanel from "@/components/ui/HUDPanel";
import TerminalText from "@/components/ui/TerminalText";
import StatusIndicator from "@/components/ui/StatusIndicator";
import { profile } from "@/data/profile";

type Feedback = { tone: "ok" | "warn" | "err"; lines: string[] };

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setFeedback({
        tone: "err",
        lines: ["> ERROR :: ALL FIELDS REQUIRED", "> TRANSMISSION NOT SENT"],
      });
      return;
    }
    if (profile.socials.email) {
      const subject = encodeURIComponent(`[PORTFOLIO] Transmission from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} <${email}>`);
      window.location.href = `mailto:${profile.socials.email}?subject=${subject}&body=${body}`;
      setFeedback({
        tone: "ok",
        lines: ["> TRANSMISSION COMPOSED", "> STATUS :: HANDED TO MAIL CLIENT"],
      });
    } else {
      setFeedback({
        tone: "warn",
        lines: [
          "> CHANNEL OFFLINE :: NO TRANSMISSION ENDPOINT CONFIGURED",
          "> STATUS :: QUEUED LOCALLY",
        ],
      });
    }
  };

  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-6 py-24 sm:px-12 lg:px-16" aria-label="Contact">
      <SectionHeading index="06" kicker="ssh operator@endpoint" title="CONNECTION TERMINAL" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        <HUDPanel
          title="comm.channel"
          status={{ label: feedback ? (feedback.tone === "ok" ? "DELIVERED" : feedback.tone === "warn" ? "QUEUED" : "ERROR") : "LISTENING", tone: feedback ? (feedback.tone === "ok" ? "online" : feedback.tone === "warn" ? "warning" : "danger") : "idle" }}
          cornerColor="rgba(0,217,255,.55)"
          className="mx-auto max-w-3xl"
        >
          <div className="p-6 sm:p-8">
            <div className="mb-6 space-y-1 font-mono text-xs leading-relaxed tracking-wider text-muted">
              <TerminalText text="> WANT TO BUILD SOMETHING?" className="block text-frost" />
              <TerminalText text="> INITIALIZING COMMUNICATION CHANNEL..." className="block text-neon/80" startDelay={700} />
            </div>

            <form onSubmit={handleSubmit} noValidate={false}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block font-mono text-[10px] tracking-[0.3em] text-muted">NAME:</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    className="terminal-input"
                    placeholder="operator_name"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-mono text-[10px] tracking-[0.3em] text-muted">EMAIL:</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="terminal-input"
                    placeholder="you@node.net"
                  />
                </label>
              </div>
              <label className="mt-4 block">
                <span className="mb-2 block font-mono text-[10px] tracking-[0.3em] text-muted">MESSAGE:</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="terminal-input resize-none"
                  placeholder="./transmit --payload 'project details...'"
                />
              </label>

              <button type="submit" className="btn-hud mt-6 w-full sm:w-auto">
                [ SEND TRANSMISSION ]
              </button>
            </form>

            {feedback && (
              <div
                className="mt-5 border-l-2 bg-black/40 px-4 py-3 font-mono text-xs leading-relaxed tracking-wider"
                role="status"
                aria-live="polite"
                style={{
                  borderColor:
                    feedback.tone === "ok" ? "#00F5A0" : feedback.tone === "warn" ? "#FFB800" : "#FF3864",
                }}
              >
                {feedback.lines.map((line) => (
                  <p
                    key={line}
                    style={{
                      color:
                        feedback.tone === "ok" ? "#00F5A0" : feedback.tone === "warn" ? "#FFB800" : "#FF3864",
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* configured social links only */}
          {Object.values(profile.socials).some(Boolean) && (
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-neon/10 px-6 py-3">
              {Object.entries(profile.socials)
                .filter(([, url]) => Boolean(url))
                .map(([key, url]) => (
                  <a
                    key={key}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] tracking-[0.25em] text-muted transition-colors hover:text-cyan"
                  >
                    [{key.toUpperCase()}]
                  </a>
                ))}
              <span className="ml-auto">
                <StatusIndicator label="ENDPOINTS LINKED" />
              </span>
            </div>
          )}
        </HUDPanel>
      </motion.div>
    </section>
  );
}
