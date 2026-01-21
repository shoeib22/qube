"use client";

import { motion } from "motion/react";

export default function Features() {
  const items: { name: string; desc: string }[] = [
    { name: "Smart Hub", desc: "Central Control" },
    { name: "Smart Locks", desc: "Secure Access" },
    { name: "Sensors", desc: "Motion Tracking" },
    { name: "Lighting", desc: "Ambient Control" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
  } as const;

  return (
    <section id="features" className="py-20 border-t border-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold mb-10"
        >
          Product Ecosystem
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              variants={itemAnim}
              whileHover={{ scale: 1.05, borderColor: "#ffffff" }}
              className="bg-[#121212] border border-gray-800 p-6 rounded-2xl hover:border-gray-400 transition cursor-default"
            >
              <h3 className="text-xl font-bold mb-2">{item.name}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

