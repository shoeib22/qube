"use client";

import { Download, Book, FileText, Video, HelpCircle, Wrench } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/ui/Button";
import FAQ, { FAQItem } from "../../components/FAQ";

// FAQ DATA
const faqs: FAQItem[] = [
  { q: "How often should I replace the filters?", a: "F7 filters should be replaced every 6 months. The app will notify you." },
  { q: "Can I install this myself?", a: "Yes. ECO Pair Plus is designed for DIY installation." },
  { q: "How much energy does it save?", a: "Up to 70% reduction in heating/cooling costs." },
  { q: "Is it noisy?", a: "At just 19 dB(A), it's quieter than a whisper." },
];

export default function SupportPage() {
  
  const downloads = [
    {
      title: "Product Brochure",
      description: "Complete product overview and specifications",
      size: "2.4 MB",
      format: "PDF",
      icon: Book,
    },
    {
      title: "Installation Manual",
      description: "Step-by-step installation guide with diagrams",
      size: "5.1 MB",
      format: "PDF",
      icon: Wrench,
    },
    {
      title: "User Manual",
      description: "Operating instructions and maintenance guide",
      size: "3.8 MB",
      format: "PDF",
      icon: FileText,
    },
    {
      title: "Technical Datasheet",
      description: "Detailed technical specifications and certifications",
      size: "1.2 MB",
      format: "PDF",
      icon: FileText,
    },
    {
      title: "Installation Video",
      description: "Video tutorial for DIY installation",
      size: "45 MB",
      format: "MP4",
      icon: Video,
    },
    {
      title: "App Setup Guide",
      description: "How to connect and configure the mobile app",
      size: "2.1 MB",
      format: "PDF",
      icon: FileText,
    },
  ];

  const specifications = [
    {
      category: "Performance",
      specs: [
        { label: "Airflow Rate", value: "30 m³/h (max)" },
        { label: "Heat Recovery Efficiency", value: "97%" },
        { label: "Sound Pressure Level", value: "19 dB(A)" },
        { label: "Operating Cycle", value: "75s reversible" },
      ],
    },
    {
      category: "Electrical",
      specs: [
        { label: "Power Supply", value: "230V AC, 50/60Hz" },
        { label: "Power Consumption", value: "2–7W" },
        { label: "Standby Power", value: "<0.5W" },
        { label: "Protection Class", value: "Class II" },
      ],
    },
    {
      category: "Environmental",
      specs: [
        { label: "Operating Temperature", value: "-20°C to +50°C" },
        { label: "Humidity Range", value: "10–90% RH" },
        { label: "Storage Temperature", value: "-30°C to +60°C" },
        { label: "IP Rating", value: "IPX4" },
      ],
    },
  ];

  return (
    <>
      {/* HEADER */}
      <Header />

      <div className="min-h-screen w-full bg-[var(--graphite)] text-white">

        {/* HERO */}
        <section className="pt-22 pb-5 text-center">
          <h1 className="text-4xl font-bold text-white">Support & Downloads</h1>
          <p className="text-gray-400 max-w-xl mx-auto mt-4">
            Everything you need to install, operate, and maintain your XEROVOLT system.
          </p>
        </section>

        {/* DOWNLOADS */}
        <section className="py-20 bg-black/30">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-semibold text-center mb-2">Downloads</h2>
            <p className="text-gray-400 text-center mb-12">Manuals, guides, and technical documentation</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {downloads.map((d, i) => (
                <div key={i} className="rounded-2xl p-6 bg-black/40 border border-white/10 hover:border-white/20 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <d.icon className="w-6 h-6 text-orange-400/80" />
                    </div>
                    <div className="text-xs bg-orange-400 text-black px-2 py-1 rounded">
                      {d.format}
                    </div>
                  </div>

                  <h3 className="text-white text-lg font-semibold mb-2">{d.title}</h3>
                  <p className="text-gray-400 text-sm">{d.description}</p>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-gray-500 text-xs">{d.size}</span>
                    <Button className="bg-orange-400/60 text-black rounded-full hover:bg-orange-300 px-4">
                      <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SPECIFICATIONS */}
        <section className="py-20 bg-black/20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-semibold text-center mb-2">Technical Specifications</h2>
            <p className="text-gray-400 text-center mb-12">Full system specifications</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {specifications.map((section, i) => (
                <div key={i} className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold text-white pb-4 border-b border-white/10">
                    {section.category}
                  </h3>

                  <div className="space-y-3 mt-4">
                    {section.specs.map((spec, j) => (
                      <div key={j} className="flex justify-between text-sm">
                        <span className="text-gray-400">{spec.label}</span>
                        <span className="text-white">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button className="bg-orange-400/50 text-black px-8 py-3 rounded-full hover:bg-orange-400">
                <Download className="w-4 h-4 mr-2" />
                Download Full Spec Sheet
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                <HelpCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-3xl font-semibold">Frequently Asked Questions</h2>
            </div>

            <FAQ items={faqs} />
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <Footer />
    </>
  );
}
