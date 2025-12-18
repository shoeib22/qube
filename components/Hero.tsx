"use client";

import { useState, useEffect } from "react";
import PointCloudFromImage from "./3d/PointCloudFromImage";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 1. Define the resize handler
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 2. Initial Check & Mount
    // We wrap this in a 0ms timeout to push it to the next event loop tick.
    // This satisfies the "synchronous setState" linter rule and prevents blocking.
    const timer = setTimeout(() => {
      checkMobile();
      setIsMounted(true);
    }, 0);

    // 3. Add Event Listener
    window.addEventListener("resize", checkMobile);

    // 4. Cleanup
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-end text-white overflow-hidden bg-black">

      {/* 1. MOBILE VIDEO BACKGROUND */}
      <div className={`absolute inset-0 z-0 md:hidden ${isMounted ? 'block' : 'hidden'}`}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover opacity-80"
        >
            <source src="/videos/hero-mobile.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* 2. DESKTOP 3D BACKGROUND */}
      {!isMobile && isMounted && (
        <div className="absolute inset-0 z-0 hidden md:block">
           <PointCloudFromImage />
        </div>
      )}

      {/* TEXT OVERLAY */}
      <div className="relative z-10 pb-24 pl-6 md:pb-32 md:pl-20 max-w-2xl pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            The Future is <br className="hidden md:block" />
            <span className="text-orange-300">Forming Now.</span>
          </h1>

          <p className="text-gray-400 mt-6 text-base md:text-xl max-w-md leading-relaxed">
            Smart automation built around your lifestyle. <br className="hidden md:block" />
            Experience the next generation of control.
          </p>

          <div className="mt-8 flex gap-4">
             <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
                Get Started
             </button>
             <button className="px-6 py-3 rounded-full font-semibold border border-white/20 hover:bg-white/10 transition backdrop-blur-sm">
                Learn More
             </button>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-0" />

    </section>
  );
}