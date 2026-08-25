"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import BootSequence from "@/components/intro/BootSequence";
import Navigation from "@/components/Navigation";
import Scanline from "@/components/ui/Scanline";
import Hero from "@/components/hero/Hero";
import About from "@/components/sections/About";
import TechStack from "@/components/sections/TechStack";
import Projects from "@/components/sections/Projects";
import Architecture from "@/components/sections/Architecture";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

const BOOT_KEY = "mgmg-boot-complete";

export default function PortfolioApp() {
  const [bootDone, setBootDone] = useState(false);
  const [showBoot, setShowBoot] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(BOOT_KEY) === "1";
    } catch {
      seen = false;
    }
    if (!seen) {
      setShowBoot(true);
      document.body.style.overflow = "hidden";
    } else {
      setBootDone(true);
    }
  }, []);

  const handleComplete = useCallback(() => {
    setShowBoot(false);
    setBootDone(true);
    document.body.style.overflow = "";
    try {
      sessionStorage.setItem(BOOT_KEY, "1");
    } catch {
      /* storage unavailable — intro simply replays next visit */
    }
  }, []);

  return (
    <>
      <AnimatePresence>
        {showBoot && <BootSequence key="boot" onComplete={handleComplete} />}
      </AnimatePresence>

      <Scanline />
      <Navigation />

      {/* persistent grid backdrop — stays fixed behind every section */}
      <div className="bg-grid pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="bg-grid-fade absolute inset-0" />
      </div>

      <main>
        <Hero bootDone={bootDone} />
        <About />
        <TechStack />
        <Projects />
        <Architecture />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
