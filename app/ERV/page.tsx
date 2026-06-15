"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useScroll,
  AnimatePresence,
} from "framer-motion";
import {
  Zap,
  Wind,
  ThermometerSun,
  Droplets,
  ArrowRight,
  X,
  Cpu,
  ArrowLeft,
  Activity,
  Fan,
  Download
} from "lucide-react";

const ERV_PDF_URL = "https://firebasestorage.googleapis.com/v0/b/cube-8c773.firebasestorage.app/o/erv-brochure.pdf?alt=media";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BackArrow from "components/backarrow"; 

const techSpecs = [
  { label: "Efficiency", value: "97%" },
  { label: "Airflow", value: "60 m³/h" },
  { label: "Acoustics", value: "19 dB(A)" },
  { label: "Power", value: "1.5W" },
];

const CinematicCore = ({ scrollYProgress, mouseX, mouseY }: { scrollYProgress: any, mouseX: any, mouseY: any }) => {
  // Map scroll progress to cinematic phases
  // 0.0 - 0.2: Intro / Hero
  // 0.2 - 0.5: Zoom in / Thermal Exchange active
  // 0.5 - 0.8: Blueprint / Tech Specs
  // 0.8 - 1.0: Outro / Cards

  // 3D Transforms mapped to scroll
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.6, 0.9], [0.8, 1.8, 1.2, 0.4]);
  const zPosition = useTransform(scrollYProgress, [0, 0.3, 0.6, 0.9], [0, 200, 50, -200]);
  
  // Continuous rotation that speeds up based on scroll
  const baseRotateY = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const smoothRotateY = useSpring(baseRotateY, { damping: 30, stiffness: 50 });
  
  // Mouse parallax overrides
  const mouseRotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const mouseRotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  // Lighting shifts (Starts dark, gets intense amber/cyan, fades to blue blueprint)
  const coreOpacity = useTransform(scrollYProgress, [0, 0.1, 0.8, 1], [0.3, 1, 1, 0]);
  const wireframeOpacity = useTransform(scrollYProgress, [0.4, 0.5, 0.7, 0.8], [0, 1, 1, 0]);
  const particleOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.5, 0.6], [0, 1, 1, 0]);

  return (
    <motion.div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 perspective-[2000px] z-0 pointer-events-none"
      style={{ scale }}
    >
      <motion.div 
        className="relative w-96 h-96 flex items-center justify-center transform-gpu"
        style={{ 
          rotateX: mouseRotateX, 
          rotateY: smoothRotateY,
          z: zPosition,
          transformStyle: "preserve-3d" 
        }}
      >
        {/* Core Geometry - Outer Shell */}
        <motion.div 
          className="absolute inset-0 rounded-[3rem] border border-white/10 bg-black/80 backdrop-blur-md flex items-center justify-center overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.05)]"
          style={{ transformStyle: "preserve-3d", opacity: coreOpacity }}
        >
          {/* Internal Ceramic Grid Pattern */}
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.2) 2px, transparent 2px)', backgroundSize: '24px 24px' }} />
          
          {/* Inner Glowing Core */}
          <motion.div 
            className="w-48 h-48 rounded-full bg-gradient-to-tr from-rose-500/40 to-cyan-500/40 blur-[30px]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Cinematic Particles (Hot/Cold Exchange) */}
        <motion.div style={{ opacity: particleOpacity, transformStyle: "preserve-3d" }} className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <motion.div 
              key={`hot-${i}`}
              className="absolute top-1/4 left-[-100px] w-4 h-4 bg-rose-500 rounded-full blur-[4px] shadow-[0_0_20px_#f43f5e]"
              animate={{ x: [0, 500], opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
              style={{ transform: `translateZ(${i * 40 - 80}px)` }}
            />
          ))}
          {[...Array(5)].map((_, i) => (
            <motion.div 
              key={`cold-${i}`}
              className="absolute bottom-1/4 right-[-100px] w-4 h-4 bg-cyan-400 rounded-full blur-[4px] shadow-[0_0_20px_#22d3ee]"
              animate={{ x: [0, -500], opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 + 0.25, ease: "easeInOut" }}
              style={{ transform: `translateZ(${i * 40 - 80}px)` }}
            />
          ))}
        </motion.div>

        {/* Blueprint Wireframe Overlay */}
        <motion.div 
          className="absolute inset-[-20px] rounded-[3.5rem] border-[2px] border-cyan-500/50 border-dashed"
          style={{ opacity: wireframeOpacity, transform: "translateZ(50px)" }}
        >
           <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-500/50 shadow-[0_0_15px_#06b6d4]" />
           <div className="absolute top-0 left-1/2 w-[1px] h-full bg-cyan-500/50 shadow-[0_0_15px_#06b6d4]" />
           {/* Scanning laser */}
           <motion.div 
             className="absolute top-0 left-0 w-full h-[2px] bg-cyan-300 shadow-[0_0_20px_#67e8f9]"
             animate={{ top: ["0%", "100%", "0%"] }}
             transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
           />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const HUDOverlay = ({ scrollYProgress }: { scrollYProgress: any }) => {
  const hudOpacity = useTransform(scrollYProgress, [0.05, 0.1, 0.9, 0.95], [0, 1, 1, 0]);
  const tempValue = useTransform(scrollYProgress, [0.2, 0.4], [94, 72]); // External to internal cooling mapping
  const efficiencyValue = useTransform(scrollYProgress, [0.1, 0.3], [0, 97]);
  
  const [displayTemp, setDisplayTemp] = useState(94);
  const [displayEff, setDisplayEff] = useState(0);

  useEffect(() => {
    return tempValue.onChange((v) => setDisplayTemp(Math.round(v)));
  }, [tempValue]);

  useEffect(() => {
    return efficiencyValue.onChange((v) => setDisplayEff(Math.round(v)));
  }, [efficiencyValue]);

  return (
    <motion.div 
      className="fixed inset-0 pointer-events-none z-40 p-8 flex flex-col justify-between"
      style={{ opacity: hudOpacity }}
    >
      <div className="flex justify-between items-start mt-20">
        <div className="flex flex-col gap-1 border-l-2 border-cyan-500/50 pl-3">
          <span className="text-[9px] text-cyan-400 font-mono tracking-[0.3em] uppercase">Sys_Status</span>
          <span className="text-white font-mono text-sm">Active Exchange</span>
        </div>
        <div className="flex flex-col gap-1 items-end border-r-2 border-rose-500/50 pr-3">
          <span className="text-[9px] text-rose-400 font-mono tracking-[0.3em] uppercase">Ext_Environment</span>
          <span className="text-white font-mono text-sm">Thermal Extremes</span>
        </div>
      </div>

      <div className="flex justify-between items-end mb-10">
        <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-48">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-zinc-400 font-mono uppercase">Recovery Core</span>
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          </div>
          <div className="text-3xl font-light text-white">{displayEff}%</div>
          <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
             <div className="h-full bg-emerald-400" style={{ width: `${displayEff}%` }} />
          </div>
        </div>

        <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-48 text-right">
           <div className="flex justify-end items-center mb-2 gap-2">
            <ThermometerSun className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] text-zinc-400 font-mono uppercase">Internal Climate</span>
          </div>
          <div className="text-3xl font-light text-white">{displayTemp}°</div>
          <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden flex justify-end">
             <div className="h-full bg-blue-400" style={{ width: `${100 - (displayTemp - 72) * 2}%` }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const NarrativeText = ({ scrollYProgress, fadeRange, title, subtitle, align = "center" }: any) => {
  // fadeRange expects an array of 4 points: [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd]
  const opacity = useTransform(scrollYProgress, fadeRange, [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, fadeRange, [50, 0, 0, -50]);
  const scale = useTransform(scrollYProgress, [fadeRange[0], fadeRange[1]], [0.9, 1]);

  const alignClass = align === "left" ? "items-start text-left" : align === "right" ? "items-end text-right" : "items-center text-center mx-auto";

  return (
    <motion.div 
      className={`absolute w-full max-w-2xl px-6 flex flex-col ${alignClass}`}
      style={{ opacity, y, scale }}
    >
      <span className="text-cyan-400 text-xs font-mono tracking-[0.3em] uppercase mb-4 block">
        {subtitle}
      </span>
      <h2 className="text-5xl md:text-7xl font-light tracking-tighter text-white leading-[1.1]">
        {title}
      </h2>
    </motion.div>
  );
};

export default function ERVExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", contact: "" });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 100, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 100, mass: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) - 0.5);
      mouseY.set((e.clientY / window.innerHeight) - 0.5);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 800));
      window.open(ERV_PDF_URL, "_blank");
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  // Background shifts based on scroll phase
  const bgColor = useTransform(
    scrollYProgress, 
    [0, 0.4, 0.6, 1], 
    ["#020202", "#050014", "#000814", "#020202"]
  );

  return (
    <motion.div ref={containerRef} style={{ backgroundColor: bgColor }} className="relative w-full text-white selection:bg-cyan-500/30 font-sans h-[500vh]">
      <Header />
      <BackArrow />
      <HUDOverlay scrollYProgress={scrollYProgress} />

      {/* STICKY 3D ENVIRONMENT */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Global Particle Noise */}
        <div className="absolute inset-0 z-0 opacity-[0.04] mix-blend-overlay pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <filter id="noiseExp"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" /></filter>
            <rect width="100%" height="100%" filter="url(#noiseExp)" />
          </svg>
        </div>

        {/* Ambient Cursor Light */}
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ background: useMotionTemplate`radial-gradient(800px circle at ${useTransform(smoothX, [-0.5, 0.5], [0, 100])}% ${useTransform(smoothY, [-0.5, 0.5], [0, 100])}%, rgba(34,211,238,0.03), transparent 60%)` }}
        />

        {/* The Central Cinematic Object */}
        <CinematicCore scrollYProgress={scrollYProgress} mouseX={smoothX} mouseY={smoothY} />

        {/* NARRATIVE TEXT LAYERS (Absolute positioned within the sticky container, driven by scroll) */}
        
        {/* Phase 1: 0% - 15% */}
        <NarrativeText 
          scrollYProgress={scrollYProgress} 
          fadeRange={[0, 0.05, 0.1, 0.15]}
          subtitle="System Initialization" 
          title={<>Breathe <span className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-300 to-zinc-700">Better.</span></>} 
        />

        {/* Phase 2: 25% - 40% */}
        <NarrativeText 
          scrollYProgress={scrollYProgress} 
          fadeRange={[0.2, 0.25, 0.35, 0.4]}
          align="left"
          subtitle="Thermal Exchange" 
          title={<><span className="text-rose-500 font-bold">Heat</span> Captured. <br/><span className="text-cyan-400 font-bold">Air</span> Purified.</>} 
        />

        {/* Phase 3: 50% - 65% (Blueprint Mode) */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-between px-[10%]"
          style={{ 
            opacity: useTransform(scrollYProgress, [0.45, 0.5, 0.65, 0.7], [0, 1, 1, 0]),
            pointerEvents: useTransform(scrollYProgress, (v) => v > 0.45 && v < 0.7 ? "auto" : "none")
          }}
        >
           <div className="flex flex-col gap-8 w-64">
             {techSpecs.slice(0, 2).map((spec, i) => (
               <div key={i} className="border-l-2 border-cyan-500/30 pl-4 py-2 bg-black/40 backdrop-blur-md rounded-r-xl">
                 <span className="block text-[10px] text-cyan-400 font-mono tracking-widest uppercase">{spec.label}</span>
                 <span className="text-2xl text-white font-light">{spec.value}</span>
               </div>
             ))}
           </div>
           <div className="flex flex-col gap-8 w-64 items-end text-right">
             {techSpecs.slice(2, 4).map((spec, i) => (
               <div key={i} className="border-r-2 border-cyan-500/30 pr-4 py-2 bg-black/40 backdrop-blur-md rounded-l-xl w-full">
                 <span className="block text-[10px] text-cyan-400 font-mono tracking-widest uppercase">{spec.label}</span>
                 <span className="text-2xl text-white font-light">{spec.value}</span>
               </div>
             ))}
           </div>
        </motion.div>

        {/* Phase 4: 75% - 90% (Features Fly in) */}
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center pt-20 px-6 max-w-6xl mx-auto"
          style={{ 
            opacity: useTransform(scrollYProgress, [0.7, 0.75, 0.9, 0.95], [0, 1, 1, 0]),
            y: useTransform(scrollYProgress, [0.7, 0.75], [100, 0]),
            pointerEvents: useTransform(scrollYProgress, (v) => v > 0.7 && v < 0.95 ? "auto" : "none")
          }}
        >
          <h2 className="text-3xl font-light mb-12">Architectural <span className="font-bold">Advantages</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
             {[
               { icon: Zap, title: "Energy Recovery", desc: "Proprietary ceramic core captures and transfers heat efficiently.", color: "text-amber-400" },
               { icon: Wind, title: "Continuous Flow", desc: "Operates 24/7 in total silence, constantly replacing stale air.", color: "text-cyan-400" },
               { icon: ThermometerSun, title: "Thermal Stability", desc: "Maintains indoor climate regardless of external fluctuations.", color: "text-rose-400" },
               { icon: Droplets, title: "Humidity Control", desc: "Actively balances moisture levels to prevent mold growth.", color: "text-blue-400" },
             ].map((feature, i) => {
               const Icon = feature.icon;
               return (
                 <div key={i} className="bg-black/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex gap-6 items-start hover:bg-white/[0.05] transition-colors cursor-pointer group">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/10 shrink-0 ${feature.color} group-hover:scale-110 transition-transform`}>
                     <Icon className="w-5 h-5" />
                   </div>
                   <div>
                     <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                     <p className="text-sm text-zinc-400">{feature.desc}</p>
                   </div>
                 </div>
               );
             })}
          </div>
        </motion.div>

        {/* Phase 5: 90% - 100% (Terminal CTA) */}
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
          style={{ 
            opacity: useTransform(scrollYProgress, [0.9, 0.95], [0, 1]),
            scale: useTransform(scrollYProgress, [0.9, 1], [0.8, 1]),
            pointerEvents: useTransform(scrollYProgress, (v) => v > 0.95 ? "auto" : "none")
          }}
        >
          <div className="w-24 h-24 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(34,211,238,0.2)]">
            <Download className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-5xl font-light mb-6">Acquire <span className="font-bold">Documentation.</span></h2>
          <p className="text-zinc-400 max-w-md text-center mb-10">Get full technical details, installation guidance, and performance specifications for the ECO Pair Plus.</p>
          
          <button
            onClick={() => setShowForm(true)}
            className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white px-10 text-sm font-bold text-black shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all hover:scale-105 active:scale-95"
          >
            <span className="mr-3">Initiate Transfer</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity mix-blend-overlay"></div>
          </button>
        </motion.div>

        {/* Global Scroll Progress Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-zinc-500">
            Scroll Sequence
          </span>
          <div className="w-[1px] h-16 bg-zinc-800 relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 w-full bg-cyan-500"
              style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
            />
          </div>
        </div>

      </div>

      {/* SPATIAL CONTACT MODAL */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, rotateX: 10 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.9, y: 20, rotateX: 10, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-[#0a0a0a]/90 border border-white/10 rounded-[2rem] p-8 shadow-[0_0_100px_rgba(0,0,0,0.8)] perspective-[1000px]"
            >
              <button 
                onClick={() => !loading && setShowForm(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-light text-white mb-2">Secure Download</h2>
                <p className="text-sm text-zinc-400">Establish a link to receive the technical documentation.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {['Name', 'Email', 'Contact'].map((field) => (
                  <div key={field} className="relative group">
                    <input
                      required
                      type={field === 'Email' ? 'email' : 'text'}
                      placeholder={field}
                      value={form[field.toLowerCase() as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field.toLowerCase()]: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all"
                    />
                  </div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 bg-white text-black py-4 rounded-xl text-sm font-bold relative overflow-hidden group"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    "Initiate Transfer"
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite] opacity-50" />
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}