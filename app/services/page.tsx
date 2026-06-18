"use client";

import React, { useEffect, useRef } from "react";
// 1. Import Next.js Link for instant page transitions
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useScroll,
  Variants,
  MotionValue // 2. Import MotionValue for strict typing
} from "framer-motion";
import {
  Music,
  Home,
  Shield,
  Tablet,
  ArrowRight,
  Wind,
  Laptop,
  LucideIcon // 3. Import the strict Lucide icon type
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// --- Constants & Pre-rendered Assets ---
const NOISE_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100%25' height='100%25'%3E%3Cfilter id='noiseFilter3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter3)'/%3E%3C/svg%3E")`;

interface ServiceData {
  icon: LucideIcon; // 4. Apply the strict type here
  title: string;
  description: string;
  color: string;
  glow: string;
  href: string;
}

const services: ServiceData[] = [
  {
    icon: Music,
    title: "Audio & Video",
    description: "Experience immersive entertainment with our state-of-the-art audio and video solutions. From custom home theaters to multi-room audio systems.",
    color: "text-purple-400",
    glow: "rgba(192, 132, 252, 0.4)",
    href: "/audio-video",
  },
  {
    icon: Home,
    title: "Home Automations",
    description: "Transform your living space with intelligent automation. Control lighting, climate, and appliances seamlessly from a single intuitive interface.",
    color: "text-blue-400",
    glow: "rgba(96, 165, 250, 0.4)",
    href: "/home-automation",
  },
  {
    icon: Shield,
    title: "Security Services",
    description: "Protect what matters most with advanced security systems. Our comprehensive surveillance and monitoring solutions ensure peace of mind 24/7.",
    color: "text-rose-400",
    glow: "rgba(251, 113, 133, 0.4)",
    href: "/security",
  },
  {
    icon: Tablet,
    title: "Smart Panels",
    description: "Centralize control with elegant smart panels. Access all your home's features with touch-screen precision and modern design aesthetics.",
    color: "text-amber-400",
    glow: "rgba(251, 191, 36, 0.4)",
    href: "/smart-panels",
  },
  {
    icon: Wind,
    title: "Energy Recovery",
    description: "High-efficiency ventilation that delivers fresh air while conserving energy and maintaining absolute indoor comfort.",
    color: "text-emerald-400",
    glow: "rgba(52, 211, 153, 0.4)",
    href: "/ERV",
  },
  {
    icon: Laptop,
    title: "Software Core",
    description: "Custom spatial software development focused on performance, reliability, and seamless integration with your environment.",
    color: "text-cyan-400",
    glow: "rgba(34, 211, 238, 0.4)",
    href: "/software-development",
  },
];

// --- 3D Interactive Service Card Component ---
const InteractiveCard = ({ service, index }: { service: ServiceData; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isHovered = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const smoothHover = useSpring(isHovered, { damping: 20, stiffness: 100 });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [18, -18]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-18, 18]);

  const glareX = useTransform(smoothX, [-0.5, 0.5], [100, -100]);
  const glareBackground = useMotionTemplate`linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.08) ${glareX}%, transparent 80%)`;
  const lightBackground = useMotionTemplate`radial-gradient(600px circle at ${useTransform(smoothX, [-0.5, 0.5], [0, 100])}% ${useTransform(smoothY, [-0.5, 0.5], [0, 100])}%, rgba(255,255,255,0.05), transparent 50%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    // Throttle calculations to frame rate
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      const { left, top, width, height } = cardRef.current!.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
      isHovered.set(1);
      rafId.current = null;
    });
  };

  const handleMouseLeave = () => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    mouseX.set(0);
    mouseY.set(0);
    isHovered.set(0);
  };

  // 5. Explicitly cast the component for the JSX parser
  const Icon = service.icon as LucideIcon;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50, rotateX: 20 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative h-full w-full perspective-[1500px] cursor-pointer group"
      style={{ willChange: "transform, opacity" }}
    >
      <motion.div
        className="relative h-full w-full rounded-[2.5rem] border border-white/[0.08] bg-black/40 backdrop-blur-2xl p-8 shadow-2xl overflow-hidden transform-gpu"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
          WebkitBackdropFilter: "blur(24px)", // Fallback optimization for Safari
        }}
      >
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-screen transform-gpu"
          style={{ background: lightBackground, opacity: smoothHover, willChange: "background, opacity" }}
        />

        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform-gpu"
          style={{ background: glareBackground, transform: "translateZ(1px)", willChange: "background, opacity" }}
        />

        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none blur-[60px] transform-gpu"
          style={{ 
            background: `radial-gradient(circle at 50% 50%, ${service.glow}, transparent 60%)`,
            transform: "translateZ(-50px)" 
          }}
        />

        <div 
          className="absolute -bottom-8 -right-8 opacity-0 group-hover:opacity-[0.03] transition-all duration-700 pointer-events-none transform-gpu"
          style={{ transform: "translateZ(-40px) scale(1.5)" }}
        >
          <Icon className="w-64 h-64 text-white" />
        </div>

        <motion.div 
          className="relative z-10 flex flex-col h-full transform-gpu"
          style={{ transform: "translateZ(60px)" }}
        >
          <div className="flex items-center justify-between mb-8">
            <motion.div 
              className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center bg-white/[0.03] border border-white/10 group-hover:bg-white/[0.08] transition-all duration-500 shadow-lg ${service.color} transform-gpu`}
              style={{ transform: "translateZ(30px)" }}
            >
              <Icon className="w-7 h-7" />
            </motion.div>
            
            <motion.div 
              className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center bg-black/20 text-white/20 group-hover:text-white group-hover:border-white/20 transition-all duration-500 transform-gpu"
              style={{ transform: "translateZ(20px)" }}
            >
              <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 group-hover:translate-x-0.5 transition-transform duration-500 transform-gpu" />
            </motion.div>
          </div>

          <motion.h3 
            className="text-2xl font-semibold tracking-tight text-white mb-4 transform-gpu"
            style={{ transform: "translateZ(40px)" }}
          >
            {service.title}
          </motion.h3>

          <motion.p 
            className="text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors flex-grow transform-gpu"
            style={{ transform: "translateZ(20px)" }}
          >
            {service.description}
          </motion.p>

          <motion.div 
            className="mt-8 pt-6 border-t border-white/[0.05] flex items-center transform-gpu"
            style={{ transform: "translateZ(30px)" }}
          >
            <span className="text-xs tracking-[0.2em] uppercase font-bold text-zinc-600 group-hover:text-white transition-colors">
              Access Module
            </span>
            <div className="h-[2px] bg-gradient-to-r from-white to-transparent ml-4 flex-grow origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out opacity-50 transform-gpu" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// --- Ambient 3D Background Component ---
