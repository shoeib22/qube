"use client";

import { Mail, Phone, MapPin, Send } from "lucide-react";
import Button from "../../components/ui/Button";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ContactPage() {
  return (
    <>
      {/* FIXED HEADER */}
      <Header />

      <main className="min-h-screen bg-black text-white pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">

          {/* PAGE HEADER */}
          <div className="text-center mb-20">
            <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Have questions about our products or smart home solutions?
              Our team is here to help you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* LEFT INFO */}
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-[#ec8e45]" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-400">support@qubetech.in</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-[#ec8e45]" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-400">+91 9XXXXXXXXX</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-[#ec8e45]" />
                    <div>
                      <p className="font-medium">Office</p>
                      <p className="text-gray-400">
                        qubeTech Smart Systems<br />
                        Hyderabad, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* MAP PLACEHOLDER */}
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#121212] h-64 flex items-center justify-center text-gray-500">
                Google Map Embed
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="bg-[#121212] border border-white/10 rounded-3xl p-10">
              <h2 className="text-2xl font-semibold mb-8">Send us a Message</h2>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm mb-2 text-gray-400">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#ec8e45]"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-400">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#ec8e45]"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-400">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#ec8e45]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#ec8e45] text-black hover:bg-[#e07f34] rounded-full py-3 text-lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </>
  );
}
