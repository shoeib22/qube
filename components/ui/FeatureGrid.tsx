"use client";
import { motion, Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const cards = [
  {
    title: "End-to-End Solutions",
    desc: "From basic setups to fully integrated, invisible home automation custom-fitted to your space.",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Absolute Local Control",
    desc: "Lightning-fast response times powered by local servers. Uncompromising privacy without cloud reliance.",
    img: "https://firebasestorage.googleapis.com/v0/b/cube-8c773.firebasestorage.app/o/Google%20Data%20Center%2C%20Lania%20NC.webp?alt=media&token=f023a25e-e365-4358-90ec-88f5dc1bebc5",
  },
  {
    title: "Built for Indian Homes",
    desc: "Engineered specifically to seamlessly handle local power standards, fluctuations, and structural aesthetics.",
    img: "https://firebasestorage.googleapis.com/v0/b/cube-8c773.firebasestorage.app/o/ChatGPT%20Image%20Jun%2015%2C%202026%2C%2005_19_12%20PM.png?alt=media&token=cac910f8-9d7c-43f2-8d8a-3b877ca914df",
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] as const 
    } 
  }
};

export default function FeatureGrid() {
  return (
    <section className="py-32 bg-[#030303] relative overflow-hidden">
      {/* Ambient glow — hidden on mobile */}
      <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-white/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Editorial Section Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ willChange: "transform, opacity" }}
              className="text-sm uppercase tracking-[0.2em] text-zinc-500 font-semibold mb-4"
            >
              Why Xerovolt
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              style={{ willChange: "transform, opacity" }}
              className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight"
            >
              Engineering the standard <br className="hidden md:block" />
              <span className="text-zinc-500 font-medium">for modern living.</span>
            </motion.h2>
          </div>
        </div>
        
        {/* Animated Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {cards.map((card, idx) => (
            <motion.div 
              key={idx} 
              variants={cardVariants}
              style={{ willChange: "transform, opacity" }}
              className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden cursor-pointer"
            >
              {/* Image with slow cinematic scale, hardware accelerated */}
              <img 
                src={card.img} 
                alt={card.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 transform-gpu"
                style={{ willChange: "transform" }}
              />
              
              {/* Inner Glass Border */}
              <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] rounded-[2rem] z-20 pointer-events-none" />
              
              {/* Dynamic Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-90 z-10" />
              
              {/* Interactive Text Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col justify-end">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h3 className="text-2xl font-medium text-white tracking-tight">
                    {card.title}
                  </h3>
                  
                  {/* Floating Action Icon */}
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 transform-gpu">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                {/* Reveal Description on Hover (Desktop) */}
                <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-rows-[1fr] group-hover:opacity-100">
                  <div className="overflow-hidden">
                    <p className="text-zinc-400 text-base leading-relaxed pt-2">
                      {card.desc}
                    </p>
                  </div>
                </div>
                
                {/* Mobile Fallback: Always show description on small screens since hover doesn't exist */}
                <p className="text-zinc-400 text-base leading-relaxed md:hidden mt-2">
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}