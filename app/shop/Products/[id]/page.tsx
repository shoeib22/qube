"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Truck, Zap, Info } from 'lucide-react';
import { motion } from 'motion/react';

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
  image: string;    // Base path (e.g., "products/name.png")
  imageUrl?: string; // Signed Production URL (https://...)
  description?: string;
  specs?: string[];
  isActive?: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const idRaw = params?.id;
  const id = Array.isArray(idRaw) ? idRaw[0] : idRaw;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Helper to ensure images never crash Next.js
  const getSafePath = (img?: string, imgUrl?: string, fallbackId?: string) => {
    if (imgUrl) return imgUrl; // Prioritize Signed URL
    if (!img) return `/images/products/${fallbackId}.png`;
    // Ensure relative paths start with /
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

  if (!id || loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <Link href="/shop" className="px-6 py-3 bg-white text-black rounded-full font-semibold">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-12 px-4 md:px-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <Link href="/shop" className="flex items-center text-gray-400 hover:text-white transition-colors text-sm group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Shop
          </Link>
          <ShareButton 
            title={product.name} 
            text={`Check out ${product.name}`} 
            image={getSafePath(product.image, product.imageUrl, product.id)} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          {/* Left: Media */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-square bg-[#121212] rounded-3xl overflow-hidden border border-gray-800 flex items-center justify-center p-8 group">
              <Image
                src={getSafePath(product.image, product.imageUrl, product.id)}
                alt={product.name}
                fill
                className="object-contain p-6 transform group-hover:scale-105 transition-transform duration-700"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-5 flex flex-col">
            <span className="text-blue-500 font-semibold tracking-widest text-xs uppercase mb-3 block">{product.category}</span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-baseline space-x-3 mb-6">
              <span className="text-3xl font-bold">{product.price ? `₹ ${product.price.toLocaleString()}` : 'Price on Request'}</span>
            </div>

            <p className="text-gray-400 text-lg mb-8">{product.description || "Premium smart home device."}</p>

            <div className="space-y-4 mb-10">
              <div className="flex items-start space-x-3 text-sm text-gray-300">
                <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                <div><p className="font-semibold">Professional Installation</p></div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AddToCartButton product={{ ...product, price: product.price ?? 0 }} />
                <Link href="/checkout" className="bg-white text-black py-3 rounded-full font-bold text-center hover:bg-gray-200 transition-all">
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-32">
          <h2 className="text-3xl font-bold mb-10">Complete the Ecosystem</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.filter(p => p.id !== product.id).slice(0, 3).map((item) => (
              <Link key={item.id} href={`/shop/Products/${item.id}`} className="group bg-[#0A0A0A] border border-gray-800 rounded-3xl p-6 hover:border-gray-500 transition-all">
                <div className="aspect-square bg-white/5 rounded-2xl overflow-hidden mb-6 p-6 flex items-center justify-center relative">
                  <Image
                    src={getSafePath(item.image, (item as any).imageUrl, item.id)}
                    alt={item.name}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="text-xl font-bold">{item.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-bold">{item.price ? `₹ ${item.price.toLocaleString()}` : "Price on Request"}</span>
                  <Zap className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}