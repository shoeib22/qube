'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { Quotation } from '@/lib/quotations';
import { COMPANY } from '@/lib/company';
import QuoteDocument from '@/components/quotations/QuoteDocument';

// Public — no login required. Shared directly with the customer as a link.
export default function PublicQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/quote/${id}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || 'Quotation not found');
        setQuotation(data.quotation);
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, [id]);

  return (
    <main className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Image src={COMPANY.logo} alt="Xerovolt logo" width={600} height={120} className="w-28 h-auto object-contain" />
        </div>

        {error ? (
          <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-10 text-center text-gray-400">{error}</div>
        ) : !quotation ? (
          <p className="animate-pulse text-gray-500">Loading…</p>
        ) : (
          <QuoteDocument quotation={quotation} />
        )}

        <p className="text-center text-xs text-gray-600 mt-8">
          Questions about this quotation? Contact {COMPANY.name} at {COMPANY.email} or {COMPANY.phone}.
        </p>
      </div>
    </main>
  );
}
