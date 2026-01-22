"use client";

import { motion } from "motion/react";

export default function Accessories() {
  const items: string[] = [
    "Motion Sensors",
    "Smart Plugs",
    "Curtain Motors",
    "IR Blasters",
  ];

  return (
    <section className="py-20 border-t border-gray-800 overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="max-w-7xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6"
      >
        {items.map((name, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 60 } }
            }}
            whileHover={{ y: -5, borderColor: "#ffffff" }}
            className="bg-[#121212] p-6 rounded-xl border border-gray-800 text-center hover:border-gray-500 transition cursor-pointer"
          >
            <h3 className="font-bold mb-2">{name}</h3>
            <p className="text-gray-400 text-sm">Shop Now →</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

