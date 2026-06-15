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
  Variants,
} from "framer-motion";
import {
  Smartphone,
  Sliders,
  Layers,
  Zap,
  ArrowRight,
  X,
  Cpu,
  ArrowLeft,
  Power,
  Sun,
  Moon,
  Volume2,
  Lock,
  Import
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BackArrow from "../../components/backarrow";
// ------------------------------------------

// --- Custom 3D Visualizer: The Holographic Smart Panel ---
const HolographicSmartPanel = ({ mouseX, mouseY }: { mouseX: any, mouseY: any }) => {
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  return (
    <motion.div 
      className="absolute top-[10%] right-[2%] lg:right-[8%] perspective-[1500px] hidden lg:block z-20"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} 
        className="relative w-[380px] h-[500px] bg-[#020202]/60 border border-white/10 rounded-[2.5rem] backdrop-blur-2xl p-6 flex flex-col shadow-2xl group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-[2.5rem] pointer-events-none" />
        
        {/* Hardware Bezel details */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1 bg-white/5 rounded-full" />
        
        {/* Layer 1: Base Screen Glow */}
        <div style={{ transform: "translateZ(-20px)" }} className="absolute inset-6 bg-gradient-to-b from-amber-500/10 to-blue-500/5 rounded-2xl blur-lg" />

        {/* --- 3D Floating UI Elements --- */}
        <div style={{ transform: "translateZ(40px)" }} className="relative z-10 flex flex-col h-full mt-4">
           {/* Top Info Bar */}
           <div className="flex justify-between items-center mb-6">
             <div className="flex flex-col">
                <span className="text-white text-xl font-light">Living Room</span>
                <span className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase">72° • 45% Humidity</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Power className="w-4 h-4 text-amber-400" />
             </div>
           </div>

           {/* Central Scene Grid */}
           <div style={{ transform: "translateZ(30px)" }} className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-amber-500/20 transition-colors">
                 <Sun className="w-6 h-6 text-amber-400" />
                 <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">Morning</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/10 transition-colors">
                 <Moon className="w-6 h-6 text-zinc-400" />
                 <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Night</span>
              </div>
           </div>

           {/* Sliders pushed out further */}
           <div style={{ transform: "translateZ(60px)" }} className="space-y-4 flex-grow">
              {/* Lighting Slider */}
              <div className="w-full bg-white/5 rounded-2xl p-4 border border-white/10">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-white">Main Lights</span>
                    <span className="text-[10px] font-mono text-zinc-400">85%</span>
                 </div>
                 <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-amber-400 shadow-[0_0_10px_#fbbf24]" />
                 </div>
              </div>
              
              {/* Audio Slider */}
              <div className="w-full bg-white/5 rounded-2xl p-4 border border-white/10">
                 <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                       <Volume2 className="w-3 h-3 text-blue-400" />
                       <span className="text-xs text-white">Audio Array</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">40%</span>
                 </div>
                 <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                    <div className="w-[40%] h-full bg-blue-400 shadow-[0_0_10px_#60a5fa]" />
                 </div>
              </div>
           </div>

           {/* Bottom Security Dock */}
           <div style={{ transform: "translateZ(20px)" }} className="mt-auto pt-4 border-t border-white/10 flex justify-center">
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
                 <Lock className="w-3 h-3 text-emerald-400" />
                 <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">Perimeter Secure</span>
              </div>
           </div>
        </div>

        {/* Dynamic Glass Specular Highlight (The Twist) */}
        <div 
          style={{ transform: "translateZ(100px)" }}
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent rounded-[2.5rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        />
      </motion.div>
    </motion.div>
  );
};

// --- Spatial Bento Card Wrapper ---
interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  index: number;
}

const SpatialBentoCard = ({ children, className = "", glowColor = "rgba(251, 191, 36, 0.15)", index }: BentoCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isHovered = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 100, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 100, mass: 0.5 });
  const smoothHover = useSpring(isHovered, { damping: 20, stiffness: 100 });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

  const glareX = useTransform(smoothX, [-0.5, 0.5], [100, -100]);
  const glareBackground = useMotionTemplate`linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.06) ${glareX}%, transparent 80%)`;
  const lightBackground = useMotionTemplate`radial-gradient(600px circle at ${useTransform(smoothX, [-0.5, 0.5], [0, 100])}% ${useTransform(smoothY, [-0.5, 0.5], [0, 100])}%, rgba(255,255,255,0.03), transparent 60%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width - 0.5);
    mouseY.set((e.clientY - top) / height - 0.5);
    isHovered.set(1);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    isHovered.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative perspective-[1200px] group ${className}`}
    >
      <motion.div
        className="relative h-full w-full rounded-[2rem] border border-white/[0.08] bg-[#080808]/80 backdrop-blur-3xl overflow-hidden transform-gpu"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <motion.div className="absolute inset-0 pointer-events-none mix-blend-screen z-10" style={{ background: lightBackground, opacity: smoothHover }} />
        <motion.div className="absolute inset-0 pointer-events-none mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: glareBackground, transform: "translateZ(1px)" }} />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-[60px] z-0" style={{ background: `radial-gradient(circle at 50% 50%, ${glowColor}, transparent 70%)`, transform: "translateZ(-50px)" }} />

        <div className="relative h-full w-full z-20 p-8 flex flex-col transform-gpu" style={{ transformStyle: "preserve-3d" }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Spatial Background Environment ---
const SpatialBackground = ({ globalX, globalY }: { globalX: any, globalY: any }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden perspective-[1200px]">
      <div className="absolute inset-0 bg-[#020202]" />
      
      {/* 3D Blueprint Floor */}
      <motion.div 
        className="absolute bottom-[-40%] left-[-50%] right-[-50%] h-[100%] border-t border-amber-500/[0.03]"
        style={{
          rotateX: 75,
          backgroundImage: "linear-gradient(to right, rgba(251,191,36,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(251,191,36,0.02) 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
          transformStyle: "preserve-3d"
        }}
      >
        {/* Simulated Touch Ripples mapped to the floor */}
        <div className="absolute top-1/2 left-1/2 flex items-center justify-center">
           {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute rounded-full border border-amber-500/10"
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{ width: "80vw", height: "80vw", opacity: [0, 1, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: ring * 2, ease: "easeOut" }}
              />
           ))}
        </div>
      </motion.div>

      {/* Parallax Ambient Orbs */}
      <motion.div
        className="absolute top-[20%] left-[20%] w-[600px] h-[600px] rounded-full bg-amber-600/5 blur-[120px]"
        style={{ x: useTransform(globalX, [-0.5, 0.5], [-80, 80]), y: useTransform(globalY, [-0.5, 0.5], [-80, 80]) }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[120px]"
        style={{ x: useTransform(globalX, [-0.5, 0.5], [60, -60]), y: useTransform(globalY, [-0.5, 0.5], [60, -60]) }}
      />
      
      {/* Noise Grain */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noiseSP"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" /></filter>
          <rect width="100%" height="100%" filter="url(#noiseSP)" />
        </svg>
      </div>
    </div>
  );
};

