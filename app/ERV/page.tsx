"use client";

import { useState } from "react";
import {
  Zap,
  Wind,
  ThermometerSun,
  Droplets,
  ArrowRight,
  X,
} from "lucide-react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BackArrow from "../../components/backarrow";
/* PDF URL */
const ERV_PDF_URL =
  "https://firebasestorage.googleapis.com/v0/b/cube-8c773.firebasestorage.app/o/erv-brochure.pdf?alt=media";

export default function ERVPage() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Form data:", form);
      await new Promise((res) => setTimeout(res, 800));
      window.open(ERV_PDF_URL, "_blank");
      setShowForm(false);
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: Zap,
      title: "97% Energy Recovery",
      description:
        "Our ceramic core transfers heat with unprecedented efficiency.",
      color: "bg-yellow-400/20 text-yellow-400",
    },
    {
      icon: Wind,
      title: "Continuous Fresh Air",
      description:
        "Runs 24/7, constantly replacing stale air with fresh air.",
      color: "bg-blue-400/20 text-blue-400",
    },
    {
      icon: ThermometerSun,
      title: "Year-Round Comfort",
      description:
        "Works efficiently in all seasons for consistent indoor comfort.",
      color: "bg-orange-400/20 text-orange-400",
    },
    {
      icon: Droplets,
      title: "Humidity Balance",
      description:
        "Maintains optimal humidity for healthier indoor air.",
      color: "bg-cyan-400/20 text-cyan-400",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[var(--graphite)] text-white">
      <Header />
       <BackArrow />
      {/* HERO */}
      <section className="pt-32 pb-20 text-center bg-gradient-to-b from-black to-[#1a1a1a]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="inline-block bg-white/10 text-yellow-400 px-4 py-2 rounded-full text-sm mb-6">
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

      {/* KEY ADVANTAGES */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-3xl font-semibold mb-16">
            Key Advantages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="bg-black/40 rounded-2xl border border-white/10 p-8"
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

      {/* HOW IT WORKS */}
      <section className="py-24 bg-black/40 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-16">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              ["01", "Stale Air Extraction", "Polluted indoor air is removed."],
              ["02", "Ceramic Heat Storage", "Heat or cool energy is stored."],
              ["03", "Airflow Reversal", "Fan direction switches automatically."],
              ["04", "Fresh Air Supply", "Filtered fresh air enters the room."],
            ].map(([step, title, desc], i) => (
              <div
                key={i}
                className="bg-black/50 border border-white/10 rounded-2xl p-8 text-center"
              >
                <div className="text-yellow-400 font-bold text-xl mb-4">
                  {step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNICAL SPECIFICATIONS */}
      <section className="py-24 bg-black/20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Technical Specifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              ["Energy Recovery Efficiency", "Up to 97%"],
              ["Airflow Rate", "30–60 m³/h"],
              ["Noise Level", "≤ 19 dB(A)"],
              ["Power Consumption", "1.5 – 4 W"],
              ["Heat Exchanger", "Ceramic Core"],
              ["Installation", "Wall-mounted, no ducts"],
              ["Control Options", "Manual / Smart Control"],
              ["Applications", "Homes, Offices, Bedrooms"],
            ].map(([label, value], i) => (
              <div
                key={i}
                className="flex justify-between bg-black/40 border border-white/10 rounded-xl p-5"
              >
                <span className="text-gray-400">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOWNLOAD CTA AT BOTTOM */}
      <section className="py-24 bg-black/40 border-t border-white/10 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-6">
            Download the Complete ERV Brochure
          </h2>

          <p className="text-gray-400 mb-10">
            Get full technical details, installation guidance, and performance
            specifications.
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-3 bg-yellow-400 text-black px-10 py-4 rounded-xl font-semibold"
          >
            Download ERV Brochure
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* DOWNLOAD MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="relative bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-md"
          >
            <button
              type="button"
              onClick={() => !loading && setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-6">
              Download ERV Brochure
            </h2>

            <input
              required
              placeholder="Full Name"
              className="w-full mb-4 p-3 bg-black border border-white/10 rounded"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              required
              type="email"
              placeholder="Email Address"
              className="w-full mb-4 p-3 bg-black border border-white/10 rounded"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              required
              placeholder="Contact Number"
              className="w-full mb-6 p-3 bg-black border border-white/10 rounded"
              value={form.contact}
              onChange={(e) =>
                setForm({ ...form, contact: e.target.value })
              }
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-black py-3 rounded font-semibold"
            >
              {loading ? "Please wait..." : "Submit & Download"}
            </button>
          </form>
        </div>
      )}

      <Footer />
    </div>
  );
}
