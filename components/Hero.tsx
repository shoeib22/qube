"use client";
import React, { useEffect, useRef, memo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
  Variants,
  AnimatePresence,
} from "framer-motion";
import { Shield, Zap, Thermometer, Fingerprint, ChevronRight, Loader2 } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const SPRING_CONFIG = { damping: 25, stiffness: 150, mass: 0.5 } as const;
const MAGNETIC_SPRING = { type: "spring", stiffness: 150, damping: 15, mass: 0.1 } as const;

// Base64 encoded version of your exact SVG noise
const NOISE_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100%25' height='100%25'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

// Optimized reveal: Uses scale and transform instead of blur for mobile GPU safety
const textReveal: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
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

const ENERGY_BARS = [40, 65, 45, 80, 55, 90, 75, 100] as const;

// ─── Initialization Overlay Component ──────────────────────────────────────────
const InitializingScreen = memo(function InitializingScreen({ router }: { router: ReturnType<typeof useRouter> }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 1800);
    const t3 = setTimeout(() => setStep(3), 2800);
    const t4 = setTimeout(() => {
      router.push('/shop');
    }, 3500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [router]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[999] bg-[#08090b] flex flex-col items-center justify-center font-mono selection:bg-brand-strong/30 overflow-hidden"
    >
      {/* CRT Scanline Overlay for Depth */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none z-50 opacity-30" />
      <div className="absolute inset-0 z-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: NOISE_PATTERN, backgroundRepeat: "repeat" }} />
      
      {/* Expanding Radar Pulse */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] border border-brand-strong/20 rounded-full pointer-events-none"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="mb-8 relative"
        >
          <Loader2 className="w-12 h-12 text-brand-strong opacity-80" strokeWidth={1} />
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-brand-strong/20 blur-xl rounded-full" />
        </motion.div>

        <div className="w-full space-y-3 text-xs tracking-widest text-zinc-500 uppercase min-h-[120px]">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            &gt; Boot Sequence Initiated...
          </motion.div>
          
          <AnimatePresence>
            {step >= 1 && (
              <motion.div key="step-1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                &gt; Establishing Secure Uplink... <span className="text-brand-strong">OK</span>
              </motion.div>
            )}
            {step >= 2 && (
              <motion.div key="step-2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                &gt; Decrypting Xerovolt Core... <span className="text-brand-strong">OK</span>
              </motion.div>
            )}
            {step >= 3 && (
              <motion.div key="step-3" initial={{ opacity: 0, x: -10, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} className="text-brand font-bold mt-4 border-t border-white/10 pt-4 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                &gt; ACCESS GRANTED. ROUTING...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full h-[1px] bg-white/10 mt-12 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-brand-strong shadow-[0_0_10px_rgba(52,211,153,0.8)]"
            initial={{ width: "0%" }}
            animate={{ width: step === 0 ? "10%" : step === 1 ? "45%" : step === 2 ? "85%" : "100%" }}
            transition={{ duration: 0.8, ease: "circOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
});

// ─── MagneticButton ───────────────────────────────────────────────────────────
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const MagneticButton = memo(function MagneticButton({ children, className, onClick }: MagneticButtonProps) {
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

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
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
const EnergyBar = memo(function EnergyBar({ height, index }: { height: number; index: number }) {
  return (
    <motion.div
      className="w-full bg-white/10 rounded-t-sm"
      initial={{ height: 0 }}
      animate={{ height: `${height}%` }}
      transition={{ duration: 1, delay: 1.5 + index * 0.1 }}
      style={{ willChange: "height" }}
    >
      <div className={`w-full h-full rounded-t-sm ${height > 70 ? "bg-amber-400/50" : "bg-white/20"}`} />
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
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-strong/10 rounded-full blur-[100px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ z: -100, willChange: "transform, opacity" }}
      />

      {/* Security Panel with Organic Float */}
      <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[10%] right-[10%] z-[120]">
        <div className="w-64 p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl" style={{ WebkitBackdropFilter: "blur(24px)" }}>
          <div className="flex justify-between items-center mb-6">
            <Shield className="text-brand h-6 w-6" />
            <span className="text-xs text-brand font-mono tracking-widest uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" /> Secured
            </span>
          </div>
          <div className="space-y-3">
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden transform-gpu">
              <motion.div className="h-full bg-brand rounded-full" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2, delay: 1 }} />
            </div>
            <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Perimeter Scanned</p>
          </div>
        </div>
      </motion.div>

      {/* Climate Panel with Organic Float */}
      <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[45%] left-[0%] z-[60]">
        <div className="w-56 p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl" style={{ WebkitBackdropFilter: "blur(24px)" }}>
          <div className="flex justify-between items-start mb-2">
            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Thermometer className="text-blue-400 h-5 w-5" />
            </div>
            <span className="text-2xl font-light text-white">72°</span>
          </div>
          <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider mt-4">Climate Sync</p>
          <p className="text-[10px] text-zinc-500 mt-1">Adapting to occupancy</p>
        </div>
      </motion.div>

      {/* Energy Panel with Organic Float */}
      <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute bottom-[15%] right-[20%] z-[180]">
        <div className="w-72 p-6 rounded-3xl bg-black/40 border border-white/[0.08] backdrop-blur-2xl shadow-2xl" style={{ WebkitBackdropFilter: "blur(40px)" }}>
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
            {ENERGY_BARS.map((h, i) => ( <EnergyBar key={i} height={h} index={i} /> ))}
          </div>
        </div>
      </motion.div>

      {/* Wireframe Ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-[0.5px] border-white/5 border-dashed"
        style={{ z: -50, willChange: "transform" }}
        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
        transition={{ rotate: { duration: 60, repeat: Infinity, ease: "linear" }, scale: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
      />
    </motion.div>
  );
});

// ─── CursorFlare ──────────────────────────────────────────────────────────────
const CursorFlare = memo(function CursorFlare({ smoothX, smoothY }: { smoothX: MotionValue<number>; smoothY: MotionValue<number>; }) {
  return (
    <motion.div
      className="absolute pointer-events-none opacity-50 mix-blend-screen"
      style={{
        width: "1200px", height: "1200px", left: "50%", top: "50%",
        x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%",
        background: "radial-gradient(circle 600px, rgba(52, 211, 153, 0.08), transparent 80%)",
        willChange: "transform",
      }}
    />
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SpatialPremiumHero() {
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(false);
  
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
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => {
        const { left, top, width, height } = el.getBoundingClientRect();
        mouseX.set(e.clientX - (left + width / 2));
        mouseY.set(e.clientY - (top + height / 2));
        rafId.current = null;
      });
    };

    const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

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
      className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#08090b] font-sans selection:bg-brand-strong/30 selection:text-white md:[perspective:1500px]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a24_0%,_#08090b_70%)] z-0 pointer-events-none" />

      {/* Mobile-Friendly Spatial Depth Rings */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] md:w-[80vw] aspect-square rounded-full border border-white/[0.02] border-dashed pointer-events-none z-0 lg:hidden"
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Pre-rendered static noise background */}
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none md:mix-blend-overlay" style={{ backgroundImage: NOISE_PATTERN, backgroundRepeat: "repeat" }} />

      <div className="hidden md:block">
        <CursorFlare smoothX={smoothX} smoothY={smoothY} />
      </div>

      <AnimatePresence>
        {isInitializing && <InitializingScreen router={router} />}
      </AnimatePresence>

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
          {/* Added Organic Float to System Online Badge */}
          <motion.div variants={textReveal} className="mb-8" animate={{ y: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.02)] transform-gpu">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-strong" />
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

          <motion.div variants={textReveal} className="mt-12 flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
            <MagneticButton 
              onClick={() => setIsInitializing(true)} 
              className="group relative inline-flex h-14 w-full sm:w-auto items-center justify-center overflow-hidden rounded-full bg-white px-8 text-sm font-semibold text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              <span className="mr-2">Initialize Core</span>
              <Fingerprint className="h-4 w-4 transition-transform group-hover:rotate-12" />
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity mix-blend-overlay" />
            </MagneticButton>

            <MagneticButton 
              onClick={() => router.push('/services')}
              className="group inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-full px-8 text-sm font-medium text-zinc-300 transition-colors hover:text-white border border-white/5 sm:border-transparent bg-white/5 sm:bg-transparent"
            >
              View Architecture
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </MagneticButton>
          </motion.div>
        </motion.div>

        <GlassPanels />
      </motion.div>

      {/* Added Organic Float to Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
        initial={{ opacity: 0 }} animate={{ opacity: 1, y: [-5, 5, -5] }}
        transition={{ opacity: { delay: 2.5, duration: 1 }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
      >
        <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-zinc-500">
          Scroll to enter
        </span>
        <div className="w-[1px] h-16 bg-zinc-800 relative overflow-hidden transform-gpu">
          <motion.div
            className="absolute top-0 left-0 w-full h-1/3 bg-brand-strong"
            animate={{ top: ["-100%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            style={{ willChange: "top" }}
          />
        </div>
      </motion.div>
    </section>
  );
}