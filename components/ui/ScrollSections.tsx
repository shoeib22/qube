"use client";
import { motion } from "framer-motion";

const sections = [
  {
    title: "Seamless Automation, Tailored for You",
    desc: "From basic smart setups to fully integrated home automation — customized to your lifestyle.",
    img: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1200", // Replace with your high-res smart home image
    align: "left"
  },
  {
    title: "Monitor and Manage Remotely, Effortlessly",
    desc: "From live views of each room to smart control of lights, security, and more. Xerovolt brings your home to your fingertips.",
    img: "https://images.unsplash.com/photo-1512486130939-2c4f7996006f?q=80&w=1200", // Replace with your mobile app/monitoring image
    align: "right"
  }
];

export default function ScrollSections() {
  return (
    <section className="bg-[#030303]">
      {sections.map((section, idx) => (
        <div key={idx} className="relative min-h-screen flex items-center px-6 py-24 border-b border-white/5">
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <motion.img 
              initial={{ scale: 1.1, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 0.4 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              src={section.img}
              alt={section.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303]"></div>
          </div>

          {/* Text Content */}
          <div className={`relative z-10 max-w-7xl mx-auto w-full flex ${section.align === 'right' ? 'justify-end' : 'justify-start'}`}>
            <motion.div 
              initial={{ opacity: 0, x: section.align === 'left' ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-xl"
            >
              <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-6">
                {section.title}
              </h2>
              <p className="text-xl text-zinc-400 leading-relaxed">
                {section.desc}
              </p>
            </motion.div>
          </div>
        </div>
      ))}
    </section>
  );
}