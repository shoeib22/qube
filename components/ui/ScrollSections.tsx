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

// Individual section component to handle localized scroll animations
function CinematicSection({ section }: { section: typeof sections[0] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax effect restricted to Y-axis for optimal GPU performance
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={containerRef} className="relative h-[120vh] flex items-center justify-center overflow-hidden">
      
      {/* Parallax Background */}
      <motion.div 
        style={{ y, willChange: "transform" }}
        className="absolute inset-0 w-full h-[130%] -top-[15%] z-0"
      >
        <img
          src={section.img}
          alt={section.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover opacity-60"
        />
      </motion.div>

      {/* Heavy Cinematic Vignette & Gradients - Static, no repaints */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030303_100%)] opacity-80 pointer-events-none" />

      {/* Floating Glass Content Card */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pointer-events-none">
        <div className={`flex w-full ${section.align === 'right' ? 'justify-end' : 'justify-start'}`}>
          <motion.div 
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: "transform, opacity, filter" }}
            className="max-w-2xl relative pointer-events-auto"
          >
            {/* The Glass Panel */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 -m-8 sm:-m-12 z-[-1]" style={{ WebkitBackdropFilter: "blur(24px)" }} />
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-mono text-zinc-500 tracking-wider">
                {section.num}
              </span>
              <div className="h-[1px] w-12 bg-white/20" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-zinc-600">
                {section.tag}
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter text-white leading-[1.1] mb-8">
              {section.title}
            </h2>
            
            <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed font-light max-w-lg">
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