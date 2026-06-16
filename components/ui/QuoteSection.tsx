"use client";
import { motion } from "framer-motion";

export default function QuoteSection() {
  return (
    <section className="relative py-48 lg:py-64 bg-[#030303] px-6 overflow-hidden flex items-center justify-center">
      
      {/* Subtle Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
        <div className="w-[600px] md:w-[800px] h-[400px] bg-white/[0.02] blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        
        {/* Giant Decorative Quotation Mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="absolute -top-24 md:-top-32 left-1/2 -translate-x-1/2 text-[10rem] md:text-[15rem] leading-none font-serif text-white/5 select-none pointer-events-none"
        >
          &ldquo;
        </motion.div>

        {/* Cinematic Blur-Reveal Text */}
        <motion.p 
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-10%" }}
          className="relative z-10 text-3xl md:text-5xl lg:text-6xl text-zinc-600 leading-[1.3] font-light tracking-tight"
        >
          Whether you're setting up basic smart devices or creating a fully 
          integrated automation system,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 font-medium">
            Xerovolt tailors its solutions
          </span>{" "}
          to your unique needs. Enjoy the convenience of a home that{" "}
          <span className="text-zinc-300">anticipates your preferences.</span>
        </motion.p>
        
        {/* Minimalist Divider & Signature */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
           viewport={{ once: true }}
           className="mt-20 md:mt-24 flex flex-col items-center gap-6"
        >
           {/* Fading Vertical Line */}
           <div className="w-px h-16 bg-gradient-to-b from-white/20 to-transparent" />
           
           <span className="text-xs tracking-[0.3em] uppercase text-zinc-500 font-semibold">
             The Xerovolt Vision
           </span>
        </motion.div>
        
      </div>
    </section>
  );
}