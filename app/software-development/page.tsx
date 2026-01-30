"use client";

import { useState } from "react";
import {
  Laptop,
  Code,
  Cpu,
  ShieldCheck,
  ArrowRight,
  X,
} from "lucide-react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BackArrow from "../../components/backarrow";

export default function Page() {
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
      console.log("Software Development enquiry:", form);
      await new Promise((res) => setTimeout(res, 800));
      setShowForm(false);
      alert("Thank you! Our team will contact you shortly.");
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: Code,
      title: "Custom Software Solutions",
      description:
        "Tailor-made applications designed to fit your exact business needs.",
      color: "bg-purple-500/20 text-purple-400",
    },
    {
      icon: Cpu,
      title: "Scalable Architecture",
      description:
        "Built to grow with your business using modern, scalable technologies.",
      color: "bg-blue-500/20 text-blue-400",
    },
    {
      icon: ShieldCheck,
      title: "Secure by Design",
      description:
        "Security-first development with best practices and compliance in mind.",
      color: "bg-green-500/20 text-green-400",
    },
    {
      icon: Laptop,
      title: "Performance Focused",
      description:
        "Optimized for speed, reliability, and long-term maintainability.",
      color: "bg-yellow-400/20 text-yellow-400",
    },
  ];

  const steps = [
    {
      step: "1",
      title: "Requirement Analysis",
      description:
        "Understanding your business goals, workflows, and technical needs.",
    },
    {
      step: "2",
      title: "System Architecture",
      description:
        "Designing a robust, scalable, and secure software architecture.",
    },
    {
      step: "3",
      title: "Development & Testing",
      description:
        "Agile development with continuous testing and quality checks.",
    },
    {
      step: "4",
      title: "Deployment & Support",
      description:
        "Smooth deployment with ongoing maintenance and enhancements.",
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
            Software Development
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Build Software That Scales With You.
          </h1>
        </div>
      </section>
     
      {/* HOW IT WORKS */}
      <section className="py-20 bg-black/40 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-16">
            Our Development Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {steps.map((item, i) => (
              <div
                key={i}
                className="bg-black/50 border border-white/10 rounded-2xl p-8"
              >
                <div className="w-12 h-12 bg-yellow-400 text-black font-bold rounded-xl flex items-center justify-center mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl mb-2 font-semibold">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
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

      {/* BOTTOM CTA */}
      <section className="py-24 bg-black/40 border-t border-white/10 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-gray-400 text-lg mb-6">
            Custom software development focused on performance, reliability,
            and long-term growth.
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-3 bg-yellow-400 text-black px-10 py-4 rounded-xl font-semibold"
          >
            Start Your Project
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* MODAL */}
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
              Software Development Enquiry
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
              {loading ? "Please wait..." : "Submit"}
            </button>
          </form>
        </div>
      )}

      <Footer />
    </div>
  );
}
