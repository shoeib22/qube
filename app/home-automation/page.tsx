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
  Home,
  Lightbulb,
  Thermometer,
  ShieldCheck,
  ArrowRight,
  X,
  Cpu,
  ArrowLeft,
  Wifi,
  Activity,
  Layers,
  Lock,
  Fingerprint,
  Zap,
  Video,
  ChevronRight,
  Power
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BackArrow from "../../components/backarrow";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  index: number;
}

const SpatialBentoCard = ({ children, className = "", glowColor = "rgba(16, 185, 129, 0.15)", index }: BentoCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isHovered = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 100, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 100, mass: 0.5 });
  const smoothHover = useSpring(isHovered, { damping: 20, stiffness: 100 });

  // 3D Parallax Tilt
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

  // Dynamic Specular Highlight (Glass Reflection)
  const glareX = useTransform(smoothX, [-0.5, 0.5], [100, -100]);
  const glareBackground = useMotionTemplate`linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.06) ${glareX}%, transparent 80%)`;
  
  // Ambient Internal Light
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
        className="relative h-full w-full rounded-[2rem] border border-white/[0.08] bg-[#0a0a0c]/80 backdrop-blur-3xl overflow-hidden transform-gpu"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        {/* Hover Highlights */}
        <motion.div className="absolute inset-0 pointer-events-none mix-blend-screen z-10" style={{ background: lightBackground, opacity: smoothHover }} />
        <motion.div className="absolute inset-0 pointer-events-none mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: glareBackground, transform: "translateZ(1px)" }} />
        
        {/* Core Glow */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-[60px] z-0"
          style={{ background: `radial-gradient(circle at 50% 50%, ${glowColor}, transparent 70%)`, transform: "translateZ(-50px)" }} 
        />

        {/* Content Container (Pushed forward slightly) */}
        <div className="relative h-full w-full z-20 p-8 flex flex-col transform-gpu" style={{ transformStyle: "preserve-3d" }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

const BentoClimate = () => (
  <>
    <div className="flex justify-between items-start mb-6" style={{ transform: "translateZ(20px)" }}>
      <div>
        <h3 className="text-xl font-semibold text-white">Atmospheric Control</h3>
        <p className="text-zinc-400 text-sm mt-1">Predictive thermal modeling.</p>
      </div>
      <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
        <Thermometer className="w-5 h-5" />
      </div>
    </div>
    
    <div className="flex-grow flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      {/* 3D Holographic Dial embedded in card */}
      <div className="relative w-48 h-48 flex items-center justify-center transform-gpu group-hover:scale-105 transition-transform duration-700" style={{ transform: "translateZ(60px)" }}>
        <div className="absolute inset-0 rounded-full border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-sm shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]" />
        <svg className="absolute w-44 h-44 -rotate-90 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
           <circle cx="88" cy="88" r="84" stroke="url(#blue-grad)" strokeWidth="4" fill="none" strokeDasharray="527" strokeDashoffset="150" strokeLinecap="round" />
           <defs>
             <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient>
           </defs>
        </svg>
        <div className="text-center" style={{ transform: "translateZ(20px)" }}>
          <span className="text-5xl font-light text-white tracking-tighter">72<span className="text-2xl text-zinc-500">°</span></span>
          <span className="block text-[9px] text-blue-400 font-mono tracking-[0.2em] uppercase mt-1">Cooling</span>
        </div>
      </div>
    </div>
  </>
);

const BentoSecurity = () => (
  <>
    <div className="flex justify-between items-start mb-4" style={{ transform: "translateZ(20px)" }}>
      <div>
        <h3 className="text-xl font-semibold text-white">Biometric Vault</h3>
        <p className="text-zinc-400 text-sm mt-1">Military-grade perimeter defense.</p>
      </div>
      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
        <ShieldCheck className="w-5 h-5" />
      </div>
    </div>

    <div className="flex-grow flex flex-col items-center justify-center mt-4" style={{ transformStyle: "preserve-3d" }}>
      <div className="relative w-24 h-24 flex items-center justify-center" style={{ transform: "translateZ(50px)" }}>
         <motion.div animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
         <div className="absolute inset-0 border border-emerald-500/30 rounded-full animate-[spin_8s_linear_infinite]" />
         <Fingerprint className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
         <motion.div animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} className="absolute left-0 right-0 h-[1px] bg-emerald-300 shadow-[0_0_8px_#6ee7b7] z-10" />
      </div>
      <div className="w-full mt-6 bg-black/50 rounded-full h-1 overflow-hidden border border-white/5" style={{ transform: "translateZ(30px)" }}>
        <motion.div className="h-full bg-emerald-400" animate={{ width: ["0%", "100%"] }} transition={{ duration: 3, repeat: Infinity }} />
      </div>
    </div>
  </>
);

const BentoEnergy = () => (
  <>
    <div className="flex justify-between items-start mb-6" style={{ transform: "translateZ(20px)" }}>
      <div>
        <h3 className="text-xl font-semibold text-white">Grid Telemetry</h3>
        <p className="text-zinc-400 text-sm mt-1">Real-time solar & battery sync.</p>
      </div>
      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
        <Zap className="w-5 h-5" />
      </div>
    </div>

    <div className="flex-grow flex items-end gap-2 h-32 w-full mt-4" style={{ transformStyle: "preserve-3d" }}>
      {[30, 50, 40, 80, 60, 95, 70, 100].map((height, i) => (
        <div key={i} className="w-full bg-white/5 rounded-t-sm relative transform-gpu group-hover:bg-white/10 transition-colors" style={{ height: '100%', transformStyle: 'preserve-3d' }}>
           <motion.div 
             initial={{ height: 0 }}
             whileInView={{ height: `${height}%` }}
             transition={{ duration: 1.5, delay: 0.2 + (i * 0.1), type: "spring" }}
             className="absolute bottom-0 w-full bg-gradient-to-t from-amber-500/80 to-amber-300 rounded-t-sm"
             style={{ transform: "translateZ(40px)" }}
           />
        </div>
      ))}
    </div>
  </>
);

const BentoNetwork = () => (
  <div className="flex flex-col h-full" style={{ transformStyle: "preserve-3d" }}>
    <div className="flex justify-between items-start" style={{ transform: "translateZ(20px)" }}>
      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
        <Activity className="w-4 h-4" />
      </div>
      <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase bg-purple-500/10 px-2 py-1 rounded-full">Active</span>
    </div>
    
    <div className="flex-grow flex flex-col justify-end mt-8" style={{ transform: "translateZ(40px)" }}>
      <h3 className="text-lg font-semibold text-white mb-1">Neural Core</h3>
      <p className="text-zinc-400 text-xs mb-4">Zero-latency localized processing hub.</p>
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs border-t border-white/5 pt-2">
          <span className="text-zinc-500">Nodes</span>
          <span className="text-white font-mono">248</span>
        </div>
        <div className="flex justify-between items-center text-xs border-t border-white/5 pt-2">
          <span className="text-zinc-500">Latency</span>
          <span className="text-purple-400 font-mono">0.8ms</span>
        </div>
      </div>
    </div>
  </div>
);

const BentoLighting = () => (
  <div className="flex flex-col h-full relative" style={{ transformStyle: "preserve-3d" }}>
    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 blur-[40px] rounded-full pointer-events-none" style={{ transform: "translateZ(-20px)" }} />
    
    <div className="flex-grow flex flex-col items-center justify-center" style={{ transform: "translateZ(40px)" }}>
       <Lightbulb className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] mb-4" />
       <div className="flex gap-2">
         {['#fcd34d', '#34d399', '#60a5fa', '#c084fc'].map((color, i) => (
           <div key={i} className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: color }} />
         ))}
       </div>
    </div>

    <div className="mt-6" style={{ transform: "translateZ(20px)" }}>
      <h3 className="text-lg font-semibold text-white mb-1">Spatial Lighting</h3>
      <p className="text-zinc-400 text-xs">Circadian rhythm synchronization.</p>
    </div>
  </div>
);

