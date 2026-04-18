"use client";
import { motion } from "framer-motion";

export default function QuoteSection() {
  return (
    <section className="py-40 bg-[#030303] px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-2xl md:text-3xl text-zinc-300 leading-relaxed font-light"
        >
          Whether you're setting up basic smart devices or creating a fully 
          integrated automation system, <span className="text-white font-medium">Xerovolt tailors its solutions</span> to your unique 
          needs. Enjoy the convenience of a home that anticipates your preferences.
        </motion.p>
      </div>
    </section>
  );
}