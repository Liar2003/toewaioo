"use client";

import { useState, useRef, type FormEvent } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import HUDPanel from "@/components/ui/HUDPanel";
import TerminalText from "@/components/ui/TerminalText";
import StatusIndicator from "@/components/ui/StatusIndicator";
import { profile } from "@/data/profile";
import { Github, Send, Linkedin, Mail, Globe, MessageCircle, ExternalLink, CheckCircle, AlertTriangle, XCircle, Loader2 } from "lucide-react";

type Feedback = { tone: "ok" | "warn" | "err"; lines: string[] };

const socialIcons: Record<string, React.ElementType> = {
  github: Github,
  telegram: Send,
  linkedin: Linkedin,
  email: Mail,
  website: Globe,
};

const socialColors: Record<string, string> = {
  github: "#00f5a0",
  telegram: "#00d9ff",
  linkedin: "#00d9ff",
  email: "#ffb800",
  website: "#ff3864",
};

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setFeedback({
        tone: "err",
        lines: ["> ERROR :: ALL FIELDS REQUIRED", "> TRANSMISSION NOT SENT"],
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate sending delay for UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (profile.socials.email) {
      const subject = encodeURIComponent(`[PORTFOLIO] Transmission from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} <${email}>`);
      window.location.href = `mailto:${profile.socials.email}?subject=${subject}&body=${body}`;
      setFeedback({
        tone: "ok",
        lines: ["> TRANSMISSION COMPOSED", "> STATUS :: HANDED TO MAIL CLIENT", `> RECIPIENT :: ${profile.socials.email}`],
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
    setIsSubmitting(false);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative mx-auto max-w-7xl px-5 py-16 sm:px-12 sm:py-24 lg:px-16"
      aria-label="Contact"
    >
      {/* Background decorative elements */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      >
        <div className="absolute top-20 left-1/4 h-64 w-64 bg-neon/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-80 w-80 bg-cyan/5 rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <SectionHeading index="06" kicker="ssh operator@endpoint" title="CONNECTION TERMINAL" />
      </motion.div>

      {/* Status summary */}
      <motion.div
        className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {[
          { label: "RESPONSE TIME", value: "< 24H", color: "#00f5a0", icon: Loader2 },
          { label: "AVAILABILITY", value: "ONLINE", color: "#00d9ff", icon: CheckCircle },
          { label: "CHANNELS", value: `${Object.values(profile.socials).filter(Boolean).length}`, color: "#ffb800", icon: MessageCircle },
          { label: "STATUS", value: "LISTENING", color: "#00f5a0", icon: Send },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="p-3 bg-panel/70 border border-neon/10 rounded-sm text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            whileHover={{ scale: 1.03, borderColor: stat.color, boxShadow: `0 0 20px ${stat.color}22` }}
          >
            <stat.icon className="mx-auto h-4 w-4 mb-1" style={{ color: stat.color }} aria-hidden="true" />
            <p className="font-mono text-[8px] tracking-[0.3em] text-muted">{stat.label}</p>
            <p className="mt-0.5 font-mono text-sm font-bold tracking-wider" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Social links sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <HUDPanel
            title="endpoints"
            cornerColor="rgba(0,217,255,.55)"
            status={{ label: "LINKED", tone: "online" }}
            className="h-full"
          >
            <div className="p-6">
              <p className="mb-4 font-mono text-[10px] tracking-[0.3em] text-muted">AVAILABLE CHANNELS:</p>
              
              <div className="space-y-3">
                {Object.entries(profile.socials)
                  .filter(([, url]) => Boolean(url))
                  .map(([key, url], i) => {
                    const Icon = socialIcons[key] || ExternalLink;
                    const color = socialColors[key] || "#00f5a0";
                    return (
                      <motion.a
                        key={key}
                        href={url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 p-3 bg-black/30 border border-neon/10 rounded-sm transition-all duration-300 hover:border-neon/30 hover:bg-neon/5"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        whileHover={{ x: 4, scale: 1.02 }}
                      >
                        <motion.div
                          className="p-2 bg-black/30 rounded-sm border border-neon/10 group-hover:border-neon/30"
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <Icon className="h-4 w-4" style={{ color }} aria-hidden="true" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-[11px] tracking-wider text-frost uppercase">{key}</p>
                          <p className="font-mono text-[9px] text-muted truncate">{(url as string).replace(/https?:\/\//, "").slice(0, 30)}</p>
                        </div>
                        <ExternalLink className="h-3 w-3 text-muted group-hover:text-neon transition-colors" aria-hidden="true" />
                      </motion.a>
                    );
                  })}
              </div>

              {/* Availability status */}
              <motion.div
                className="mt-6 p-3 bg-black/30 border border-neon/10 rounded-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    className="h-2 w-2 rounded-full bg-neon"
                    animate={{ boxShadow: ["0 0 0 0 rgba(0,245,160,0.6)", "0 0 0 6px rgba(0,245,160,0)"] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="font-mono text-[10px] tracking-wider text-neon">AVAILABLE FOR PROJECTS</span>
                </div>
                <p className="mt-2 font-mono text-[9px] text-muted">Open to freelance, collaboration, and full-time opportunities.</p>
              </motion.div>
            </div>
          </HUDPanel>
        </motion.div>

        {/* Contact form */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.2, duration: 0.55 }}
        >
          <HUDPanel
            title="comm.channel"
            status={{
              label: feedback ? (feedback.tone === "ok" ? "DELIVERED" : feedback.tone === "warn" ? "QUEUED" : "ERROR") : "LISTENING",
              tone: feedback ? (feedback.tone === "ok" ? "online" : feedback.tone === "warn" ? "warning" : "danger") : "idle",
            }}
            cornerColor="rgba(0,217,255,.55)"
          >
            <div className="p-6 sm:p-8">
              <div className="mb-6 space-y-1 font-mono text-xs leading-relaxed tracking-wider text-muted">
                <TerminalText text="> WANT TO BUILD SOMETHING?" className="block text-frost" />
                <TerminalText text="> INITIALIZING COMMUNICATION CHANNEL..." className="block text-neon/80" startDelay={700} />
                <TerminalText text="> READY FOR INPUT" className="block text-cyan/60" startDelay={1400} />
              </div>

              <form onSubmit={handleSubmit} noValidate={false}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <motion.label
                    className="block"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
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
                  </motion.label>
                  <motion.label
                    className="block"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
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
                  </motion.label>
                </div>
                <motion.label
                  className="mt-4 block"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="mb-2 block font-mono text-[10px] tracking-[0.3em] text-muted">MESSAGE:</span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    className="terminal-input resize-none"
                    placeholder="./transmit --payload 'project details...'"
                  />
                </motion.label>

                <motion.button
                  type="submit"
                  className="btn-hud mt-6 w-full sm:w-auto"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      SENDING...
                    </span>
                  ) : (
                    "[ SEND TRANSMISSION ]"
                  )}
                </motion.button>
              </form>

              {/* Feedback */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    className="mt-5 border-l-2 bg-black/40 px-4 py-3 font-mono text-xs leading-relaxed tracking-wider"
                    role="status"
                    aria-live="polite"
                    initial={{ opacity: 0, x: -10, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    exit={{ opacity: 0, x: -10, height: 0 }}
                    style={{
                      borderColor:
                        feedback.tone === "ok" ? "#00F5A0" : feedback.tone === "warn" ? "#FFB800" : "#FF3864",
                    }}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {feedback.tone === "ok" && <CheckCircle className="h-4 w-4 text-neon mt-0.5" />}
                      {feedback.tone === "warn" && <AlertTriangle className="h-4 w-4 text-warn mt-0.5" />}
                      {feedback.tone === "err" && <XCircle className="h-4 w-4 text-danger mt-0.5" />}
                      <span className="font-mono text-[10px] tracking-widest" style={{
                        color: feedback.tone === "ok" ? "#00F5A0" : feedback.tone === "warn" ? "#FFB800" : "#FF3864",
                      }}>
                        {feedback.tone === "ok" ? "SUCCESS" : feedback.tone === "warn" ? "WARNING" : "ERROR"}
                      </span>
                    </div>
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </HUDPanel>
        </motion.div>
      </div>
    </section>
  );
}