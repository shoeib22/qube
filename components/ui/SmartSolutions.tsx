"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Users, Home, LayoutGrid, ArrowRight, VolumeX, Volume2 } from "lucide-react";

const solutions = [
  {
    id: "professionals",
    icon: Briefcase,
    title: "Busy Professionals",
    desc: "Automate routines, hands-free control, and remote monitoring. Your home prepares itself before you even walk through the door.",
    video: "https://firebasestorage.googleapis.com/v0/b/cube-8c773.firebasestorage.app/o/Professional_enters_automated_lu%E2%80%A6_202606161729.mp4?alt=media&token=c6e3c273-0c63-4280-88f2-2d45717a7e2b",
    color: "from-blue-500/20",
    iconBg: "bg-blue-500/20 text-blue-400"
  },
  {
    id: "families",
    icon: Users,
    title: "Modern Families",
    desc: "Kid-safe controls, smart security, and energy savings for your home. Keep an eye on things from anywhere, effortlessly.",
    video: "https://firebasestorage.googleapis.com/v0/b/cube-8c773.firebasestorage.app/o/Family_playing_in_living_room_202606161747%20(1).mp4?alt=media&token=c6093332-dc8b-45e0-8e22-b2914e4713fd",
    color: "from-emerald-500/20",
    iconBg: "bg-emerald-500/20 text-emerald-400"
  },
  {
    id: "luxury",
    icon: Home,
    title: "Luxury Estates",
    desc: "High-end automation, custom ambiance, and seamless entertainment integrated perfectly into your interior design.",
    img: "https://firebasestorage.googleapis.com/v0/b/cube-8c773.firebasestorage.app/o/%F0%9F%8F%A1%E2%9C%A8%20Transform%20Your%20Space_%20Innovative%20Home%20Decor%20Ideas%20%E2%9C%A8%F0%9F%8F%A1.webp?alt=media&token=88aa53e9-af74-4a90-b1f4-013815aeedb3",
    color: "from-purple-500/20",
    iconBg: "bg-purple-500/20 text-purple-400"
  },
  {
    id: "renters",
    icon: LayoutGrid,
    title: "Renters & Small Spaces",
    desc: "Voice control, fall detection, and assisted living tech. Wireless retrofit modules that require zero rewiring.",
    img: "https://firebasestorage.googleapis.com/v0/b/cube-8c773.firebasestorage.app/o/_%20(1).webp?alt=media&token=48123ca0-247c-47ed-b847-37f3050b7fd2",
    color: "from-orange-500/20",
    iconBg: "bg-orange-500/20 text-orange-400"
  }
];

// --- MediaLayer Component ---
// Extracted to manage play/pause state without re-rendering the whole page
const MediaLayer = ({ 
  item, 
  isActive, 
  isMuted 
}: { 
  item: typeof solutions[0]; 
  isActive: boolean; 
  isMuted: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    
    // Only play the video if it is currently visible to save CPU/Network
    if (isActive) {
      videoRef.current.play().catch(() => {
        // Catch auto-play policy errors cleanly
      });
    } else {
      videoRef.current.pause();
      // Optional: reset to beginning when hidden
      // videoRef.current.currentTime = 0; 
    }
  }, [isActive]);

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 1.05, // Slightly reduced scale jump for smoother visual
        filter: isActive ? "blur(0px)" : "blur(10px)",
        zIndex: isActive ? 10 : 0
      }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-[2rem]"
    >
      {item.video ? (
        <video
          ref={videoRef}
          src={item.video}
          loop
          muted={isMuted}
          playsInline
          preload="auto" // Forces browser to download file eagerly
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 pointer-events-auto"
        />
      ) : (
        <img
          src={item.img}
          alt={item.title}
          loading="eager" // Bypasses lazy loading
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 pointer-events-auto"
        />
      )}
    </motion.div>
  );
};

// --- Main Component ---
export default function SmartSolutions() {
  const [activeTab, setActiveTab] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % solutions.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeTab, isHovered]);

  return (
    <section 
      className="relative py-32 bg-[#050505] overflow-hidden" 
      id="solutions"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50 transition-opacity duration-1000">
        <div 
          className={`absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr ${solutions[activeTab].color} to-transparent rounded-full blur-[120px] transition-all duration-1000 ease-in-out`}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-20 max-w-2xl">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-zinc-500 tracking-widest uppercase text-sm font-medium mb-4"
          >
            Tailored Experiences
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-light tracking-tight text-white leading-tight"
          >
            Smart living, designed <br />
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
              around your lifestyle.
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left Side: Editorial Media Display */}
          <div className="lg:col-span-7 relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-[2rem] bg-zinc-900 border border-white/10 group shadow-2xl">
            
            {/* Render ALL media simultaneously for instant caching */}
            {solutions.map((item, idx) => (
              <MediaLayer 
                key={item.id} 
                item={item} 
                isActive={activeTab === idx} 
                isMuted={isMuted} 
              />
            ))}

            {/* Mute/Unmute Button Overlay */}
            {solutions[activeTab].video && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="absolute bottom-6 right-6 z-20 p-3 rounded-full bg-black/40 text-white/90 backdrop-blur-md border border-white/10 hover:bg-black/60 hover:text-white transition-all duration-300"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
            )}
            
            {/* Inner shadow overlay for premium feel */}
            <div className="absolute inset-0 z-30 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] rounded-[2rem] pointer-events-none" />
          </div>

          {/* Right Side: Interactive Accordion Menu */}
          <div className="lg:col-span-5 flex flex-col justify-center h-full gap-2">
            {solutions.map((item, idx) => {
              const isActive = activeTab === idx;
              return (
                <div 
                  key={item.id}
                  onClick={() => setActiveTab(idx)}
                  className="group cursor-pointer"
                >
                  <div className={`relative overflow-hidden transition-all duration-500 rounded-2xl ${
                    isActive ? "bg-white/5 border border-white/10 p-6 shadow-2xl backdrop-blur-sm" : "p-6 hover:bg-white/[0.02]"
                  }`}>
                    
                    <div className="flex items-center gap-6">
                      <div className={`p-4 rounded-xl transition-all duration-500 ${
                        isActive ? item.iconBg : "bg-zinc-900 text-zinc-500 group-hover:text-zinc-300"
                      }`}>
                        <item.icon className="w-6 h-6" strokeWidth={isActive ? 2 : 1.5} />
                      </div>
                      
                      <h3 className={`text-2xl transition-all duration-500 ${
                        isActive ? "font-semibold text-white" : "font-light text-zinc-400 group-hover:text-zinc-200"
                      }`}>
                        {item.title}
                      </h3>
                    </div>

                    {/* Expandable Content area */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pt-6 pl-[4.5rem]">
                            <p className="text-zinc-400 text-base leading-relaxed mb-6">
                              {item.desc}
                            </p>
                            <button className="flex items-center gap-2 text-sm font-medium text-white group/btn">
                              Explore solutions
                              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}