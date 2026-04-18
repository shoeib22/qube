"use client";
import { motion } from "framer-motion";

const stats = [
  {
    value: "400+",
    description: "Homes Automated for connected modern living",
  },
  {
    value: "100%",
    description: "Local Control ensuring your data stays private",
  },
  {
    value: "30%",
    description: "Reduction in Energy Costs with intelligent automation",
  }
];

export default function Stats() {
  return (
    <section className="py-24 bg-[#030303] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 text-center">
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl font-medium tracking-tight mb-20 text-white"
        >
          Innovation That <span className="text-zinc-500">Fits Every Home</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="flex flex-col items-center justify-center pt-8 md:pt-0 px-6"
            >
              <h3 className="text-6xl lg:text-7xl font-light text-white mb-4 tracking-tighter">
                {stat.value}
              </h3>
              <p className="text-zinc-400 text-sm max-w-[200px] leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}