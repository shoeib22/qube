"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PRODUCTS = [
  {
    id: "edge",
    label: "Edge Series",
    icon: "⚡",
    color: "#155cfc",
    downloads: [
      { name: "Installation Guide", type: "PDF", size: "2.4 MB" },
      { name: "User Manual", type: "PDF", size: "5.1 MB" },
      { name: "Spec Sheet", type: "PDF", size: "1.2 MB" },
      { name: "App Setup Guide", type: "PDF", size: "3.8 MB" },
    ],
    specs: [
      { label: "Input Voltage", value: "90–265V AC, 50/60Hz" },
      { label: "Load per Switch", value: "Up to 1200W" },
      { label: "Communication", value: "Tuya Wi-Fi / Zigbee / RF Remote" },
      { label: "Operating Temp", value: "0°C – 55°C" },
      { label: "IP Rating", value: "IP20" },
      { label: "Material", value: "Toughened Glass / Acrylic" },
    ],
    faqs: [
      { q: "Does Edge Series require a neutral wire?", a: "Most configurations require a neutral wire. Please refer to the wiring diagram in the Installation Guide for your specific accessory configuration." },
      { q: "Which apps are supported?", a: "The Tuya variant works with the Tuya Smart app and is compatible with Alexa, Google Home, and Apple HomeKit via integrations." },
      { q: "Can I mix accessories on one panel?", a: "Yes. Each panel can hold accessories from 2M, 4M, or 6M modular sizes based on the selected panel frame." },
      { q: "How do I reset a switch?", a: "Press and hold any button for 5 seconds until the LED blinks rapidly, then release. The device will reset to factory settings." },
    ],
  },
  {
    id: "touch",
    label: "Touch Panel",
    icon: "👆",
    color: "#7c3aed",
    downloads: [
      { name: "Touch Panel Manual", type: "PDF", size: "4.2 MB" },
      { name: "Wiring Diagram", type: "PDF", size: "1.8 MB" },
    ],
    specs: [
      { label: "Touch Technology", value: "Capacitive Multi-touch" },
      { label: "Display", value: '4" TFT LCD' },
      { label: "Input Voltage", value: "100–240V AC" },
      { label: "Connectivity", value: "Wi-Fi 2.4GHz" },
    ],
    faqs: [
      { q: "Can I customize the touch panel display?", a: "Yes, through the app you can configure labels, icons, and color themes for the touch panel display." },
      { q: "Does the touch panel work offline?", a: "Local scene controls function without internet. Cloud features require connectivity." },
    ],
  },
  {
    id: "color",
    label: "Color Series",
    icon: "🎨",
    color: "#059669",
    downloads: [
      { name: "Color Series Manual", type: "PDF", size: "3.5 MB" },
      { name: "RGBW Controller Guide", type: "PDF", size: "2.1 MB" },
    ],
    specs: [
      { label: "Output", value: "RGBW / Tunable White" },
      { label: "Driver Type", value: "Constant Voltage 12V/24V" },
      { label: "Max Load", value: "96W (12V) / 192W (24V)" },
      { label: "Dimming Method", value: "PWM" },
    ],
    faqs: [
      { q: "What LED strips are compatible?", a: "12V or 24V RGB, RGBW, and tunable white LED strips are supported. Ensure amperage stays within the controller's rating." },
    ],
  },
  {
    id: "royal-edge",
    label: "Royal Edge",
    icon: "👑",
    color: "#c8a951",
    downloads: [
      { name: "Royal Edge Catalog", type: "PDF", size: "8.2 MB" },
      { name: "Installation Guide", type: "PDF", size: "3.1 MB" },
    ],
    specs: [
      { label: "Finish", value: "Brushed Gold / Rose Gold / Chrome" },
      { label: "Material", value: "Aerospace-grade Acrylic" },
      { label: "Backlight", value: "Soft glow LED" },
      { label: "Load per Switch", value: "Up to 1200W" },
    ],
    faqs: [
      { q: "Is Royal Edge compatible with standard Edge accessories?", a: "Yes. Royal Edge uses the same accessory ecosystem as the Edge Series, allowing full configurability." },
      { q: "How do I clean the Royal Edge panel?", a: "Use a soft, dry microfiber cloth. Avoid abrasive cleaners or chemical solvents." },
    ],
  },
  {
    id: "accessories",
    label: "Accessories",
    icon: "🔧",
    color: "#f2994a",
    downloads: [
      { name: "Accessories Catalog", type: "PDF", size: "5.7 MB" },
      { name: "Fan Regulator Guide", type: "PDF", size: "1.4 MB" },
    ],
    specs: [
      { label: "Fan Regulators", value: "4-step / 6-step / Rotary" },
      { label: "USB Sockets", value: "5V 2.4A / QC 3.0" },
      { label: "TV/Data Ports", value: "HDMI, RJ45, 3.5mm" },
      { label: "Compatibility", value: "All Xerovolt panel frames" },
    ],
    faqs: [
      { q: "Can I mix accessories from different brands?", a: "Xerovolt accessories are designed to fit standard modular gang boxes. However, visual consistency is best with Xerovolt-matched accessories." },
      { q: "Do you offer custom accessories?", a: "Yes, contact our B2B team for custom configurations for large installations." },
    ],
  },
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState(PRODUCTS[0].id);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", product: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const product = PRODUCTS.find(p => p.id === activeTab)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/support/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", product: "", subject: "", message: "" });
      } else {
        const data = await res.json();
        setSubmitError(data.error ?? "Submission failed");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-[#155cfc] px-6 py-12 md:py-16 text-center">
          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-3">Support Center</p>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">How can we help?</h1>
          <p className="text-blue-100 max-w-lg mx-auto text-sm">Browse resources by product, download documentation, and submit a support request.</p>
        </section>

        {/* Product tabs — sticky, scrollable on mobile */}
        <section className="border-b-2 border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
          <div className="max-w-5xl mx-auto px-2 sm:px-6">
            <div className="flex overflow-x-auto gap-0 scrollbar-hide">
              {PRODUCTS.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setActiveTab(p.id); setExpandedFaq(null); }}
                  className={`flex items-center gap-1.5 px-3 sm:px-5 py-3.5 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition-colors flex-shrink-0
                    ${activeTab === p.id
                      ? "border-[#155cfc] text-[#155cfc] bg-blue-50/50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
                >
                  <span className="text-base">{p.icon}</span>
                  <span className="hidden sm:inline">{p.label}</span>
                  <span className="sm:hidden text-[10px] font-bold">{p.label.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Product content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-12">
          {/* Downloads */}
          <section>
            <h2 className="text-base sm:text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-black flex-shrink-0" style={{ backgroundColor: product.color }}>↓</span>
              Downloads
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {product.downloads.map(dl => (
                <button
                  key={dl.name}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-[#155cfc] hover:shadow-sm transition-all text-left group bg-white"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors" style={{ backgroundColor: `${product.color}18` }}>
                    <span className="text-sm">📄</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 leading-tight truncate">{dl.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{dl.type} · {dl.size}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Specifications */}
          <section>
            <h2 className="text-base sm:text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-black flex-shrink-0" style={{ backgroundColor: product.color }}>≡</span>
              Specifications
            </h2>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {product.specs.map((s, i) => (
                <div key={s.label} className={`flex justify-between items-center px-4 sm:px-5 py-3.5 gap-4 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"} ${i !== 0 ? "border-t border-gray-100" : ""}`}>
                  <span className="text-sm text-gray-500 font-medium flex-shrink-0">{s.label}</span>
                  <span className="text-sm font-bold text-gray-900 text-right">{s.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-base sm:text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-black flex-shrink-0" style={{ backgroundColor: product.color }}>?</span>
              Frequently Asked Questions
            </h2>
            <div className="space-y-2">
              {product.faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 sm:px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-bold text-gray-900 text-sm pr-4 leading-snug">{faq.q}</span>
                    <span
                      className="font-black text-lg transition-transform flex-shrink-0"
                      style={{ color: product.color, transform: expandedFaq === i ? "rotate(45deg)" : "none" }}
                    >+</span>
                  </button>
                  {expandedFaq === i && (
                    <div className="px-4 sm:px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Contact / Support Ticket */}
        <section className="bg-gray-50 border-t border-gray-100 py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Still need help?</h2>
              <p className="text-gray-500 mt-2 text-sm">Submit a support request and our team will get back to you within 24 hours.</p>
            </div>

            {submitted ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                <h3 className="font-black text-gray-900 text-lg">Ticket Submitted</h3>
                <p className="text-gray-500 text-sm mt-2">{"We'll reach out to you soon."}</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-xs text-[#155cfc] font-bold hover:underline">Submit another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name + Email — stack on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Name *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your name"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#155cfc] bg-white" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Email *</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#155cfc] bg-white" />
                  </div>
                </div>

                {/* Product + Subject — stack on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Product</label>
                    <select value={form.product} onChange={e => setForm(f => ({ ...f, product: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#155cfc] bg-white">
                      <option value="">Select product</option>
                      {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                      <option value="general">General / Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Subject *</label>
                    <input required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      placeholder="Brief subject"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#155cfc] bg-white" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Describe your issue in detail..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#155cfc] bg-white resize-none" />
                </div>

                {submitError && <p className="text-sm text-red-500">{submitError}</p>}

                <button type="submit" disabled={submitting}
                  className="w-full py-3.5 bg-[#155cfc] text-white font-bold rounded-xl hover:bg-[#1249d4] transition-colors shadow-md shadow-blue-200 disabled:opacity-60">
                  {submitting ? "Submitting…" : "Submit Support Request"}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
