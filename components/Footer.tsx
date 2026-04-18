import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#030303] border-t border-white/10 pt-24 pb-10 overflow-hidden relative z-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Call-to-Action */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-24 gap-8">
          <h2 className="text-3xl md:text-5xl font-light text-white text-center md:text-left">
            Are you ready for the <br />
            <span className="font-medium text-blue-500">Xerovolt experience?</span>
          </h2>
          <Link href="/contact">
            <button className="bg-white text-black px-8 py-4 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors whitespace-nowrap">
              Get in touch
            </button>
          </Link>
        </div>

        {/* Giant Background Typography */}
        <div className="w-full flex justify-center mb-20 select-none pointer-events-none">
          <h1 className="text-[15vw] leading-none font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent">
            XEROVOLT
          </h1>
        </div>

        {/* Links and Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-zinc-400 mb-16">
          
          {/* Contact Details */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-start gap-4 hover:text-white transition-colors">
              <MapPin className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <span className="text-white font-medium block mb-1">Xerovolt Innovations</span>
                A Qube Technologies Brand <br />
                Hyderabad, Telangana
              </p>
            </div>
            <div className="flex items-center gap-4 hover:text-white transition-colors">
              <Phone className="w-5 h-5 text-zinc-500 shrink-0" />
              <p>+91 99666 25599</p>
            </div>
            <div className="flex items-center gap-4 hover:text-white transition-colors">
              <Mail className="w-5 h-5 text-zinc-500 shrink-0" />
              <p>info@xerovolt.in</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="space-y-4">
            <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-xs">Menu</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link href="/services" className="hover:text-blue-400 transition-colors">Solutions</Link></li>
              <li><Link href="/support" className="hover:text-blue-400 transition-colors">Support</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-xs">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="p-3 rounded-full bg-white/5 hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-3 rounded-full bg-white/5 hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-3 rounded-full bg-white/5 hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-3 rounded-full bg-white/5 hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-xs">
          <p>&copy; {new Date().getFullYear()} Xerovolt. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}