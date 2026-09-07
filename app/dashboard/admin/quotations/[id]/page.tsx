'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { itemLineTotal, Quotation, QuoteStatus } from '@/lib/quotations';
import { COMPANY } from '@/lib/company';

const STATUSES: QuoteStatus[] = ['draft', 'sent', 'accepted', 'rejected'];

export default function QuotationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [error, setError] = useState('');

  async function refresh() {
    if (!user) return;
    const token = await user.getIdToken();
    const res = await fetch(`/api/admin/quotations/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed to load quotation');
      return;
    }
    setQuotation(data.quotation);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id]);

  async function setStatus(status: QuoteStatus) {
    if (!user || !quotation) return;
    const token = await user.getIdToken();
    const res = await fetch(`/api/admin/quotations/${quotation.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (res.ok) setQuotation(data.quotation);
  }

  if (error) return <p className="text-red-400">{error}</p>;
  if (!quotation) return <p className="animate-pulse text-gray-500">Loading…</p>;
  const q = quotation;

  return (
    <div>
      <div className="print:hidden flex flex-wrap items-center gap-3 mb-8">
        <Link href="/dashboard/admin/quotations" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-[#f2994a]">
          ← All quotations
        </Link>
        <Link href={`/dashboard/admin/quotations/${q.id}/edit`} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl">
          Edit
        </Link>
        <button onClick={() => window.print()} className="px-4 py-2 bg-[#f2994a] text-black text-xs font-bold rounded-xl">
          Print / Save as PDF
        </button>
        <select
          value={q.status}
          onChange={(e) => setStatus(e.target.value as QuoteStatus)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white"
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-10 print:bg-white print:border-none print:rounded-none print:p-0 print:text-black">
        <div className="flex items-start justify-between flex-wrap gap-6 pb-8 border-b border-white/10 print:border-gray-300">
          <div className="flex items-start gap-4">
            <Image src={COMPANY.logo} alt="Xerovolt logo" width={600} height={120} className="w-32 h-auto object-contain mt-1" />
            <div>
              <h1 className="text-xl font-black text-white print:text-black">{COMPANY.name}</h1>
              <p className="text-sm text-gray-400 print:text-gray-600">{COMPANY.tagline}</p>
              <p className="text-sm text-gray-400 print:text-gray-600">{COMPANY.address}</p>
              <p className="text-sm text-gray-400 print:text-gray-600">{COMPANY.email} · {COMPANY.phone}</p>
              {COMPANY.gstin && <p className="text-sm text-gray-400 print:text-gray-600">GSTIN: {COMPANY.gstin}</p>}
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black text-white print:text-black">QUOTATION</h2>
            <p className="text-sm text-gray-400 print:text-gray-600">{q.quote_number}</p>
            <p className="text-sm text-gray-400 print:text-gray-600">Issued: {q.issue_date}</p>
            {q.valid_until && <p className="text-sm text-gray-400 print:text-gray-600">Valid until: {q.valid_until}</p>}
          </div>
        </div>

        <div className="py-6 border-b border-white/10 print:border-gray-300">
          <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Bill to</p>
          <p className="font-bold text-white print:text-black">{q.client_name}</p>
          {q.client_company && <p className="text-gray-400 print:text-gray-600">{q.client_company}</p>}
          {q.client_address && <p className="text-gray-400 print:text-gray-600">{q.client_address}</p>}
          {q.client_email && <p className="text-gray-400 print:text-gray-600">{q.client_email}</p>}
          {q.client_phone && <p className="text-gray-400 print:text-gray-600">{q.client_phone}</p>}
        </div>

        <table className="w-full mt-6 text-sm">
          <thead>
            <tr className="text-left text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/10 print:border-gray-300">
              <th className="pb-3">Description</th><th className="pb-3">Qty</th><th className="pb-3">Unit price</th>
              <th className="pb-3">Disc %</th><th className="pb-3">Tax %</th><th className="pb-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {q.items.map((item, i) => (
              <tr key={i} className="border-b border-white/5 print:border-gray-200">
                <td className="py-3 text-white print:text-black">{item.description}</td>
                <td className="py-3 text-gray-400 print:text-gray-600">{item.qty}</td>
                <td className="py-3 text-gray-400 print:text-gray-600">₹{item.unit_price.toLocaleString('en-IN')}</td>
                <td className="py-3 text-gray-400 print:text-gray-600">{item.discount_pct}</td>
                <td className="py-3 text-gray-400 print:text-gray-600">{item.tax_pct}</td>
                <td className="py-3 text-right text-white print:text-black">₹{itemLineTotal(item).net.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 ml-auto w-64 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-400 print:text-gray-600"><span>Subtotal</span><span>₹{q.subtotal.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between text-gray-400 print:text-gray-600"><span>Discount</span><span>-₹{q.discount_total.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between text-gray-400 print:text-gray-600"><span>Tax</span><span>₹{q.tax_total.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between text-white print:text-black font-black text-base border-t border-white/10 print:border-gray-300 pt-1.5 mt-1.5">
            <span>Total</span><span>₹{q.grand_total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {q.notes && (
          <div className="mt-8">
            <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Notes</p>
            <p className="text-sm text-gray-400 print:text-gray-600 whitespace-pre-wrap">{q.notes}</p>
          </div>
        )}
        {q.terms && (
          <div className="mt-4">
            <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Terms</p>
            <p className="text-sm text-gray-400 print:text-gray-600 whitespace-pre-wrap">{q.terms}</p>
          </div>
        )}
        {COMPANY.bankDetails && (
          <div className="mt-4">
            <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Payment details</p>
            <p className="text-sm text-gray-400 print:text-gray-600 whitespace-pre-wrap">{COMPANY.bankDetails}</p>
          </div>
        )}
      </div>
    </div>
  );
}
