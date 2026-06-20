"use client";
import React, { useEffect, useRef, memo } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
  Variants,
} from "framer-motion";
import { Shield, Zap, Thermometer, Fingerprint, ChevronRight } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const SPRING_CONFIG = { damping: 25, stiffness: 150, mass: 0.5 } as const;
const MAGNETIC_SPRING = { type: "spring", stiffness: 150, damping: 15, mass: 0.1 } as const;

// Base64 encoded version of your exact SVG noise to prevent live DOM rendering costs
const NOISE_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100%25' height='100%25'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

const textReveal: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerParent: Variants = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const rightPanelReveal = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.3 },
};

const scrollIndicatorReveal = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay: 2.5, duration: 1 },
};

const ENERGY_BARS = [40, 65, 45, 80, 55, 90, 75, 100] as const;

// ─── MagneticButton ───────────────────────────────────────────────────────────
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const MagneticButton = memo(function MagneticButton({
  children,
  className,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    x.set((clientX - (left + width / 2)) * 0.2);
    y.set((clientY - (top + height / 2)) * 0.2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x, y }}
      transition={MAGNETIC_SPRING}
      className={`relative ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
});

// ─── EnergyBar ────────────────────────────────────────────────────────────────
const EnergyBar = memo(function EnergyBar({
  height,
  index,
}: {
  height: number;
  index: number;
}) {
  return (
    <motion.div
      className="w-full bg-white/10 rounded-t-sm"
      initial={{ height: 0 }}
      animate={{ height: `${height}%` }}
      transition={{ duration: 1, delay: 1.5 + index * 0.1 }}
      style={{ willChange: "height" }}
    >
      <div
        className={`w-full h-full rounded-t-sm ${
          height > 70 ? "bg-amber-400/50" : "bg-white/20"
        }`}
      />
    </motion.div>
  );
});

// ─── GlassPanels ──────────────────────────────────────────────────────────────
const GlassPanels = memo(function GlassPanels() {
  return (
    <motion.div
      className="relative hidden lg:block h-[600px] w-full"
      style={{ transformStyle: "preserve-3d" }}
      {...rightPanelReveal}
    >
      {/* Core Orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse"
        style={{ z: -100, willChange: "transform, opacity" }}
      />

      {/* Security Panel */}
      <motion.div
        className="absolute top-[10%] right-[10%] w-64 p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl"
        style={{ z: 120, WebkitBackdropFilter: "blur(24px)" }}
      >
        <div className="flex justify-between items-center mb-6">
          <Shield className="text-emerald-400 h-6 w-6" />
          <span className="text-xs text-emerald-400 font-mono tracking-widest uppercase">
            Secured
          </span>
        </div>
        <div className="space-y-3">
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden transform-gpu">
            <motion.div
              className="h-full bg-emerald-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, delay: 1 }}
              style={{ willChange: "width" }}
            />
          </div>
          <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider">
            Perimeter Scanned
          </p>
        </div>
      </motion.div>

      {/* Climate Panel */}
      <motion.div
        className="absolute top-[45%] left-[0%] w-56 p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl"
        style={{ z: 60, WebkitBackdropFilter: "blur(24px)" }}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Thermometer className="text-blue-400 h-5 w-5" />
          </div>
          <span className="text-2xl font-light text-white">72°</span>
        </div>
        <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider mt-4">
          Climate Sync
        </p>
        <p className="text-[10px] text-zinc-500 mt-1">Adapting to occupancy</p>
      </motion.div>

      {/* Energy Panel */}
      <motion.div
        className="absolute bottom-[15%] right-[20%] w-72 p-6 rounded-3xl bg-black/40 border border-white/[0.08] backdrop-blur-2xl shadow-2xl"
        style={{ z: 180, WebkitBackdropFilter: "blur(40px)" }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Zap className="text-amber-400 h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm text-white font-medium">Grid Efficiency</h3>
            <p className="text-xs text-amber-400 font-mono mt-1">+24% Optimization</p>
          </div>
        </div>
        <div className="flex items-end gap-1.5 h-12 mt-4">
          {ENERGY_BARS.map((h, i) => (
            <EnergyBar key={i} height={h} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Wireframe Ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-[0.5px] border-white/5 border-dashed"
        style={{ z: -50, willChange: "transform" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
});

// ─── CursorFlare ──────────────────────────────────────────────────────────────
// Uses Transform (x,y) instead of repainting the gradient. This is GPU accelerated.
const CursorFlare = memo(function CursorFlare({
  smoothX,
  smoothY,
}: {
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none opacity-50 mix-blend-screen"
      style={{
        width: "1200px",
        height: "1200px",
        left: "50%",
        top: "50%",
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
        background: "radial-gradient(circle 600px, rgba(52, 211, 153, 0.08), transparent 80%)",
        willChange: "transform",
      }}
    />
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SpatialPremiumHero() {
  const containerRef = useRef<HTMLElement>(null);
  const rafId = useRef<number | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, SPRING_CONFIG);
  const smoothY = useSpring(mouseY, SPRING_CONFIG);

  const rotateX = useTransform(smoothY, [-500, 500], [8, -8]);
  const rotateY = useTransform(smoothX, [-500, 500], [-8, 8]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Throttle updates to frame rate
      if (rafId.current) return;
      
      rafId.current = requestAnimationFrame(() => {
        const { left, top, width, height } = el.getBoundingClientRect();
        mouseX.set(e.clientX - (left + width / 2));
        mouseY.set(e.clientY - (top + height / 2));
        rafId.current = null;
      });
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    el.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#020202] font-sans selection:bg-emerald-500/30 selection:text-white md:[perspective:1500px]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a24_0%,_#020202_70%)] z-0 pointer-events-none" />

      {/* Pre-rendered static noise background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none md:mix-blend-overlay"
        style={{ backgroundImage: NOISE_PATTERN, backgroundRepeat: "repeat" }}
      />

      <div className="hidden md:block">
        <CursorFlare smoothX={smoothX} smoothY={smoothY} />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        style={{ rotateX, rotateY, willChange: "transform" }}
      >
        <motion.div
          className="flex flex-col items-start text-left"
          initial="hidden"
          animate="visible"
          variants={staggerParent}
          style={{ z: 60 }}
        >
          <motion.div variants={textReveal} className="mb-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.02)] transform-gpu">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-zinc-300 text-xs font-semibold tracking-[0.2em] uppercase">
                System Online
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={textReveal}
            className="text-6xl sm:text-7xl md:text-8xl font-light tracking-tighter text-white leading-[1.05]"
          >
            Living, <br />
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-300 to-zinc-600">
              Synchronized.
            </span>
          </motion.h1>

          <motion.p
            variants={textReveal}
            className="mt-8 text-lg md:text-xl text-zinc-400 max-w-lg leading-relaxed font-light"
          >
            A spatial operating system for your environment. We merge architectural
            intelligence with seamless biometrics to predict your needs.
          </motion.p>

          <motion.div
            variants={textReveal}
            className="mt-12 flex flex-col sm:flex-row items-center gap-6"
          >
            <MagneticButton className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white px-8 text-sm font-semibold text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
              <span className="mr-2">Initialize Core</span>
              <Fingerprint className="h-4 w-4 transition-transform group-hover:rotate-12" />
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity mix-blend-overlay" />
            </MagneticButton>

            <MagneticButton className="group inline-flex h-14 items-center justify-center rounded-full px-8 text-sm font-medium text-zinc-300 transition-colors hover:text-white">
              View Architecture
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </MagneticButton>
          </motion.div>
        </motion.div>

        <GlassPanels />
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
        {...scrollIndicatorReveal}
      >
        <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-zinc-500">
          Scroll to enter
        </span>
        <div className="w-[1px] h-16 bg-zinc-800 relative overflow-hidden transform-gpu">
          <motion.div
            className="absolute top-0 left-0 w-full h-1/3 bg-emerald-500"
            animate={{ top: ["-100%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            style={{ willChange: "top" }}
          />
        </div>
      </motion.div>
    </section>
  );
}