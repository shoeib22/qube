"use client";
import { useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Briefcase, Users, Home, LayoutGrid, Sparkles } from "lucide-react";

const solutions = [
  {
    id: "professionals",
    icon: Briefcase,
    title: "Busy Professionals",
    desc: "Automate routines, hands-free control, and remote monitoring. Your home prepares itself before you even walk through the door.",
    color: "#3b82f6", // Blue
  },
  {
    id: "families",
    icon: Users,
    title: "Modern Families",
    desc: "Kid-safe controls, smart security, and energy savings for your home. Keep an eye on things from anywhere, effortlessly.",
    color: "#10b981", // Emerald
  },
  {
    id: "luxury",
    icon: Home,
    title: "Luxury Estates",
    desc: "High-end automation, custom ambiance, and seamless entertainment integrated perfectly into your interior design.",
    color: "#a855f7", // Purple
  },
  {
    id: "renters",
    icon: LayoutGrid,
    title: "Renters & Small Spaces",
    desc: "Voice control, fall detection, and assisted living tech. Wireless retrofit modules that require zero rewiring.",
    color: "#f97316", // Orange
  }
];

// --- 2D Glowing Blueprint Node ---
// Recreates the exact tactical crosshair & tag aesthetic from the screenshot
const BlueprintNode = ({ cx, cy, color, tag, isActive, delay = 0 }: { cx: number, cy: number, color: string, tag?: string, isActive: boolean, delay?: number }) => {
  if (!isActive) return null;

  return (
    <motion.g 
      initial={{ opacity: 0, scale: 0.8 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
    >
      {/* Background Radial Glow */}
      <circle cx={cx} cy={cy} r={50} fill={`url(#glowRadial)`} opacity={0.4} />
      
      {/* Strike-through Crosshair Line */}
      <motion.line 
        x1={cx - 25} y1={cy} x2={cx + 25} y2={cy} 
        stroke={color} strokeWidth={1.5} 
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: delay + 0.2, duration: 0.5 }}
      />
      
      {/* Outer Radar Ring */}
      <motion.circle 
        cx={cx} cy={cy} r={14} fill="none" stroke={color} strokeWidth={1.5}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: delay + 0.1, type: "spring" }}
      />
      
      {/* Inner Solid Core */}
      <circle cx={cx} cy={cy} r={4} fill={color} />

      {/* Floating Tactical Text Tag */}
      {tag && (
        <g>
          <motion.line 
            x1={cx + 10} y1={cy - 10} x2={cx + 30} y2={cy - 30} 
            stroke={color} strokeWidth={1} opacity={0.5}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: delay + 0.4 }}
          />
          <motion.rect 
            x={cx + 30} y={cy - 42} width={130} height={20} 
            fill="#050505" stroke={color} strokeWidth={1} opacity={0.8}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + 0.5 }}
          />
          <motion.text 
            x={cx + 38} y={cy - 28} fill={color} fontSize={8} className="font-mono uppercase tracking-widest font-semibold"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + 0.6 }}
          >
            {tag}
          </motion.text>
        </g>
      )}
    </motion.g>
  );
};