export default function SmartPanelsPage() {
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
      await new Promise((res) => setTimeout(res, 1200));
      setShowForm(false);
      setForm({ name: "", email: "", contact: "" });
    } catch {} finally {
      setLoading(false);
    }
  };

  const textReveal: Variants = {
    hidden: { opacity: 0, z: -100, rotateX: -20, filter: "blur(15px)" },
    visible: { opacity: 1, z: 0, rotateX: 0, filter: "blur(0px)", transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen w-full text-white overflow-x-hidden selection:bg-amber-500/30 relative font-sans bg-[#020202]">
      <Header />
      <BackArrow />
      <SpatialBackground globalX={smoothX} globalY={smoothY} />

      {/* Global Ambient Cursor Light */}
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: useMotionTemplate`radial-gradient(800px circle at ${useTransform(smoothX, [-0.5, 0.5], [0, 100])}% ${useTransform(smoothY, [-0.5, 0.5], [0, 100])}%, rgba(251,191,36,0.03), transparent 60%)` }}
      />

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-48 pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center perspective-[2000px] min-h-[800px]">
        
        {/* The 3D Holographic Twist */}
        <HolographicSmartPanel mouseX={smoothX} mouseY={smoothY} />

        <motion.div 
          initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="max-w-3xl space-y-8 transform-gpu relative z-30 lg:pr-[400px] text-left"
          style={{ 
            rotateX: useTransform(smoothY, [-0.5, 0.5], [8, -8]), 
            rotateY: useTransform(smoothX, [-0.5, 0.5], [-8, 8]),
            z: useTransform(smoothY, [-0.5, 0.5], [20, 60]),
            transformStyle: "preserve-3d" 
          }}
        >
          <motion.div variants={textReveal} className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(251,191,36,0.05)]" style={{ transform: "translateZ(100px)" }}>
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span className="text-zinc-300 text-[11px] font-semibold tracking-[0.25em] uppercase">Control Interfaces</span>
          </motion.div>

          <motion.h1 variants={textReveal} className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-[1.05]" style={{ transform: "translateZ(140px)" }}>
            One Panel. <br/>
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-300 to-zinc-700">Total Control.</span>
          </motion.h1>

          <motion.p variants={textReveal} className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed max-w-lg" style={{ transform: "translateZ(80px)" }}>
            Centralize your home’s intelligence with elegant, low-latency touch panels designed for speed, simplicity, and modern architecture.
          </motion.p>
        </motion.div>
      </section>

      {/* --- BENTO GRID: ADVANTAGES --- */}
      <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-zinc-500">System Capabilities</h2>
          <p className="text-3xl font-light text-white">Hardware Advantages</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[280px]">
          
          <SpatialBentoCard index={1} glowColor="rgba(251, 191, 36, 0.15)">
            <div className="flex justify-between items-start mb-6" style={{ transform: "translateZ(20px)" }}>
              <div><h3 className="text-xl font-semibold text-white">Centralized Control</h3><p className="text-zinc-400 text-sm mt-1">Lighting, climate, and security unified.</p></div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400"><Smartphone className="w-5 h-5" /></div>
            </div>
          </SpatialBentoCard>

          <SpatialBentoCard index={2} glowColor="rgba(96, 165, 250, 0.15)">
            <div className="flex justify-between items-start mb-6" style={{ transform: "translateZ(20px)" }}>
              <div><h3 className="text-xl font-semibold text-white">Custom Scenes</h3><p className="text-zinc-400 text-sm mt-1">One-touch atmospheric adjustments.</p></div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400"><Sliders className="w-5 h-5" /></div>
            </div>
            <div className="flex-grow flex items-center gap-4" style={{ transform: "translateZ(40px)" }}>
               {['Morning', 'Away', 'Cinema'].map((scene, i) => (
                 <div key={i} className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-center text-xs text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer">{scene}</div>
               ))}
            </div>
          </SpatialBentoCard>

          <SpatialBentoCard index={3} glowColor="rgba(192, 132, 252, 0.15)">
            <div className="flex justify-between items-start mb-6" style={{ transform: "translateZ(20px)" }}>
              <div><h3 className="text-xl font-semibold text-white">Seamless Integration</h3><p className="text-zinc-400 text-sm mt-1">Native pairing with AV & Security cores.</p></div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400"><Layers className="w-5 h-5" /></div>
            </div>
          </SpatialBentoCard>

          <SpatialBentoCard index={4} glowColor="rgba(52, 211, 153, 0.15)">
            <div className="flex justify-between items-start mb-6" style={{ transform: "translateZ(20px)" }}>
              <div><h3 className="text-xl font-semibold text-white">Instant Response</h3><p className="text-zinc-400 text-sm mt-1">Zero-latency capacitive touch hardware.</p></div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><Zap className="w-5 h-5" /></div>
            </div>
            <div className="flex-grow flex items-end w-full" style={{ transform: "translateZ(40px)" }}>
              <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden">
                <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }} className="h-full bg-emerald-400" />
              </div>
            </div>
          </SpatialBentoCard>

        </div>
      </section>

      {/* --- DEPLOYMENT TIMELINE --- */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-24 space-y-4"
          >
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-zinc-500">Deployment</h2>
            <p className="text-3xl font-light text-white">Integration Process</p>
          </motion.div>

          <div className="relative border-l border-white/10 ml-6 md:ml-12 space-y-20 pb-10">
            {[
              { step: "01", title: "User Requirement Mapping", desc: "Understanding daily usage patterns and specific control preferences." },
              { step: "02", title: "Hardware Selection", desc: "Choosing optimal screen dimensions, UI layouts, and in-wall mounting styles." },
              { step: "03", title: "System Integration", desc: "Routing automation, AV, and security feeds into a unified local interface." },
              { step: "04", title: "UI Customization", desc: "Designing intuitive graphic layouts and customized scene-based macros." },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: i * 0.1 }}
                className="relative pl-10 md:pl-16 group"
              >
                {/* Glowing Node */}
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-black border-2 border-amber-500 group-hover:bg-amber-500 transition-colors shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                
                <h3 className="text-sm font-mono text-amber-500 mb-2">{item.step}</h3>
                <h4 className="text-2xl font-semibold text-white mb-3">{item.title}</h4>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-md">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BOTTOM CTA --- */}
      <section className="relative z-10 py-32 px-6 text-center border-t border-white/5 bg-gradient-to-b from-transparent to-black/80">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-light">
            Centralize Your <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Space.</span>
          </h2>
          <p className="text-zinc-400 text-lg font-light leading-relaxed">
            Looking for a single, elegant interface to control your entire architectural environment?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white px-8 text-sm font-bold text-black shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all"
          >
            <Smartphone className="w-4 h-4 mr-2" />
            <span className="mr-1">Explore Interface Solutions</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity mix-blend-overlay"></div>
          </motion.button>
        </div>
      </section>

      {/* --- SPATIAL CONTACT MODAL --- */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl perspective-[1000px]"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, rotateX: 10 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.9, y: 30, rotateX: -10, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-[#0a0a0a]/90 border border-white/10 rounded-[2rem] p-8 shadow-[0_0_100px_rgba(0,0,0,0.8)] transform-gpu"
            >
              <button 
                onClick={() => !loading && setShowForm(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-amber-500/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-light text-white mb-2">Interface Consultation</h2>
                <p className="text-sm text-zinc-400">Secure link to our UX and integration team.</p>
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
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:bg-amber-500/5 transition-all"
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
                      Establishing Link...
                    </span>
                  ) : (
                    "Transmit Request"
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite] opacity-50" />
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}