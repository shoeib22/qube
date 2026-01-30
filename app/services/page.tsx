"use client";

import Link from "next/link";
import {
  Music,
  Home,
  Shield,
  Tablet,
  ArrowRight,
  Wind,
  Laptop,
} from "lucide-react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ServicesPage() {
  const services = [
    {
      icon: Music,
      title: "Audio & Video",
      description:
        "Experience immersive entertainment with our state-of-the-art audio and video solutions. From custom home theaters to multi-room audio systems, we bring the cinema to you.",
      color: "bg-purple-400/20 text-purple-400",
      href: "/audio-video",
    },
    {
      icon: Home,
      title: "Home Automations",
      description:
        "Transform your living space with intelligent automation. Control lighting, climate, and appliances seamlessly from a single intuitive interface.",
      color: "bg-blue-400/20 text-blue-400",
      href: "/home-automation",
    },
    {
      icon: Shield,
      title: "Security Services",
      description:
        "Protect what matters most with advanced security systems. Our comprehensive surveillance and monitoring solutions ensure peace of mind 24/7.",
      color: "bg-red-400/20 text-red-400",
      href: "/security",
    },
    {
      icon: Tablet,
      title: "Smart Panels",
      description:
        "Centralize control with elegant smart panels. Access all your home's features with touch-screen precision and modern design aesthetics.",
      color: "bg-yellow-400/20 text-yellow-400",
      href: "/smart-panels",
    },
    {
      icon: Wind,
      title: "Energy Recovery Ventilator",
      description:
        "High-efficiency ventilation that delivers fresh air while conserving energy and maintaining indoor comfort.",
      color: "bg-green-400/20 text-green-400",
      href: "/ERV", 
    },
    {
  icon: Laptop,
  title: "Software Development",
  description:
    "Custom software development focused on performance, reliability, and growth.",
  color: "bg-pink-400/20 text-pink-400",
  href: "/software-development",
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[var(--graphite)] text-white">
      <Header />

      {/* HERO */}
      <section className="pt-32 pb-20 text-center bg-gradient-to-b from-black to-[#1a1a1a]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="inline-block bg-white/10 backdrop-blur-md text-yellow-400 px-4 py-2 rounded-full text-sm mb-6">
            Our Expertise
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Premium Services for Modern Living
          </h1>

          <p className="text-gray-400 text-lg">
            Elevate your lifestyle with our cutting-edge technology solutions
            tailored for your home and business.
          </p>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-20 bg-black/40 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {services.map((service, i) => {
              const Icon = service.icon;

              return (
                <div
                  key={i}
                  className="group relative overflow-hidden bg-black/50 border border-white/10 rounded-3xl p-10 hover:border-yellow-400/30 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${service.color} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>

                    <h3 className="text-2xl font-bold mb-4">
                      {service.title}
                    </h3>

                    <p className="text-gray-400 leading-relaxed mb-8">
                      {service.description}
                    </p>

                    {/* ✅ LINK */}
                    <Link
                      href={service.href}
                      className="inline-flex items-center text-yellow-400 font-medium group/link"
                    >
                      <span className="mr-2">Learn more</span>
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
