import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-white/10 pt-16 pb-12">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col items-center justify-center">

        {/* Links Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-sm text-gray-400 mb-8 font-medium tracking-wide">
          <Link href="/privacy-policy" className="hover:text-[#ff7a3d] transition-colors duration-300 flex items-center h-full">
            Privacy Policy
          </Link>
          <span className="hidden md:block w-px h-4 bg-gray-800 self-center"></span>
          <Link href="/terms" className="hover:text-[#ff7a3d] transition-colors duration-300 flex items-center h-full">
            Terms & Conditions
          </Link>
          <span className="hidden md:block w-px h-4 bg-gray-800 self-center"></span>
          <Link href="/support" className="hover:text-[#ff7a3d] transition-colors duration-300 flex items-center h-full">
            Support
          </Link>
        </div>

        {/* Subtle Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent max-w-2xl mb-8"></div>

        {/* Copyright */}
        <p className="text-xs text-gray-600 tracking-wider uppercase">
          © 2025 Qube Technologies. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