const SpatialBackground = ({ globalX, globalY }: { globalX: any, globalY: any }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden perspective-[1200px]">
      <div className="absolute inset-0 bg-[#020202]" />
      
      {/* 3D Blueprint Floor */}
      <motion.div 
        className="absolute bottom-[-40%] left-[-50%] right-[-50%] h-[100%] border-t border-emerald-500/[0.03]"
        style={{
          rotateX: 75,
          backgroundImage: "linear-gradient(to right, rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.03) 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
          transformStyle: "preserve-3d"
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_60%)]" />
      </motion.div>

      {/* Floating Orbs mapping to mouse globally */}
      <motion.div
        className="absolute top-[20%] left-[20%] w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px]"
        style={{ x: useTransform(globalX, [-0.5, 0.5], [-80, 80]), y: useTransform(globalY, [-0.5, 0.5], [-80, 80]) }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px]"
        style={{ x: useTransform(globalX, [-0.5, 0.5], [60, -60]), y: useTransform(globalY, [-0.5, 0.5], [60, -60]) }}
      />
      
      {/* Noise Grain */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noiseHA"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" /></filter>
          <rect width="100%" height="100%" filter="url(#noiseHA)" />
        </svg>
      </div>
    </div>
  );
};

export default function HomeAutomationsPage() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", contact: "" });

  // Global Tracking
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
    <div className="min-h-screen w-full text-white overflow-x-hidden selection:bg-emerald-500/30 relative font-sans bg-[#020202]">
      <Header />
      <BackArrow />
      <SpatialBackground globalX={smoothX} globalY={smoothY} />

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-48 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center text-center perspective-[2000px]">
        <motion.div 
          initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="max-w-4xl space-y-8 transform-gpu"
          style={{ 
            rotateX: useTransform(smoothY, [-0.5, 0.5], [8, -8]), 
            rotateY: useTransform(smoothX, [-0.5, 0.5], [-8, 8]),
            z: useTransform(smoothY, [-0.5, 0.5], [20, 60]),
            transformStyle: "preserve-3d" 
          }}
        >
          <motion.h1 variants={textReveal} className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-[1.05]" style={{ transform: "translateZ(140px)" }}>
            Intelligence, <br/>
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-300 to-zinc-700">Architected.</span>
          </motion.h1>

          <motion.p variants={textReveal} className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed" style={{ transform: "translateZ(80px)" }}>
            Transform your physical environment into a responsive, living ecosystem. Predicts your needs, secures your perimeter, and optimizes energy.
          </motion.p>
        </motion.div>
      </section>

      {/* --- THE BENTO GRID (CORE REDESIGN) --- */}
      <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[240px]">
          {/* Climate (Large span) */}
          <SpatialBentoCard index={1} glowColor="rgba(59, 130, 246, 0.15)" className="md:col-span-2 lg:col-span-2 row-span-2">
            <BentoClimate />
          </SpatialBentoCard>

          {/* Security */}
          <SpatialBentoCard index={2} glowColor="rgba(16, 185, 129, 0.15)" className="md:col-span-1 lg:col-span-2 row-span-1">
             <BentoSecurity />
          </SpatialBentoCard>

          {/* Network */}
          <SpatialBentoCard index={3} glowColor="rgba(192, 132, 252, 0.15)" className="md:col-span-1 lg:col-span-1 row-span-1">
             <BentoNetwork />
          </SpatialBentoCard>

          {/* Lighting */}
          <SpatialBentoCard index={4} glowColor="rgba(250, 204, 21, 0.15)" className="md:col-span-1 lg:col-span-1 row-span-1">
             <BentoLighting />
          </SpatialBentoCard>

          {/* Energy (Large bottom span) */}
          <SpatialBentoCard index={5} glowColor="rgba(245, 158, 11, 0.15)" className="md:col-span-2 lg:col-span-2 row-span-1">
            <BentoEnergy />
          </SpatialBentoCard>
        </div>
      </section>

      {/* --- TIMELINE DEPLOYMENT PROCESS --- */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-24 space-y-4"
          >
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-zinc-500">The Blueprint</h2>
            <p className="text-3xl font-light text-white">Integration Timeline</p>
          </motion.div>

          <div className="relative border-l border-white/10 ml-6 md:ml-12 space-y-20 pb-10">
            {[
              { step: "01", title: "Spatial Analysis", desc: "LiDAR scanning and environmental mapping to understand your structural requirements." },
              { step: "02", title: "Logic Mapping", desc: "Designing an invisible localized logic network optimized for zero-latency communication." },
              { step: "03", title: "Hardware Deployment", desc: "Surgical installation of sensors, biometric nodes, and central processing matrices." },
              { step: "04", title: "Neural Synchronization", desc: "Final calibration of automated scenes, ensuring predictive and seamless living." },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: i * 0.1 }}
                className="relative pl-10 md:pl-16 group"
              >
                {/* Glowing Node */}
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-black border-2 border-emerald-500 group-hover:bg-emerald-500 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                
                <h3 className="text-sm font-mono text-emerald-400 mb-2">{item.step}</h3>
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
            Initialize <span className="font-bold">Core.</span>
          </h2>
          <p className="text-zinc-400 text-lg font-light leading-relaxed">
            Discover how intelligent automation can simplify and elevate your everyday living environment.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white px-8 text-sm font-bold text-black shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all"
          >
            <Power className="w-4 h-4 mr-2" />
            <span className="mr-1">Commence Link</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-light text-white mb-2">System Inquiry</h2>
                <p className="text-sm text-zinc-400">Secure link to our architectural integration team.</p>
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
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all"
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
                      Initializing...
                    </span>
                  ) : (
                    "Submit Request"
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