'use client';

import React from 'react';
import Link from 'next/link';

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-16 lg:p-24 selection:bg-[#f2994a]/30">
      <div className="max-w-3xl mx-auto">
        <Link href="/orders" className="text-gray-500 hover:text-[#f2994a] text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
          Back to Orders
        </Link>

        <h1 className="text-4xl font-bold mb-10 tracking-tight">Return Policy</h1>

        <div className="space-y-12 text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-white text-lg font-bold mb-4 uppercase tracking-wider">10-Day Returns</h2>
            <p>We offer a 10-day return window for most Xerovolt devices. Items must be in their original packaging and in the same condition that you received them.</p>

            <h3 className="text-xl font-semibold mt-6 mb-2">Warranty Claims</h3>
            <p>All Xerovolt automation products come with a 1-year comprehensive replacement warranty against manufacturing defects.</p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-4 uppercase tracking-wider">Non-Returnable Items</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Installation services once completed</li>
              <li>Customized or modified hardware</li>
              <li>Digital content or software subscriptions</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}