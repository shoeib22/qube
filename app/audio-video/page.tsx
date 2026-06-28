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
  type MotionValue,
} from "framer-motion";
import {
  Music,
  Tv,
  Speaker,
  ArrowRight,
  X,
  Settings2,
  Volume2,
  Aperture,
  Crosshair,
  Waves,
  type LucideIcon,
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BackArrow from "../../components/backarrow";

const benefits = [
  {
    icon: Music,
    title: "High-Fidelity Audio",
    description: "Crystal-clear sound with deep bass and precision tuning for immersive listening across your entire spatial environment.",
    color: "text-purple-400",
    glow: "rgba(192, 132, 252, 0.4)",
  },
  {
    icon: Tv,
    title: "True Cinema Experience",
    description: "4K / 8K visuals with HDR and spatial surround sound that brings cinematic masterpieces to life in your living room.",
    color: "text-blue-400",
    glow: "rgba(96, 165, 250, 0.4)",
  },
  {
    icon: Speaker,
    title: "Multi-Room Sync",
    description: "Play synchronized audio across architectural zones or control each environmental zone entirely independently.",
    color: "text-cyan-400",
    glow: "rgba(34, 211, 238, 0.4)",
  },
  {
    icon: Settings2,
    title: "Seamless Control",
    description: "Command your entire audiovisual array seamlessly via our proprietary spatial app, remote, or localized voice assistants.",
    color: "text-amber-400",
    glow: "rgba(251, 191, 36, 0.4)",
  },
];

const steps = [
  { step: "01", title: "Acoustic Mapping", description: "We map your space using Lidar to analyze acoustic reflections and visual sightlines." },
  { step: "02", title: "System Architecture", description: "Designing a custom AV matrix optimized for spatial sound and pristine uncompressed visuals." },
  { step: "03", title: "Precision Install", description: "Invisible wiring, laser-aligned projector/screen calibration, and expert hardware placement." },
  { step: "04", title: "Spatial Integration", description: "Unified automation linking lighting, climate, and AV for one-touch atmospheric scenes." },
];

const SpatialAudioSphere = ({ mouseX, mouseY }: { mouseX: MotionValue<number>, mouseY: MotionValue<number> }) => {
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [25, -25]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-25, 25]);

  return (
    <motion.div 
      className="absolute top-[25%] left-[2%] lg:left-[8%] perspective-[1200px] hidden md:block z-20"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} 
        className="relative w-64 h-64 flex items-center justify-center transform-gpu"
      >
        {/* Core Pulsing Glow */}
        <div className="absolute w-20 h-20 bg-purple-500/40 blur-[30px] rounded-full animate-pulse" style={{ transform: "translateZ(-50px)" }} />
        
        {/* 3D Intersecting Gyroscope Rings */}
        <motion.div 
          animate={{ rotateX: 360, rotateY: 180, rotateZ: 360 }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="absolute w-full h-full border-[1px] border-purple-400/20 rounded-full" style={{ transform: "rotateX(0deg)" }} />
          <div className="absolute w-full h-full border-[1px] border-purple-400/40 rounded-full" style={{ transform: "rotateX(60deg)" }} />
          <div className="absolute w-full h-full border-[1px] border-purple-400/20 rounded-full" style={{ transform: "rotateX(120deg)" }} />
          
          {/* Orbiting Audio Nodes */}
          <div className="absolute w-2 h-2 bg-purple-300 rounded-full shadow-[0_0_15px_#c084fc]" style={{ transform: "rotateY(90deg) translateZ(128px)" }} />
          <div className="absolute w-2 h-2 bg-purple-300 rounded-full shadow-[0_0_15px_#c084fc]" style={{ transform: "rotateY(-90deg) translateZ(128px)" }} />
        </motion.div>

        {/* Floating Telemetry UI (Pushed out to user) */}
        <div 
          style={{ transform: "translateZ(100px)" }}
          className="absolute bottom-[-40px] w-56 p-5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Volume2 className="text-purple-400 h-4 w-4" />
              <span className="text-[10px] text-zinc-300 font-mono uppercase tracking-widest">Spatial Audio</span>
            </div>
            <span className="text-[10px] text-purple-400 font-mono">11.1.4</span>
          </div>
          
          {/* 3D Equalizer Bars */}
          <div className="flex items-end justify-between h-10 w-full gap-1">
            {[40, 70, 45, 90, 60, 85, 50, 100].map((height, i) => (
              <motion.div 
                key={i}
                className="w-full bg-gradient-to-t from-purple-600/50 to-purple-400 rounded-t-sm"
                animate={{ height: [`${height * 0.3}%`, `${height}%`, `${height * 0.5}%`] }}
                transition={{ duration: 0.8 + (i * 0.1), repeat: Infinity, repeatType: "reverse", ease: "circInOut" }}
                style={{ transform: `translateZ(${i * 2}px)` }} // Micro-3D staggering
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DisassembledScreenArray = ({ mouseX, mouseY }: { mouseX: MotionValue<number>, mouseY: MotionValue<number> }) => {
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [20, -20]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);

  return (
    <motion.div 
      className="absolute top-[30%] right-[2%] lg:right-[8%] perspective-[1500px] hidden md:block z-20"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} 
        className="relative w-72 h-80 flex items-center justify-center transform-gpu group"
      >
        {/* Layer 1: Backlight / Optical Core (Farthest back) */}
        <div 
          style={{ transform: "translateZ(-80px)" }} 
          className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-[2rem] transition-transform duration-700 group-hover:translate-z-[-120px]" 
        />
        <div 
          style={{ transform: "translateZ(-60px)" }} 
          className="absolute inset-4 bg-gradient-to-br from-blue-600/10 to-cyan-400/10 border border-blue-500/20 rounded-[2rem] backdrop-blur-sm transition-transform duration-700" 
        />

        {/* Layer 2: Matrix / Logic Board (Middle) */}
        <div 
          style={{ transform: "translateZ(0px)" }} 
          className="absolute inset-0 border border-white/5 bg-[#050505]/60 rounded-[2rem] p-6 backdrop-blur-md shadow-2xl flex flex-col justify-between"
        >
          <div className="w-full h-full border border-white/5 rounded-xl flex items-center justify-center relative overflow-hidden">
            {/* Grid Pattern */}
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <Crosshair className="text-white/10 w-16 h-16 animate-[spin_10s_linear_infinite]" />
            <motion.div 
              className="absolute left-0 top-0 h-full w-[2px] bg-blue-400 shadow-[0_0_15px_#60a5fa]" 
              animate={{ left: ['0%', '100%', '0%'] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>

        {/* Layer 3: Front Optical Glass & UI (Closest to user) */}
        <div 
          style={{ transform: "translateZ(80px)" }} 
          className="absolute -inset-4 border border-white/20 bg-white/[0.02] rounded-[2.5rem] p-6 backdrop-blur-[2px] pointer-events-none transition-transform duration-700 group-hover:translate-z-[120px]"
        >
          {/* Specular Highlight (Reflection) */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/10 to-transparent opacity-50 rounded-[2.5rem]" />
          
          <div className="absolute top-6 left-8 flex items-center gap-2">
            <Aperture className="text-blue-400 w-4 h-4 animate-pulse" />
            <span className="text-[9px] text-white font-mono uppercase tracking-widest">Optical Sync</span>
          </div>
          
          <div className="absolute bottom-8 right-8 text-right">
            <span className="text-2xl font-light text-white block">8K HDR</span>
            <span className="text-[9px] text-cyan-400 font-mono tracking-widest uppercase">120FPS Stream</span>
          </div>

          {/* Color Spectrum Bar */}
          <div className="absolute bottom-8 left-8 w-1/3 h-1 flex rounded-full overflow-hidden">
            <div className="h-full bg-red-500 flex-1" />
            <div className="h-full bg-green-500 flex-1" />
            <div className="h-full bg-blue-500 flex-1" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};


type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  glow: string;
  color: string;
};

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isHovered = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 100, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 100, mass: 0.5 });
  const smoothHover = useSpring(isHovered, { damping: 20, stiffness: 100 });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [18, -18]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-18, 18]);

  const glareX = useTransform(smoothX, [-0.5, 0.5], [100, -100]);
  const glareBackground = useMotionTemplate`linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.1) ${glareX}%, transparent 80%)`;
  const lightBackground = useMotionTemplate`radial-gradient(500px circle at ${useTransform(smoothX, [-0.5, 0.5], [0, 100])}% ${useTransform(smoothY, [-0.5, 0.5], [0, 100])}%, rgba(255,255,255,0.06), transparent 50%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width - 0.5);
    mouseY.set((e.clientY - top) / height - 0.5);
    isHovered.set(1);
  };

  const Icon = feature.icon;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); isHovered.set(0); }}
      initial={{ opacity: 0, y: 50, rotateX: 20 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative h-full w-full perspective-[1500px] cursor-pointer group"
    >
      <motion.div
        className="relative h-full w-full rounded-[2.5rem] border border-white/[0.08] bg-[#0a0a0a]/60 backdrop-blur-2xl p-8 shadow-2xl overflow-hidden transform-gpu"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <motion.div className="absolute inset-0 pointer-events-none mix-blend-screen" style={{ background: lightBackground, opacity: smoothHover }} />
        <motion.div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: glareBackground, transform: "translateZ(1px)" }} />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none blur-[60px]" style={{ background: `radial-gradient(circle at 50% 50%, ${feature.glow}, transparent 60%)`, transform: "translateZ(-50px)" }} />

        <motion.div className="relative z-10 flex flex-col h-full transform-gpu" style={{ transform: "translateZ(50px)" }}>
          <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center bg-white/[0.03] border border-white/10 mb-8 group-hover:scale-110 group-hover:bg-white/[0.08] transition-all duration-500 shadow-lg ${feature.color}`}>
            <Icon className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-semibold tracking-tight text-white mb-4">{feature.title}</h3>
          <p className="text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors flex-grow">
            {feature.description}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const SpatialBackground = ({ globalX, globalY }: { globalX: MotionValue<number>, globalY: MotionValue<number> }) => {
  const { scrollY } = useScroll();
  const scrollParallax1 = useTransform(scrollY, [0, 1000], [0, -200]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden perspective-[1200px]">
      <div className="absolute inset-0 bg-[#020202]" />
      
      {/* Immersive 3D Grid floor with steep angle */}
      <motion.div 
        className="absolute bottom-[-30%] left-[-30%] right-[-30%] h-[80%] border-t border-white/[0.02]"
        style={{
          rotateX: 80,
          backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "5rem 5rem",
          y: scrollParallax1,
          transformStyle: "preserve-3d"
        }}
      >
         {/* Low Frequency Bass Ripples mapping across the 3D floor */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          {[1, 2, 3, 4].map((ring) => (
            <motion.div
              key={ring}
              className="absolute rounded-full border border-purple-500/20"
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{ 
                width: ["0px", "2000px"], 
                height: ["0px", "2000px"], 
                opacity: [1, 0],
                borderWidth: ["8px", "1px"]
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity, 
                delay: ring * 2.5,
                ease: "easeOut" 
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Parallax Ambient Orbs — hidden on mobile */}
      <motion.div
        className="hidden sm:block absolute top-[10%] left-[10%] w-[800px] h-[800px] rounded-full bg-purple-600/5 blur-[150px]"
        style={{ x: useTransform(globalX, [-0.5, 0.5], [-120, 120]), y: useTransform(globalY, [-0.5, 0.5], [-120, 120]) }}
      />
      <motion.div
        className="hidden sm:block absolute bottom-[10%] right-[10%] w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[150px]"
        style={{ x: useTransform(globalX, [-0.5, 0.5], [100, -100]), y: useTransform(globalY, [-0.5, 0.5], [100, -100]) }}
      />
      
      {/* Noise Grain */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noiseAV"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" /></filter>
          <rect width="100%" height="100%" filter="url(#noiseAV)" />
        </svg>
      </div>
    </div>
  );
};

export default function AudioVideoPage() {
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
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const textReveal: Variants = {
    hidden: { opacity: 0, z: -100, rotateX: -20, filter: "blur(15px)" },
    visible: { opacity: 1, z: 0, rotateX: 0, filter: "blur(0px)", transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen w-full text-white overflow-x-hidden selection:bg-zinc-800 relative font-sans bg-[#020202]">
      <Header />
      <BackArrow />
      <SpatialBackground globalX={smoothX} globalY={smoothY} />

      {/* Global Ambient Cursor Flashlight */}
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: useMotionTemplate`radial-gradient(800px circle at ${useTransform(smoothX, [-0.5, 0.5], [0, 100])}% ${useTransform(smoothY, [-0.5, 0.5], [0, 100])}%, rgba(255,255,255,0.03), transparent 60%)` }}
      />

      {/* --- HERO --- */}
      <section className="relative z-10 pt-48 pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center perspective-[2000px] min-h-[800px]">
        
        {/* Inject Extreme 3D Visualizers */}
        <SpatialAudioSphere mouseX={smoothX} mouseY={smoothY} />
        <DisassembledScreenArray mouseX={smoothX} mouseY={smoothY} />

        <motion.div 
          initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="max-w-3xl space-y-8 transform-gpu relative z-30"
          style={{ 
            rotateX: useTransform(smoothY, [-0.5, 0.5], [8, -8]), 
            rotateY: useTransform(smoothX, [-0.5, 0.5], [-8, 8]),
            z: useTransform(smoothY, [-0.5, 0.5], [20, 60]),
            transformStyle: "preserve-3d" 
          }}
        >
          <motion.div variants={textReveal} className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.05)]" style={{ transform: "translateZ(100px)" }}>
            <Waves className="w-4 h-4 text-purple-400" />
            <span className="text-zinc-300 text-[11px] font-semibold tracking-[0.25em] uppercase">Acoustic & Visual Architecture</span>
          </motion.div>

          <motion.h1 variants={textReveal} className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-[1.05]" style={{ transform: "translateZ(140px)" }}>
            Immersive Sound. <br/>
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-300 to-zinc-700">Stunning Visuals.</span>
          </motion.h1>

          <motion.p variants={textReveal} className="text-lg md:text-xl text-zinc-400 max-w-xl mx-auto font-light leading-relaxed" style={{ transform: "translateZ(80px)" }}>
            From absolute-black theater optics to multi-room architectural acoustic arrays, we engineer spatial entertainment.
          </motion.p>
        </motion.div>
      </section>

      {/* --- HOW IT WORKS (PROCESS) --- */}
      <section className="relative z-10 py-24 border-y border-white/[0.05] bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-zinc-500">The Architecture</h2>
            <p className="text-3xl font-light text-white">Integration Methodology</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group relative bg-[#0a0a0a]/50 border border-white/5 rounded-3xl p-8 hover:bg-white/[0.02] transition-colors overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="text-4xl font-light text-zinc-800 mb-6 group-hover:text-purple-400/30 transition-colors">{item.step}</div>
                <h3 className="text-lg font-medium text-white mb-3">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BENEFITS --- */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-20 space-y-4"
          >
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-zinc-500">System Capabilities</h2>
            <p className="text-3xl font-light text-white">Engineering Advantages</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {benefits.map((b, i) => (
              <div key={i} className="h-[360px]">
                <FeatureCard feature={b} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BOTTOM CTA --- */}
      <section className="relative z-10 py-32 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-4xl font-light">
            Initialize Your <span className="font-bold">Entertainment Core.</span>
          </h2>
          <p className="text-zinc-400 text-lg font-light leading-relaxed">
            Engage our acoustic engineers to architect the perfect spatial audio and visual array for your environment.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white px-8 text-sm font-bold text-black shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all"
          >
            <span className="mr-3">Commence Consultation</span>
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
                <h2 className="text-2xl font-light text-white mb-2">System Inquiry</h2>
                <p className="text-sm text-zinc-400">Secure link to our engineering team.</p>
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
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 focus:bg-purple-500/5 transition-all"
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