"use client";

import {
  Zap,
  Wind,
  ThermometerSun,
  Droplets,
  ArrowRight,
} from "lucide-react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function FeaturesPage() {
  const benefits = [
    {
      icon: Zap,
      title: "97% Energy Recovery",
      description:
        "Our ceramic core transfers heat with unprecedented efficiency, reducing heating and cooling costs by up to 70%.",
      color: "bg-yellow-400/20 text-yellow-400",
    },
    {
      icon: Wind,
      title: "Continuous Fresh Air",
      description:
        "ECO Pair Plus runs 24/7, constantly replacing stale air with fresh outdoor air.",
      color: "bg-blue-400/20 text-blue-400",
    },
    {
      icon: ThermometerSun,
      title: "Year-Round Comfort",
      description:
        "Works in both winter and summer to maintain comfortable indoor temperatures.",
      color: "bg-orange-400/20 text-orange-400",
    },
    {
      icon: Droplets,
      title: "Humidity Balance",
      description:
        "Transfers moisture efficiently, preventing dry winters and humid summers.",
      color: "bg-cyan-400/20 text-cyan-400",
    },
  ];

  const steps = [
    {
      step: "1",
      title: "Air Extraction",
      description:
        "Warm indoor air is extracted and pushed through the ceramic core, transferring thermal energy.",
    },
    {
      step: "2",
      title: "Core Charging",
      description:
        "The ceramic core absorbs and stores heat (or coolness) for exactly 75 seconds.",
    },
    {
      step: "3",
      title: "Direction Reversal",
      description:
        "The reversible fan switches direction automatically, now supplying fresh air.",
    },
    {
      step: "4",
      title: "Fresh Air Supply",
      description:
        "Outdoor air passes through the charged core and enters the room pre-heated or pre-cooled.",
    },
  ];

  const comparison = [
    { feature: "Energy Recovery", eco: "97%", traditional: "65–75%", simple: "0%" },
    { feature: "Noise Level", eco: "19 dB(A)", traditional: "35–45 dB(A)", simple: "40–60 dB(A)" },
    { feature: "Installation", eco: "No ducts", traditional: "Full ducting", simple: "Basic fan" },
    { feature: "Smart Control", eco: "Full App", traditional: "Limited", simple: "None" },
    { feature: "Annual Cost", eco: "€20", traditional: "€150", simple: "€300+" },
  ];

  return (
    <div className="min-h-screen w-full bg-[var(--graphite)] text-white">
      <Header />

      {/* HERO */}
      <section className="pt-32 pb-20 text-center bg-gradient-to-b from-black to-[#1a1a1a]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="inline-block bg-white/10 backdrop-blur-md text-yellow-400 px-4 py-2 rounded-full text-sm mb-6">
            Powerful Features
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Designed for Performance. Built for Comfort.
          </h1>

          <p className="text-gray-400 text-lg">
            Explore what makes ECO Pair Plus the most advanced single-room
            heat-recovery ventilation system.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-black/40 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-16">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {steps.map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-black/50 border border-white/10 rounded-2xl p-8 h-full">
                  <div className="w-12 h-12 bg-yellow-400 text-black font-bold rounded-xl flex items-center justify-center mb-4">
                    {item.step}
                  </div>

                  <h3 className="text-xl mb-2 font-semibold">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>

                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-red-500/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-3xl font-semibold mb-16">
            Key Advantages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="bg-black/40 rounded-2xl border border-white/10 p-8 hover:border-yellow-400/30 transition-all"
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${b.color}`}
                >
                  <b.icon className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-semibold mb-3">{b.title}</h3>
                <p className="text-gray-400">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERAMIC CORE */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-br from-[#2a2a2a] to-black rounded-3xl p-12 border border-white/10 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              <div>
                <h2 className="text-3xl font-semibold mb-6">Ceramic Core Excellence</h2>
                <p className="text-gray-400 mb-8">
                  The ceramic core is engineered with over 200 channels designed to maximize heat transfer efficiency.
                </p>

                <ul className="space-y-4 text-gray-300">
                  {[
                    "High thermal mass for superior energy storage",
                    "Anti-bacterial coating ensures cleanliness",
                    "Corrosion-resistant and long-lasting",
                    "Optimized airflow with low resistance",
                    "Tested for 100,000+ cycles",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="w-3 h-3 rounded-full bg-yellow-400 mt-1"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/5 rounded-2xl p-10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-yellow-400/20 rounded-xl mb-4 flex items-center justify-center">
                    <div className="w-16 h-16 bg-orange-500 rounded-lg" />
                  </div>
                  <p className="text-white text-sm">Ceramic Core</p>
                  <p className="text-gray-400 text-xs">High-Performance Heat Exchanger</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-20 bg-black/30 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-3xl font-semibold mb-12">
            How It Compares
          </h2>

          <div className="overflow-x-auto bg-black/50 border border-white/10 rounded-2xl p-8">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-4">Feature</th>
                  <th className="pb-4 text-center text-yellow-400">
                    ECO Pair Plus
                  </th>
                  <th className="pb-4 text-center text-gray-400">
                    Traditional ERV
                  </th>
                  <th className="pb-4 text-center text-gray-400">
                    Simple Fans
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-4">{row.feature}</td>
                    <td className="py-4 text-center text-yellow-400">{row.eco}</td>
                    <td className="py-4 text-center text-gray-400">
                      {row.traditional}
                    </td>
                    <td className="py-4 text-center text-gray-400">
                      {row.simple}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
