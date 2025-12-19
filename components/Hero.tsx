"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react"; // Assuming you use lucide-react for icons
import Image from "next/image";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  // State for the Intro Animation
  const [showLogo, setShowLogo] = useState(true);
  
  // State for Audio (Default unmuted as requested)
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 1. Handle Resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 2. Initial Setup
    const timer = setTimeout(() => {
      checkMobile();
      setIsMounted(true);
    }, 0);

    window.addEventListener("resize", checkMobile);

    // 3. Logo Timer (Shows logo for 3 seconds then switches to video)
    const logoTimer = setTimeout(() => {
      setShowLogo(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(logoTimer);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Effect to handle video play when logo disappears
  useEffect(() => {
    if (!showLogo && videoRef.current) {
      // Browser Policy Note: Unmuted autoplay is often blocked by browsers.
      // This catch block handles cases where the browser prevents autoplay.
      videoRef.current.play().catch((error) => {
        console.log("Autoplay prevented:", error);
      });
    }
  }, [showLogo]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-end text-white overflow-hidden bg-black">
      
      {/* --------------------------------------------------
          1. LOGO INTRO OVERLAY
      -------------------------------------------------- */}
      <div 
  className={`absolute inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000 ${
    showLogo ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
  }`}
>
  {/* OPTIMIZED NEXT.JS IMAGE */}
  <Image 
    src="/logo/qube.png"
    alt="qubeTech Logo"
    width={300}   // Set this to the approximate pixel width of your PNG
    height={100}  // Set this to the approximate pixel height
    className="w-48 md:w-64 animate-pulse object-contain" 
    priority      // Loads this image immediately since it is the first thing seen
  />
</div>


      {/* --------------------------------------------------
          2. BACKGROUND VIDEO (Mobile & Desktop)
      -------------------------------------------------- */}
      <div className={`absolute inset-0 z-0 ${isMounted ? "block" : "hidden"}`}>
        {!showLogo && (
          <video
            ref={videoRef}
            autoPlay
            loop
            playsInline
            muted={isMuted}
            className="w-full h-full object-cover opacity-80"
            // Key attribute to ensure unmuted works if browser allows
          >
            {/* Conditional Source Rendering */}
            {isMobile ? (
               <source src="/videos/portrait/hero.mp4" type="video/mp4" />
            ) : (
               <source src="/videos/landscape/hero.mp4" type="video/mp4" />
            )}
            Your browser does not support the video tag.
          </video>
        )}
        
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>


      {/* --------------------------------------------------
          3. AUDIO TOGGLE BUTTON
      -------------------------------------------------- */}
      {!showLogo && (
        <button
          onClick={toggleMute}
          className="absolute top-24 right-6 md:top-32 md:right-20 z-40 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition"
          aria-label="Toggle Sound"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      )}


      {/* --------------------------------------------------
          4. TEXT CONTENT
      -------------------------------------------------- */}
      <div className={`relative z-10 pb-24 pl-6 md:pb-32 md:pl-20 max-w-2xl transition-opacity duration-1000 delay-500 ${showLogo ? 'opacity-0' : 'opacity-100'}`}>
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