// --- Master Blueprint SVG Component ---
const FloorPlanVisualizer = ({ activeTab }: { activeTab: number }) => {
  const activeColor = solutions[activeTab].color;

  // Zone Activation Logic based on the selected tab
  const isZoneActive = (zones: number[]) => zones.includes(activeTab);

  return (
    <div className="w-full h-full flex items-center justify-center p-4 lg:p-8 relative">
      {/* Outer Screen Glare/Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] z-20" />

      <svg viewBox="0 0 800 500" className="w-full h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">
        <defs>
          {/* Dynamic Radial Glow that updates with the active color */}
          <radialGradient id="glowRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={activeColor} stopOpacity={0.4} />
            <stop offset="100%" stopColor={activeColor} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* --- CORNER BRACKETS --- */}
        <g stroke={activeColor} strokeWidth={2} fill="none" opacity={0.7} className="transition-all duration-700">
          <path d="M 20 40 L 20 20 L 40 20" />
          <path d="M 780 20 L 780 40 L 780 20 L 760 20" />
          <path d="M 20 460 L 20 480 L 40 480" />
          <path d="M 780 460 L 780 480 L 760 480" />
        </g>

        {/* --- ROOM: LIVING ROOM (Top Left) --- */}
        {/* Active for: Families (1), Luxury (2) */}
        <g opacity={isZoneActive([1, 2]) ? 1 : 0.15} className="transition-opacity duration-700 ease-in-out">
          {isZoneActive([1, 2]) && <rect x={40} y={40} width={360} height={220} fill="url(#glowRadial)" opacity={0.5} />}
          <rect x={40} y={40} width={360} height={220} fill="none" stroke={activeColor} strokeWidth={1} />
          <text x={60} y={65} fill={activeColor} fontSize={10} className="font-mono tracking-[0.2em]">LIVING ROOM</text>
          
          {/* Architectural Details */}
          <rect x={80} y={100} width={120} height={40} fill="none" stroke={activeColor} strokeWidth={0.5} />
          <circle cx={280} cy={160} r={30} fill="none" stroke={activeColor} strokeWidth={0.5} />
          
          <AnimatePresence>
            <BlueprintNode cx={200} cy={140} color={activeColor} tag="MESH OPTIMIZED" isActive={isZoneActive([1, 2])} delay={0.2} />
          </AnimatePresence>
        </g>

       {/* --- ROOM: MASTER SUITE (Top Right) --- */}
        {/* Active for: Professionals (0), Luxury (2) */}
        <g opacity={isZoneActive([0, 2]) ? 1 : 0.15} className="transition-opacity duration-700 ease-in-out">
          {isZoneActive([0, 2]) && <rect x={400} y={40} width={360} height={220} fill="url(#glowRadial)" opacity={0.5} />}
          <rect x={400} y={40} width={360} height={220} fill="none" stroke={activeColor} strokeWidth={1} />
          <text x={420} y={65} fill={activeColor} fontSize={10} className="font-mono tracking-[0.2em]">MASTER SUITE</text>
          
          {/* Architectural Details */}
          <rect x={580} y={80} width={140} height={120} fill="none" stroke={activeColor} strokeWidth={0.5} />
          {/* Fixed the typo on the line below */}
          <rect x={540} y={90} width={30} height={30} fill="none" stroke={activeColor} strokeWidth={0.5} />
          
          <AnimatePresence>
            {/* Implemented explicitly requested branding correction */}
            <BlueprintNode cx={550} cy={160} color={activeColor} tag="XEROVOLT CORE ACTIVE" isActive={isZoneActive([0, 2])} delay={0.4} />
          </AnimatePresence>
        </g>

        {/* --- ROOM: KITCHEN (Bottom Left) --- */}
        {/* Active for: Families (1), Luxury (2) */}
        <g opacity={isZoneActive([1, 2]) ? 1 : 0.15} className="transition-opacity duration-700 ease-in-out">
          {isZoneActive([1, 2]) && <rect x={40} y={260} width={300} height={200} fill="url(#glowRadial)" opacity={0.5} />}
          <rect x={40} y={260} width={300} height={200} fill="none" stroke={activeColor} strokeWidth={1} />
          <text x={60} y={285} fill={activeColor} fontSize={10} className="font-mono tracking-[0.2em]">KITCHEN</text>
          
          {/* Architectural Details */}
          <rect x={80} y={320} width={180} height={60} fill="none" stroke={activeColor} strokeWidth={0.5} />
          <line x1={80} y1={420} x2={260} y2={420} stroke={activeColor} strokeWidth={0.5} />
          
          <AnimatePresence>
            <BlueprintNode cx={160} cy={350} color={activeColor} tag="APPLIANCE SYNC" isActive={isZoneActive([1, 2])} delay={0.3} />
          </AnimatePresence>
        </g>

        {/* --- ROOM: OFFICE / STUDIO (Bottom Middle) --- */}
        {/* Active for: Professionals (0), Luxury (2), Renters (3) */}
        <g opacity={isZoneActive([0, 2, 3]) ? 1 : 0.15} className="transition-opacity duration-700 ease-in-out">
          {isZoneActive([0, 2, 3]) && <rect x={340} y={260} width={260} height={200} fill="url(#glowRadial)" opacity={0.5} />}
          <rect x={340} y={260} width={260} height={200} fill="none" stroke={activeColor} strokeWidth={1} />
          <text x={360} y={285} fill={activeColor} fontSize={10} className="font-mono tracking-[0.2em]">OFFICE</text>
          
          {/* Architectural Details */}
          <rect x={420} y={340} width={100} height={50} fill="none" stroke={activeColor} strokeWidth={0.5} />
          <circle cx={470} cy={420} r={15} fill="none" stroke={activeColor} strokeWidth={0.5} />
          
          <AnimatePresence>
            <BlueprintNode cx={470} cy={365} color={activeColor} tag="WIRELESS MESH OK" isActive={isZoneActive([0, 2, 3])} delay={0.5} />
          </AnimatePresence>
        </g>

        {/* --- ROOM: BATH (Bottom Right) --- */}
        {/* Active for: Luxury (2), Renters (3) */}
        <g opacity={isZoneActive([2, 3]) ? 1 : 0.15} className="transition-opacity duration-700 ease-in-out">
          {isZoneActive([2, 3]) && <rect x={600} y={260} width={160} height={200} fill="url(#glowRadial)" opacity={0.5} />}
          <rect x={600} y={260} width={160} height={200} fill="none" stroke={activeColor} strokeWidth={1} />
          <text x={620} y={285} fill={activeColor} fontSize={10} className="font-mono tracking-[0.2em]">BATH</text>
          
          {/* Architectural Details */}
          <rect x={640} y={300} width={80} height={120} rx={10} fill="none" stroke={activeColor} strokeWidth={0.5} />
          
          <AnimatePresence>
            <BlueprintNode cx={680} cy={360} color={activeColor} isActive={isZoneActive([2, 3])} delay={0.6} />
          </AnimatePresence>
        </g>

        {/* --- TELEMETRY WIDGET (Bottom Right) --- */}
        <g transform="translate(640, 440)" className="transition-all duration-700">
          <line x1={0} y1={25} x2={120} y2={25} stroke={activeColor} strokeWidth={1} opacity={0.3} />
          
          {/* Temp */}
          <text x={10} y={15} fill={activeColor} fontSize={18} className="font-mono font-bold">24°</text>
          <text x={12} y={35} fill={activeColor} fontSize={8} opacity={0.6} className="font-mono tracking-widest">TEMP</text>
          
          {/* Devices Active */}
          <text x={60} y={15} fill={activeColor} fontSize={18} className="font-mono font-bold">
            {activeTab === 2 ? '42' : activeTab === 0 ? '18' : activeTab === 1 ? '26' : '12'}
          </text>
          <text x={55} y={35} fill={activeColor} fontSize={8} opacity={0.6} className="font-mono tracking-widest">DEVICES</text>
        </g>
      </svg>
    </div>
  );
};

