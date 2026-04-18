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
      <Header />

      <div className="min-h-screen w-full bg-[var(--graphite)] text-white">

        {/* HERO */}
        <section className="pt-32 pb-10 text-center">
          <h1 className="text-4xl font-bold text-white">Support & Downloads</h1>
          {/* Subtle underline in brand color */}
          <div className="w-20 h-1 bg-[#155cfc] mx-auto mt-4 rounded-full" />
          <p className="text-gray-400 max-w-xl mx-auto mt-6">
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
                <div key={i} className="group rounded-2xl p-6 bg-black/40 border border-white/10 hover:border-[#155cfc]/50 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-[#155cfc]/50 transition-colors">
                      {/* Icon: Changes to #155cfc on Hover */}
                      <d.icon className="w-6 h-6 text-gray-400 group-hover:text-[#155cfc] transition-colors" />
                    </div>
                    {/* Format Badge: Now using #155cfc */}
                    <div className="text-[10px] bg-[#155cfc] text-white px-2 py-1 rounded font-bold uppercase tracking-wider">
                      {d.format}
                    </div>
                  </div>

                  <h3 className="text-white text-lg font-semibold mb-2 group-hover:text-[#155cfc] transition-colors">{d.title}</h3>
                  <p className="text-gray-400 text-sm">{d.description}</p>

                  <div className="flex items-center justify-between mt-6">
                    <span className="text-gray-500 text-xs font-mono">{d.size}</span>
                    {/* Primary Action Button: #155cfc */}
                    <Button className="bg-[#155cfc] text-white rounded-full hover:bg-[#155cfc]/80 transition-all px-5 py-2 text-sm">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {specifications.map((section, i) => (
                <div key={i} className="bg-black/40 border border-white/10 p-6 rounded-2xl hover:border-[#155cfc]/30 transition-colors">
                  <h3 className="text-xl font-semibold text-[#155cfc] pb-4 border-b border-white/10">
                    {section.category}
                  </h3>

                  <div className="space-y-4 mt-6">
                    {section.specs.map((spec, j) => (
                      <div key={j} className="flex flex-col space-y-1">
                        <span className="text-gray-500 text-xs uppercase tracking-widest">{spec.label}</span>
                        <span className="text-white font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button className="bg-transparent border border-[#155cfc] text-[#155cfc] px-8 py-3 rounded-full hover:bg-[#155cfc] hover:text-white transition-all font-semibold">
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
              <div className="w-16 h-16 mx-auto bg-[#155cfc]/10 rounded-2xl flex items-center justify-center mb-4 border border-[#155cfc]/20">
                <HelpCircle className="w-8 h-8 text-[#155cfc]" />
              </div>
              <h2 className="text-3xl font-semibold">Frequently Asked Questions</h2>
            </div>

            {/* Note: Ensure your FAQ component uses the brand color for its accordion triggers/icons */}
            <FAQ items={faqs} />
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}