const SpatialBackground = ({ 
  globalX, 
  globalY 
}: { 
  globalX: MotionValue<number>; 
  globalY: MotionValue<number>; 
}) => {
  const { scrollY } = useScroll();
  const scrollParallax1 = useTransform(scrollY, [0, 1000], [0, -150]);
  const scrollParallax2 = useTransform(scrollY, [0, 1000], [0, 200]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden perspective-[1000px]">
      <div className="absolute inset-0 bg-[#020203]" />
      
      <motion.div 
        className="absolute bottom-[-20%] left-[-20%] right-[-20%] h-[60%] border-t border-white/[0.02]"
        style={{
          rotateX: 70,
          backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
          y: scrollParallax1,
          willChange: "transform"
        }}
      />

      <motion.div
        className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] transform-gpu"
        style={{
          x: useTransform(globalX, [-0.5, 0.5], [-50, 50]),
          y: useTransform(globalY, [-0.5, 0.5], [-50, 50]),
          willChange: "transform"
        }}
      />
      <motion.div
        className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[150px] transform-gpu"
        style={{
          x: useTransform(globalX, [-0.5, 0.5], [80, -80]),
          y: scrollParallax2,
          willChange: "transform"
        }}
      />

      {/* Pre-rendered static noise background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: NOISE_PATTERN, backgroundRepeat: "repeat" }}
      />
    </div>
  );
};

// --- Main Page Layout ---
export default function PremiumServicesPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 100, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 100, mass: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle global mouse tracking to frame rate
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => {
        const nx = (e.clientX / window.innerWidth) - 0.5;
        const ny = (e.clientY / window.innerHeight) - 0.5;
        mouseX.set(nx);
        mouseY.set(ny);
        rafId.current = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [mouseX, mouseY]);

  const heroRotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const heroRotateY = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);
  const heroTranslateZ = useTransform(smoothY, [-0.5, 0.5], [20, 50]);

  const textReveal: Variants = {
    hidden: { opacity: 0, z: -100, rotateX: -20, filter: "blur(15px)" },
    visible: { 
      opacity: 1, 
      z: 0, 
      rotateX: 0,
      filter: "blur(0px)",
      transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <div 
      ref={pageRef}
      className="min-h-screen w-full text-white overflow-x-hidden selection:bg-zinc-800 selection:text-white relative font-sans"
    >
      <Header />
      <SpatialBackground globalX={smoothX} globalY={smoothY} />

      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none transform-gpu"
        style={{ 
          background: useMotionTemplate`radial-gradient(800px circle at ${useTransform(smoothX, [-0.5, 0.5], [0, 100])}% ${useTransform(smoothY, [-0.5, 0.5], [0, 100])}%, rgba(255,255,255,0.03), transparent 60%)`,
          willChange: "background"
        }}
      />

      {/* --- 3D HERO SECTION --- */}
      <section className="relative z-10 pt-48 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center perspective-[2000px]">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.15 } }
          }}
          className="max-w-4xl space-y-8 transform-gpu"
          style={{ 
            rotateX: heroRotateX, 
            rotateY: heroRotateY,
            z: heroTranslateZ,
            transformStyle: "preserve-3d",
            willChange: "transform"
          }}
        >
          <motion.h1 
            variants={textReveal} 
            className="text-6xl md:text-8xl font-light tracking-tighter leading-[1.05] transform-gpu"
            style={{ transform: "translateZ(120px)", willChange: "transform, opacity, filter" }}
          >
            Architectural <br/>
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-300 to-zinc-700">
              Intelligence.
            </span>
          </motion.h1>

          <motion.p 
            variants={textReveal} 
            className="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed transform-gpu"
            style={{ transform: "translateZ(60px)", willChange: "transform, opacity, filter" }}
          >
            Elevate your environment with technologies. Tailored integration for homes and enterprise systems.
          </motion.p>
        </motion.div>
      </section>

      {/* --- SERVICES GRID --- */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {services.map((service, i) => (
              <Link href={service.href} key={i} className="block no-underline h-[420px]">
                <InteractiveCard service={service} index={i} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}