// --- Main Component ---
export default function SmartSolutions() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.25) setActiveTab(0);
    else if (latest < 0.5) setActiveTab(1);
    else if (latest < 0.75) setActiveTab(2);
    else setActiveTab(3);
  });

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-[#020202] w-full font-sans" id="solutions">
      
      <div className="sticky top-0 h-screen w-full flex flex-col-reverse lg:flex-row items-center justify-center overflow-hidden px-6 lg:px-20">
        
        {/* Dynamic Vignette / Glow */}
        <div 
          className="absolute inset-0 z-0 opacity-10 transition-colors duration-1000 blur-[200px]"
          style={{ backgroundColor: solutions[activeTab].color }}
        />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020202_100%)] pointer-events-none" />

        {/* Left Side: Typography */}
        <div className="w-full lg:w-1/2 relative z-10 flex flex-col justify-center h-full pb-20 lg:pb-0">
          <motion.div className="flex items-center gap-2 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Sparkles className="w-4 h-4 text-zinc-500" />
            <p className="text-zinc-500 tracking-widest uppercase text-xs font-bold">
              Next-Gen Ecosystem
            </p>
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-white leading-[1.1] mb-12">
            Designed around <br />
            <span 
              className="text-transparent bg-clip-text transition-colors duration-1000"
              style={{ backgroundImage: `linear-gradient(to right, #ffffff, ${solutions[activeTab].color})` }}
            >
              your reality.
            </span>
          </h2>

          <div className="relative h-48 w-full max-w-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                    style={{ color: solutions[activeTab].color }}
                  >
                    {(() => {
                      const Icon = solutions[activeTab].icon;
                      return <Icon className="w-6 h-6" strokeWidth={2} />;
                    })()}
                  </div>
                  <h3 className="text-2xl font-semibold text-zinc-100 tracking-tight">
                    {solutions[activeTab].title}
                  </h3>
                </div>
                
                <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                  {solutions[activeTab].desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Scroll Progress Lines */}
          <div className="absolute bottom-12 left-0 flex gap-3">
            {solutions.map((_, idx) => (
              <div 
                key={idx} 
                className="h-1 rounded-full overflow-hidden bg-white/10"
                style={{ width: activeTab === idx ? '48px' : '16px', transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                {activeTab === idx && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="h-full w-full"
                    style={{ backgroundColor: solutions[idx].color }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: The Master Blueprint Canvas */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-full relative z-10">
          <FloorPlanVisualizer activeTab={activeTab} />
        </div>

      </div>
    </section>
  );
}