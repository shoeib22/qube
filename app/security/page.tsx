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
  Shield,
  Camera,
  Bell,
  Lock,
  ArrowRight,
  X,
  Cpu,
  ArrowLeft,
  ScanLine,
  Crosshair,
  Fingerprint,
  Eye,
  Activity,
  AlertTriangle
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BackArrow from "../../components/backarrow";
// ------------------------------------------

// --- Custom 3D Visualizer 1: Active LiDAR Radar ---
const ActiveRadarSphere = ({ mouseX, mouseY }: { mouseX: any, mouseY: any }) => {
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [25, -25]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-25, 25]);

  return (
    <motion.div 
      className="absolute top-[20%] left-[2%] lg:left-[6%] perspective-[1200px] hidden lg:block z-20"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} 
        className="relative w-80 h-80 flex items-center justify-center transform-gpu"
      >
        {/* Ambient Threat Glow */}
        <div className="absolute w-32 h-32 bg-rose-600/20 blur-[40px] rounded-full animate-pulse" style={{ transform: "translateZ(-50px)" }} />
        
        {/* Radar Base Grid */}
        <div className="absolute w-64 h-64 border border-rose-500/20 rounded-full" style={{ transform: "translateZ(0px)" }}>
          <div className="absolute inset-0 rounded-full border border-rose-500/10 scale-[0.66]" />
          <div className="absolute inset-0 rounded-full border border-rose-500/10 scale-[0.33]" />
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-rose-500/20" />
          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-rose-500/20" />
        </div>

        {/* Sweeping Radar Beam */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute w-64 h-64 rounded-full"
          style={{ 
            background: "conic-gradient(from 0deg, transparent 70%, rgba(225, 29, 72, 0.4) 100%)",
            transform: "translateZ(10px)"
          }}
        >
           <div className="absolute top-0 left-1/2 w-[2px] h-1/2 bg-rose-500 shadow-[0_0_15px_#f43f5e]" />
        </motion.div>

        {/* 3D Orbiting Crosshairs */}
        <motion.div 
          animate={{ rotateX: 360, rotateY: 180 }} 
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="absolute w-[280px] h-[280px] border-[1px] border-rose-500/10 rounded-full border-dashed" style={{ transform: "rotateX(75deg)" }} />
          
          {/* Node: Drone tracking */}
          <div className="absolute flex items-center justify-center" style={{ transform: "rotateY(90deg) translateZ(140px) rotateY(-90deg)" }}>
             <Crosshair className="w-6 h-6 text-rose-400 drop-shadow-[0_0_10px_#f43f5e]" />
          </div>
        </motion.div>

        {/* Holographic Telemetry Screen */}
        <div 
          style={{ transform: "translateZ(100px)" }}
          className="absolute bottom-[-30px] right-[-20px] w-52 p-4 rounded-2xl bg-[#050505]/80 border border-rose-500/20 backdrop-blur-md shadow-[0_20px_40px_rgba(225,29,72,0.15)]"
        >
          <div className="flex justify-between items-center mb-3 border-b border-rose-500/20 pb-2">
            <span className="text-[10px] text-rose-400 font-mono uppercase tracking-widest flex items-center gap-1">
              <Activity className="w-3 h-3" /> LiDAR Sweep
            </span>
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Radius</span>
              <span className="text-white font-mono">1.2km</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Targets</span>
              <span className="text-rose-400 font-mono">0 Detected</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Custom 3D Visualizer 2: Biometric Vault Panel ---
const BiometricVaultPanel = ({ mouseX, mouseY }: { mouseX: any, mouseY: any }) => {
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  return (
    <motion.div 
      className="absolute top-[25%] right-[2%] lg:right-[6%] perspective-[1500px] hidden lg:block z-20"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} 
        className="relative w-72 h-[340px] bg-[#020202]/60 border border-white/10 rounded-3xl backdrop-blur-2xl p-6 shadow-2xl flex flex-col justify-between group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none" />

        {/* Top Header */}
        <div style={{ transform: "translateZ(30px)" }} className="flex justify-between items-start">
           <div className="flex items-center gap-2">
             <Shield className="w-5 h-5 text-emerald-400" />
             <span className="text-xs font-bold tracking-widest text-white uppercase">Vault Access</span>
           </div>
           <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-full uppercase tracking-wider">Secured</span>
        </div>

        {/* Center 3D Biometric Scanner */}
        <div style={{ transform: "translateZ(70px)" }} className="relative w-full flex-grow flex items-center justify-center my-4">
           {/* Outer Spinners */}
           <div className="absolute w-32 h-32 border-[2px] border-emerald-500/20 rounded-full border-t-emerald-400 animate-[spin_4s_linear_infinite]" />
           <div className="absolute w-28 h-28 border-[1px] border-emerald-500/10 rounded-full border-b-emerald-300 animate-[spin_3s_linear_infinite_reverse]" />
           
           {/* Inner Core */}
           <div className="relative w-20 h-20 bg-emerald-950/50 rounded-full border border-emerald-500/30 flex items-center justify-center overflow-hidden">
             <Eye className="w-8 h-8 text-emerald-400 z-10" />
             <motion.div 
               animate={{ top: ["-10%", "110%", "-10%"] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               className="absolute left-0 right-0 h-[20px] bg-emerald-400/30 blur-md z-20"
             />
             <motion.div 
               animate={{ top: ["-10%", "110%", "-10%"] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               className="absolute left-0 right-0 h-[1px] bg-emerald-300 z-20 shadow-[0_0_8px_#34d399]"
             />
           </div>
        </div>

        {/* Bottom Telemetry */}
        <div style={{ transform: "translateZ(40px)" }} className="border-t border-white/10 pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Identity</span>
            <span className="text-xs text-emerald-400 font-mono">Verified</span>
          </div>
          <div className="w-full bg-black/50 rounded-full h-1 overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="h-full bg-emerald-400"
            />
          </div>
        </div>

        {/* Floating Glass Specular */}
        <div 
          style={{ transform: "translateZ(100px)" }}
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
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

const SpatialBentoCard = ({ children, className = "", glowColor = "rgba(244, 63, 94, 0.15)", index }: BentoCardProps) => {
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

// --- Bento Block Content ---
const BentoSurveillance = () => (
  <>
    <div className="flex justify-between items-start mb-6" style={{ transform: "translateZ(20px)" }}>
      <div>
        <h3 className="text-xl font-semibold text-white">24/7 Surveillance</h3>
        <p className="text-zinc-400 text-sm mt-1">High-definition thermal & optical matrices.</p>
      </div>
      <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
        <Camera className="w-5 h-5" />
      </div>
    </div>
    
    <div className="flex-grow flex items-center justify-center mt-4" style={{ transformStyle: "preserve-3d" }}>
      <div className="relative w-full h-32 rounded-xl bg-black/50 border border-white/5 overflow-hidden flex items-center justify-center group-hover:border-rose-500/30 transition-colors" style={{ transform: "translateZ(40px)" }}>
        {/* Simulated Camera Feed */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "100% 4px" }} />
        <div className="absolute top-2 left-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[8px] font-mono text-rose-400 tracking-widest uppercase">REC • CAM_04</span>
        </div>
        <ScanLine className="w-12 h-12 text-rose-500/50 absolute animate-[pulse_2s_ease-in-out_infinite]" />
      </div>
    </div>
  </>
);

const BentoAlerts = () => (
  <div className="flex flex-col h-full" style={{ transformStyle: "preserve-3d" }}>
    <div className="flex justify-between items-start" style={{ transform: "translateZ(20px)" }}>
      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
        <Bell className="w-4 h-4" />
      </div>
    </div>
    <div className="flex-grow flex flex-col justify-end mt-8" style={{ transform: "translateZ(40px)" }}>
      <h3 className="text-lg font-semibold text-white mb-1">Instant Alerts</h3>
      <p className="text-zinc-400 text-xs mb-4">Zero-latency threat detection notifications.</p>
      <div className="w-full bg-amber-500/5 border border-amber-500/10 rounded-lg p-3 flex items-center gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <span className="text-[10px] font-mono text-amber-400 tracking-widest">Motion Detected : Zone A</span>
      </div>
    </div>
  </div>
);

const BentoAccess = () => (
  <div className="flex flex-col h-full relative" style={{ transformStyle: "preserve-3d" }}>
    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[40px] rounded-full pointer-events-none" style={{ transform: "translateZ(-20px)" }} />
    <div className="flex-grow flex flex-col items-center justify-center" style={{ transform: "translateZ(40px)" }}>
       <Lock className="w-12 h-12 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] mb-4" />
       <div className="flex gap-2">
         {[1, 2, 3, 4].map((i) => (
           <div key={i} className="w-2 h-2 rounded-full bg-blue-500/50" />
         ))}
       </div>
    </div>
    <div className="mt-6" style={{ transform: "translateZ(20px)" }}>
      <h3 className="text-lg font-semibold text-white mb-1">Access Control</h3>
      <p className="text-zinc-400 text-xs">Smart locks and secure entry protocols.</p>
    </div>
  </div>
);

const BentoProtection = () => (
  <>
    <div className="flex justify-between items-start mb-6" style={{ transform: "translateZ(20px)" }}>
      <div>
        <h3 className="text-xl font-semibold text-white">Reliable Protection</h3>
        <p className="text-zinc-400 text-sm mt-1">Military-grade integrated safeguards.</p>
      </div>
      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
        <Shield className="w-5 h-5" />
      </div>
    </div>
    <div className="flex-grow flex items-end h-32 w-full mt-4 gap-1" style={{ transformStyle: "preserve-3d" }}>
      {[100, 100, 100, 100, 100, 100].map((height, i) => (
        <div key={i} className="w-full bg-emerald-500/10 rounded-t-sm relative transform-gpu overflow-hidden" style={{ height: '100%', transformStyle: 'preserve-3d' }}>
           <motion.div 
             animate={{ y: ["100%", "0%", "100%"] }}
             transition={{ duration: 3, delay: i * 0.2, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 bg-gradient-to-t from-transparent via-emerald-400/50 to-transparent"
             style={{ transform: "translateZ(10px)" }}
           />
        </div>
      ))}
    </div>
  </>
);

// --- Spatial Background Environment ---
const SpatialBackground = ({ globalX, globalY }: { globalX: any, globalY: any }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden perspective-[1200px]">
      <div className="absolute inset-0 bg-[#020202]" />
      
      {/* 3D Radar Floor */}
      <motion.div 
        className="absolute bottom-[-50%] left-[-50%] right-[-50%] h-[120%] border-t border-rose-500/[0.03]"
        style={{
          rotateX: 75,
          backgroundImage: "linear-gradient(to right, rgba(225,29,72,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(225,29,72,0.03) 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
          transformStyle: "preserve-3d"
        }}
      >
        {/* Massive background radar sweep */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 w-[200vw] h-[200vw] -ml-[100vw] -mt-[100vw] rounded-full"
          style={{ background: "conic-gradient(from 0deg, transparent 80%, rgba(225, 29, 72, 0.05) 100%)" }}
        />
      </motion.div>

      {/* Floating Orbs mapping to mouse */}
      <motion.div
        className="absolute top-[20%] left-[20%] w-[600px] h-[600px] rounded-full bg-rose-600/5 blur-[120px]"
        style={{ x: useTransform(globalX, [-0.5, 0.5], [-80, 80]), y: useTransform(globalY, [-0.5, 0.5], [-80, 80]) }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-orange-600/5 blur-[120px]"
        style={{ x: useTransform(globalX, [-0.5, 0.5], [60, -60]), y: useTransform(globalY, [-0.5, 0.5], [60, -60]) }}
      />
      
      {/* Noise Grain */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noiseSEC"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" /></filter>
          <rect width="100%" height="100%" filter="url(#noiseSEC)" />
        </svg>
      </div>
    </div>
  );
};

export default function SecurityServicesPage() {
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
    <div className="min-h-screen w-full text-white overflow-x-hidden selection:bg-rose-500/30 relative font-sans bg-[#020202]">
      <Header />
      <BackArrow />
      <SpatialBackground globalX={smoothX} globalY={smoothY} />

      {/* Global Ambient Cursor Light */}
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: useMotionTemplate`radial-gradient(800px circle at ${useTransform(smoothX, [-0.5, 0.5], [0, 100])}% ${useTransform(smoothY, [-0.5, 0.5], [0, 100])}%, rgba(225,29,72,0.03), transparent 60%)` }}
      />

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-48 pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center perspective-[2000px] min-h-[800px]">
        
        {/* 3D Visualizers */}
        <ActiveRadarSphere mouseX={smoothX} mouseY={smoothY} />
        <BiometricVaultPanel mouseX={smoothX} mouseY={smoothY} />

        <motion.div 
          initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="max-w-3xl space-y-8 transform-gpu relative z-30 mt-10 lg:mt-0"
          style={{ 
            rotateX: useTransform(smoothY, [-0.5, 0.5], [8, -8]), 
            rotateY: useTransform(smoothX, [-0.5, 0.5], [-8, 8]),
            z: useTransform(smoothY, [-0.5, 0.5], [20, 60]),
            transformStyle: "preserve-3d" 
          }}
        >
         <motion.h1 variants={textReveal} className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-[1.05]" style={{ transform: "translateZ(140px)" }}>
            Protection That <br/>
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-300 to-zinc-700">Never Sleeps.</span>
          </motion.h1>

          <motion.p variants={textReveal} className="text-lg md:text-xl text-zinc-400 max-w-xl mx-auto font-light leading-relaxed" style={{ transform: "translateZ(80px)" }}>
            Protect what matters most with military-grade surveillance, biometric access, and intelligent threat-detection systems.
          </motion.p>
        </motion.div>
      </section>

      {/* --- 3D BENTO GRID SECTION --- */}
      <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-zinc-500">Defense Systems</h2>
          <p className="text-3xl font-light text-white">Tactical Advantages</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          {/* Surveillance (Large span) */}
          <SpatialBentoCard index={1} glowColor="rgba(244, 63, 94, 0.15)" className="md:col-span-2 row-span-1">
            <BentoSurveillance />
          </SpatialBentoCard>

          {/* Alerts */}
          <SpatialBentoCard index={2} glowColor="rgba(245, 158, 11, 0.15)" className="md:col-span-1 row-span-1">
             <BentoAlerts />
          </SpatialBentoCard>

          {/* Access Control */}
          <SpatialBentoCard index={3} glowColor="rgba(59, 130, 246, 0.15)" className="md:col-span-1 row-span-1">
             <BentoAccess />
          </SpatialBentoCard>

          {/* Protection (Large span) */}
          <SpatialBentoCard index={4} glowColor="rgba(16, 185, 129, 0.15)" className="md:col-span-2 row-span-1">
            <BentoProtection />
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
            <p className="text-3xl font-light text-white">Tactical Integration Process</p>
          </motion.div>

          <div className="relative border-l border-white/10 ml-6 md:ml-12 space-y-20 pb-10">
            {[
              { step: "01", title: "Risk Assessment", desc: "Identifying structural vulnerabilities and establishing secure perimeter requirements." },
              { step: "02", title: "System Architecture", desc: "Engineering a scalable, multi-layered defense network tailored to your specific environment." },
              { step: "03", title: "Hardware Installation", desc: "Military-grade deployment of optics, biometric nodes, and encrypted local servers." },
              { step: "04", title: "Active Monitoring", desc: "System goes live. Continuous telemetry monitoring and automated threat-response enabled." },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: i * 0.1 }}
                className="relative pl-10 md:pl-16 group"
              >
                {/* Glowing Node */}
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-black border-2 border-rose-500 group-hover:bg-rose-500 transition-colors shadow-[0_0_15px_rgba(225,29,72,0.5)]" />
                
                <h3 className="text-sm font-mono text-rose-500 mb-2">{item.step}</h3>
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
            Secure Your <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600">Perimeter.</span>
          </h2>
          <p className="text-zinc-400 text-lg font-light leading-relaxed">
            Looking for a reliable, military-grade security solution tailored precisely to your architecture?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white px-8 text-sm font-bold text-black shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all"
          >
            <Shield className="w-4 h-4 mr-2" />
            <span className="mr-1">Request Assessment</span>
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
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-rose-500/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-light text-white mb-2">Security Assessment</h2>
                <p className="text-sm text-zinc-400">Establish a secure link with our defense architects.</p>
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
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500/50 focus:bg-rose-500/5 transition-all"
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
                      Establishing Secure Link...
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