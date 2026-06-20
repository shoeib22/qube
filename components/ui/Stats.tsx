"use client";
import { motion, Variants } from "framer-motion";

const stats = [
  {
    num: "01",
    value: "400+",
    title: "Homes Automated",
    description: "Seamlessly connected for modern, intelligent living.",
  },
  {
    num: "02",
    value: "100%",
    title: "Absolute Privacy",
    description: "Total local control ensuring your data stays strictly private.",
  },
  {
    num: "03",
    value: "30%",
    title: "Energy Reduced",
    description: "Average drop in utility costs via intelligent automation.",
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  show: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { 
      duration: 1, 
      ease: [0.16, 1, 0.3, 1] as const 
    } 
  }
};

export default function Stats() {
  return (
    <section className="relative py-32 lg:py-48 bg-[#030303] overflow-hidden">
      
      {/* 1. Responsive Glow: Scaled down width and blur strictly for mobile to prevent massive paint zones */}
      <div className="absolute top-1/2 left-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[400px] bg-white/[0.02] blur-[80px] md:blur-[150px] rounded-full pointer-events-none transform-gpu -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        
        {/* Cinematic Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ willChange: "transform, opacity" }} // 2. Removed `filter` to save mobile GPU memory
          className="mb-24"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500 font-semibold mb-6">
            Proven Impact
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter text-white leading-tight">
            Innovation that fits <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600 font-medium">
              every lifestyle.
            </span>
          </h2>
        </motion.div>

        {/* The Stats Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              style={{ willChange: "transform, opacity" }} // 3. Removed `filter` from willChange here as well
              className="relative group p-8 lg:p-12 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors duration-500 flex flex-col items-center justify-center overflow-hidden"
            >
              {/* Top-left corner accent */}
              <div className="absolute top-6 left-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-xs font-mono text-zinc-600 tracking-wider">
                  {stat.num}
                </span>
              </div>

              {/* Massive Value Text */}
              <h3 className="text-7xl md:text-8xl font-light tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30 mb-6">
                {stat.value}
              </h3>
              
              {/* Content Divider - Swapped width animation for scale-x to prevent layout thrashing */}
              <div className="w-12 h-px bg-white/20 mb-6 transition-transform duration-500 ease-out origin-center group-hover:scale-x-[2] group-hover:bg-white/40 transform-gpu" />

              {/* Title & Description */}
              <h4 className="text-xl text-white font-medium mb-3">
                {stat.title}
              </h4>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-[240px]">
                {stat.description}
              </p>
              
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}