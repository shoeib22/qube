import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-10 border-t border-gray-800 text-center text-gray-400 flex flex-col items-center gap-4">
      <p>© 2025 Qube Technologies</p>
      <div className="flex gap-6 text-sm">
        <Link href="/privacy-policy" className="hover:text-white transition-colors">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:text-white transition-colors">
          Terms & Conditions
        </Link>
      </div>
    </footer>
  );
}
