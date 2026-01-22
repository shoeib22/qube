"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Truck, Zap, Info } from 'lucide-react';

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
  image?: string;
  description?: string;
  specs?: string[];
  isActive?: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();

  // Safe handling of the ID parameter
  const idRaw = params?.id;
  const id = Array.isArray(idRaw) ? idRaw[0] : idRaw;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (id) {
      fetchProductData();
    }
  }, [id]);

  const fetchProductData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();

      if (data.success && data.product) {
        setProduct(data.product);

        // Fetch related products
        try {
          const resAll = await fetch('/api/products?category=' + encodeURIComponent(data.product.category));
          const dataAll = await resAll.json();
          if (dataAll.success) {
            setRelatedProducts(dataAll.products);
          }
        } catch (e) {
          console.warn("Failed to fetch related products", e);
        }
      } else {
        setError(data.error || 'Product not found');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  if (!id || loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-400 mb-8">{error || "The product you are looking for does not exist."}</p>
        <Link href="/shop" className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-12 px-4 md:px-10 max-w-7xl mx-auto w-full">
        {/* Breadcrumbs & Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/shop"
            className="flex items-center text-gray-400 hover:text-white transition-colors text-sm group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Shop
          </Link>

          <div className="flex space-x-4">
            <ShareButton
              title={product.name}
              text={`Check out ${product.name} on SmartHome!`}
              image={product.image}
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">

          {/* Left Column: Media */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[4/3] md:aspect-square bg-[#121212] rounded-3xl overflow-hidden border border-gray-800 flex items-center justify-center p-8 group">
              <Image
                src={product.image || `/images/products/${product.id}.png`}
                alt={product.name}
                fill
                className="object-contain p-6 transform group-hover:scale-105 transition-transform duration-700"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-blue-400 border border-blue-500/20">
                Premium Series
              </div>
            </div>

            {/* Gallery Thumbnails (Mock) */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`aspect-square rounded-xl border ${i === 1 ? 'border-blue-500 bg-blue-500/10' : 'border-gray-800 bg-gray-900'} cursor-pointer hover:border-gray-600 transition-all`}></div>
              ))}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-6">
              <span className="text-blue-500 font-semibold tracking-widest text-xs uppercase mb-3 block">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-3xl font-bold">
                  {product.price ? `₹ ${product.price.toLocaleString()}` : 'Price on Request'}
                </span>
                {product.price && (
                  <span className="text-gray-500 line-through text-lg">
                    ₹ {(product.price * 1.2).toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                {product.description || "Experience the next level of smart home living with this premium device."}
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-10">
              <div className="flex items-start space-x-3 text-sm text-gray-300">
                <ShieldCheck className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Professional Installation</p>
                  <p className="text-gray-500">Free setup by our certified technicians included.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-sm text-gray-300">
                <Truck className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Next Day Delivery</p>
                  <p className="text-gray-500">Available for orders placed before 4 PM today.</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 mt-auto">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Add to Cart Button */}
                <div className="flex justify-center sm:justify-start items-center">
                  <AddToCartButton
                    product={{
                      ...product,
                      price: product.price ?? 0
                    }}
                  />
                </div>

                {/* 2. Buy Now Button (Restored) */}
                <Link
                  href="/checkout"
                  className="bg-white text-black py-3 rounded-full font-bold text-center hover:bg-gray-200 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center"
                >
                  Buy Now
                </Link>
              </div>

              {/* 3. Specs Button */}
              <button className="w-full border border-gray-700 text-white py-4 rounded-2xl font-bold text-lg hover:bg-white/5 active:scale-[0.98] transition-all flex items-center justify-center space-x-2">
                <Info className="w-5 h-5" />
                <span>Technical Specifications</span>
              </button>
            </div>

            {/* Specs Tags */}
            {product.specs && (
              <div className="mt-10 flex flex-wrap gap-2">
                {product.specs.map((spec, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg text-xs font-medium text-gray-400">
                    {spec}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        <section className="mt-32">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Complete the Ecosystem</h2>
              <p className="text-gray-500">Products that work best with your {product.name}.</p>
            </div>
            <Link href="/shop" className="text-blue-500 font-semibold hover:underline hidden md:block">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts
              .filter(p => p.id !== product.id)
              .slice(0, 3)
              .map((item) => {
                return (
                  <Link
                    key={item.id}
                    href={`/shop/Products/${item.id}`}
                    className="group cursor-pointer bg-[#0A0A0A] border border-gray-800 rounded-3xl p-6 hover:border-gray-500 transition-all duration-300"
                  >
                    <div className="aspect-square bg-white/5 rounded-2xl overflow-hidden mb-6 p-6 flex items-center justify-center relative">
                      <Image
                        src={item.image || `/images/products/${item.id}.png`}
                        alt={item.name}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {item.description || "Premium smart home accessory."}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">
                        {item.price ? `₹ ${item.price.toLocaleString()}` : "Price on Request"}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Zap className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}