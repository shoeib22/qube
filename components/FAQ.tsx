"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export type FAQItem = {
  q: string;
  a: string;
};

export default function FAQ({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-center text-3xl font-bold mb-10 text-white">
          FAQ
        </h2>

        <div className="space-y-4">
          {items.map((item, i) => {
            const isOpen = open === i;

            return (
              <div
                key={i}
                className="bg-[#121212] border border-gray-800 rounded-xl px-6 py-4 transition-all"
              >
                {/* Header */}
                <button
                  className="w-full flex items-center justify-between text-left font-semibold text-white"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  {item.q}
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {/* Animated Answer */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-40 mt-3 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-gray-400 leading-relaxed">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
