"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Hero() {
  const fullText = "SMARTER THAN EVER";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    let timer: NodeJS.Timeout;

    // Wait for the initial Hero animations to finish before typing starts
    const timeout = setTimeout(() => {
      timer = setInterval(() => {
        if (i < fullText.length) {
          setDisplayedText(fullText.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      }, 100); // Typing speed in milliseconds
    }, 800); // Initial delay to match the parent element's stagger

    return () => {
      clearTimeout(timeout);
      clearInterval(timer);
    };
  }, []);

  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-[#050505]">
      {/* Wavy Line Background Graphic (Abstract representation) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-40">
        <svg
          className="w-full h-full min-w-[1200px]"
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-100 300C200 150 400 450 800 300C1200 150 1400 400 1600 300"
            stroke="url(#paint0_linear)"
            strokeWidth="1"
          />
          <path
            d="M-100 310C220 160 420 460 820 310C1220 160 1420 410 1620 310"
            stroke="url(#paint0_linear)"
            strokeWidth="0.8"
            opacity="0.8"
          />
          <path
            d="M-100 320C240 170 440 470 840 320C1240 170 1440 420 1640 320"
            stroke="url(#paint0_linear)"
            strokeWidth="0.6"
            opacity="0.6"
          />
          <path
            d="M-100 330C260 180 460 480 860 330C1260 180 1460 430 1660 330"
            stroke="url(#paint0_linear)"
            strokeWidth="0.4"
            opacity="0.4"
          />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="0"
              y1="300"
              x2="1440"
              y2="300"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#ffffff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Subtle Central Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.05)_0%,rgba(0,0,0,0)_50%)] z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6 flex flex-col items-center">
        {/* Glowing Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
        >
          <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
          <span className="text-zinc-200 text-sm font-medium tracking-wide">
            Intelligent Homes. Effortless Living.
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-white mt-6"
        >
          YOUR HOME
          <br />
          <span className="text-[#888888] font-normal flex items-center justify-center mt-2 h-[1.2em]">
            {displayedText}
            {/* Blinking Cursor Animation */}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="inline-block w-[4px] h-[0.9em] bg-[#888888] ml-1 rounded-full"
            />
          </span>
        </motion.h1>

        {/* Sub-paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base md:text-lg text-zinc-300 max-w-2xl mx-auto mt-8 leading-relaxed font-light"
        >
          Convenience, safety, security, and energy savings seamlessly integrated in one smart solution that makes your home work for you.
        </motion.p>
      </div>
    </section>
  );
}