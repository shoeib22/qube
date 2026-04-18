"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Users, Home, LayoutGrid } from "lucide-react";

const solutions = [
  {
    id: "professionals",
    icon: Briefcase,
    title: "For Busy Professionals",
    desc: "Automate routines, hands-free control, and remote monitoring. Your home prepares itself before you even walk through the door.",
    // Using high-quality unsplash placeholders for now
    img: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop" 
  },
  {
    id: "families",
    icon: Users,
    title: "For Families",
    desc: "Kid-safe controls, smart security, and energy savings for your home. Keep an eye on things from anywhere.",
    img: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "luxury",
    icon: Home,
    title: "For Luxury Homes",
    desc: "High-end automation, custom ambiance, and seamless entertainment integrated perfectly into your interior design.",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "renters",
    icon: LayoutGrid,
    title: "For Renters & Small Spaces",
    desc: "Voice control, fall detection, and assisted living tech. Wireless retrofit modules that require no rewiring.",
    img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop"
  }
];

export default function SmartSolutions() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-24 bg-[#030303] border-t border-white/5" id="solutions">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-white">
            Explore Smart Living, <br />
            <span className="text-zinc-500">Your Way</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left Side: Dynamic Image Display */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 border border-white/10">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeTab}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                src={solutions[activeTab].img}
                alt={solutions[activeTab].title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute bottom-0 left-0 p-8"
              >
                <p className="text-white text-lg leading-relaxed max-w-md">
                  {solutions[activeTab].desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side: Interactive Menu */}
          <div className="flex flex-col gap-4">
            <p className="text-sm uppercase tracking-widest text-zinc-500 font-semibold mb-2">By Lifestyle Needs</p>
            
            {solutions.map((item, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-6 p-6 rounded-xl transition-all duration-300 border text-left
                    ${isActive 
                      ? "bg-blue-600/10 border-blue-500/30 text-white" 
                      : "bg-transparent border-transparent text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <div className={`p-3 rounded-lg transition-colors ${isActive ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400"}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-medium ${isActive ? "text-white" : "text-zinc-300"}`}>
                      {item.title}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}