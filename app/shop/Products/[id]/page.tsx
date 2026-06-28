"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

// Import your layout components
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import ShareButton from "../../../../components/ShareButton";

// Import the Add To Cart Button
import AddToCartButton from "../../../../components/ui/AddToCartButton";

interface Product {
  id: string;
  name: string;
  category: string;
  price?: number;
  image: string;
  imageUrl?: string;
  description?: string;
  specs?: string[];
  isActive?: boolean;
}

// Pre-rendered static noise to maintain the cinematic texture without CPU cost
const NOISE_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100%25' height='100%25'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function ProductDetailPage() {
  // --- STATE & API LOGIC (UNTOUCHED) ---
  const params = useParams();
  const idRaw = params?.id;
  const id = Array.isArray(idRaw) ? idRaw[0] : idRaw;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const getSafePath = (img?: string, imgUrl?: string, fallbackId?: string) => {
    if (imgUrl) return imgUrl; 
    if (!img) return `/images/products/${fallbackId}.png`;
    return img.startsWith('/') ? img : `/${img}`;
  };

  useEffect(() => {
    if (id) fetchProductData();
  }, [id]);

  const fetchProductData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();

      if (data.success && data.product) {
        setProduct(data.product);
        fetchRelated(data.product.category);
      } else {
        setError(data.error || 'Product not found');
      }
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelated = async (category: string) => {
    try {
      const res = await fetch('/api/products?category=' + encodeURIComponent(category));
      const data = await res.json();
      if (data.success) setRelatedProducts(data.products);
    } catch (e) {
      console.warn("Related products failed", e);
    }
  };
  // ------------------------------------

  // --- 3D & PARALLAX LOGIC ---
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  const stageRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Springs for buttery smooth physics
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 150, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 150, mass: 0.5 });
  
  // Translate mouse movement into 3D rotation
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const lightX = useTransform(smoothX, [-0.5, 0.5], ["0%", "100%"]);
  const lightY = useTransform(smoothY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!stageRef.current) return;
    if (rafId.current) return; // Throttle to frame rate
    
    rafId.current = requestAnimationFrame(() => {
      const { left, top, width, height } = stageRef.current!.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
      rafId.current = null;
    });
  };

  const handleMouseLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    mouseX.set(0);
    mouseY.set(0);
  };

  // --- RENDERERS ---
  if (!id || loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-white/10 border-t-white/80 rounded-full animate-spin" />
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Initializing Module</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: NOISE_PATTERN, backgroundRepeat: "repeat" }} />
        <h1 className="text-4xl font-light tracking-tight mb-6 z-10">Asset Not Found</h1>
        <Link href="/shop" className="z-10 px-8 py-3 bg-white text-black rounded-full text-sm font-medium hover:scale-105 transition-transform">
          Return to Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col relative overflow-hidden font-sans selection:bg-white/20">
      {/* Cinematic Ambient Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: NOISE_PATTERN, backgroundRepeat: "repeat" }} />
      
      {/* Ambient glow — hidden on mobile to prevent GPU stall */}
      <motion.div
        className="hidden sm:block absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none transform-gpu z-0"
        style={{ y: parallaxY, willChange: "transform" }}
      />

      <Header />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-10 max-w-7xl mx-auto w-full relative z-10">
        
        {/* Navigation Row */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <Link href="/shop" className="flex items-center text-zinc-500 hover:text-white transition-colors text-sm font-medium tracking-wide group">
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center mr-3 group-hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            Back to Architecture
          </Link>
          <ShareButton 
            title={product.name} 
            text={`Check out ${product.name}`} 
            image={getSafePath(product.image, product.imageUrl, product.id)} 
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left: 3D Interactive Media Stage */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative"
            style={{ perspective: "1500px" }}
          >
            <motion.div
              ref={stageRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full aspect-square rounded-[2.5rem] bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.05] flex items-center justify-center overflow-hidden transform-gpu group cursor-crosshair"
              style={{ rotateX, rotateY, transformStyle: "preserve-3d", willChange: "transform" }}
            >
              {/* Dynamic Mouse Glare */}
              <motion.div 
                className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ 
                  background: `radial-gradient(circle 400px at ${lightX} ${lightY}, rgba(255,255,255,0.1), transparent 80%)`,
                  willChange: "background"
                }}
              />
              
              {/* Product Image hovering in 3D space */}
              <motion.div 
                className="relative w-[70%] h-[70%] transform-gpu"
                style={{ transform: "translateZ(80px)" }} // Pushes image out towards user
              >
                <Image
                  src={getSafePath(product.image, product.imageUrl, product.id)}
                  alt={product.name}
                  fill
                  className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  priority
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right: Glassmorphic Details Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col"
          >
            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 sm:p-8 md:p-10 md:backdrop-blur-xl shadow-2xl relative overflow-hidden">
              {/* Inner subtle glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
                </span>
                <span className="text-zinc-300 text-[10px] font-mono tracking-widest uppercase">
                  {product.category}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white mb-6 leading-tight">
                {product.name}
              </h1>
              
              <div className="mb-8">
                <span className="text-3xl font-light tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                  {product.price ? `₹ ${product.price.toLocaleString()}` : 'Price on Request'}
                </span>
              </div>

              <p className="text-zinc-400 text-base leading-relaxed mb-10 font-light">
                {product.description || "Premium architectural hardware engineered for seamless spatial integration."}
              </p>

              <div className="flex items-center space-x-4 mb-10 p-4 rounded-2xl bg-black/40 border border-white/5">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Professional Installation Available</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Certified technicians ensure perfect integration.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
                <div className="flex-1">
                  <AddToCartButton product={{ ...product, price: product.price ?? 0 }} />
                </div>
                <Link 
                  href="/checkout" 
                  className="flex-1 group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white px-8 text-sm font-semibold text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="relative z-10">Initialize Order</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products Ecosystem Grid */}
        <AnimatePresence>
          {relatedProducts.length > 1 && (
            <motion.section 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-40"
            >
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-light tracking-tight text-white">Complete the Ecosystem</h2>
                  <p className="text-zinc-500 text-sm mt-2 font-light">Seamlessly integrate with related modules.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {relatedProducts.filter(p => p.id !== product.id).slice(0, 3).map((item, idx) => (
                  <Link 
                    key={item.id} 
                    href={`/shop/Products/${item.id}`} 
                    className="group relative flex flex-col justify-between bg-white/[0.02] border border-white/5 rounded-[2rem] p-5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500"
                  >
                    <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] rounded-[2rem] pointer-events-none" />
                    
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-white/[0.04] to-transparent flex items-center justify-center mb-6">
                      <Image
                        src={getSafePath(item.image, (item as any).imageUrl, item.id)}
                        alt={item.name}
                        fill
                        className="object-contain p-8 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    
                    <div className="px-2">
                      <h3 className="text-lg font-medium text-white tracking-tight">{item.name}</h3>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-zinc-400 font-mono text-sm">
                          {item.price ? `₹ ${item.price.toLocaleString()}` : "Price on Request"}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white text-white group-hover:text-black transition-colors duration-300">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </main>
      <Footer />
    </div>
  );
}