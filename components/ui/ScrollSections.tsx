"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const sections = [
  {
    num: "01",
    tag: "Smart Architecture",
    title: "Seamless Automation, Tailored for You.",
    desc: "From basic smart setups to fully integrated home automation — custom-engineered to adapt intuitively to your daily lifestyle.",
    img: "https://firebasestorage.googleapis.com/v0/b/cube-8c773.firebasestorage.app/o/ChatGPT%20Image%20Jun%2015%2C%202026%2C%2004_52_36%20PM.png?alt=media&token=4405ffa9-c5e9-4f74-961e-d5e6d8e5796d0.+=crop",
    align: "left"
  },
  {
    num: "02",
    tag: "Complete Control",
    title: "Monitor and Manage Remotely, Effortlessly.",
    desc: "From live views of each room to granular control of lighting, climate, and security. Xerovolt brings your entire home to your fingertips.",
    img: "https://firebasestorage.googleapis.com/v0/b/cube-8c773.firebasestorage.app/o/ChatGPT%20Image%20Jun%2015%2C%202026%2C%2004_58_10%20PM.png?alt=media&token=a77d8e47-d38a-4c6a-8bd4-20a2e9e7859c=crop",
    align: "right"
  }
];

function CinematicSection({ section }: { section: typeof sections[0] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax — only applied on sm+ via CSS. The transform still runs but won't
  // compound with backdrop-blur-2xl on mobile (that's already md:backdrop-blur-2xl).
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={containerRef} className="relative h-[100dvh] sm:h-[120dvh] flex items-center justify-center overflow-hidden">

      {/* Parallax Background */}
      <motion.div
        style={{ y, willChange: "transform" }}
        className="absolute inset-0 w-full h-[120%] -top-[10%] z-0"
      >
        <img
          src={section.img}
          alt={section.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover opacity-50 sm:opacity-60"
        />
      </motion.div>

      {/* Vignette */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030303_100%)] opacity-80 pointer-events-none" />

      {/* Content Card */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pointer-events-none">
        <div className={`flex w-full ${section.align === 'right' ? 'justify-end' : 'justify-start'}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="max-w-xl sm:max-w-2xl relative pointer-events-auto"
          >
            {/* Glassmorphic backing — light blur on mobile, heavy on desktop */}
            <div className="absolute inset-0 bg-black/50 sm:bg-black/40 backdrop-blur-sm md:backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/10 -m-5 sm:-m-8 md:-m-12 z-[-1]" />

            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <span className="text-xs sm:text-sm font-mono text-zinc-500 tracking-wider">{section.num}</span>
              <div className="h-[1px] w-10 sm:w-12 bg-white/20" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-zinc-600">
                {section.tag}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tighter text-white leading-[1.1] mb-4 sm:mb-8">
              {section.title}
            </h2>

            <p className="text-sm sm:text-lg md:text-xl text-zinc-400 leading-relaxed font-light max-w-lg">
              {section.desc}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function ScrollSections() {
  return (
    <section className="bg-[#030303]">
      {sections.map((section, idx) => (
        <CinematicSection key={idx} section={section} />
      ))}
    </section>
  );
}
