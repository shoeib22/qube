'use client';

import { useState } from 'react';
import Image from 'next/image';
import { itemLineTotal, Quotation } from '@/lib/quotations';
import { COMPANY } from '@/lib/company';

export default function QuoteDocument({ quotation: q }: { quotation: Quotation }) {
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const markerItems = q.items
    .map((item, i) => ({ item, i }))
    .filter(({ item }) => item.x_pct != null && item.y_pct != null);

  return (
    <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-10">
      <div className="flex items-start justify-between flex-wrap gap-6 pb-8 border-b border-white/10">
        <div className="flex items-start gap-4">
          <Image src={COMPANY.logo} alt="Xerovolt logo" width={600} height={120} className="w-32 h-auto object-contain mt-1" />
          <div>
            <h1 className="text-xl font-black text-white">{COMPANY.name}</h1>
            <p className="text-sm text-gray-400">{COMPANY.tagline}</p>
            <p className="text-sm text-gray-400">{COMPANY.address}</p>
            <p className="text-sm text-gray-400">{COMPANY.email} · {COMPANY.phone}</p>
            {COMPANY.gstin && <p className="text-sm text-gray-400">GSTIN: {COMPANY.gstin}</p>}
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-black text-white">QUOTATION</h2>
          <p className="text-sm text-gray-400">{q.quote_number}</p>
          <p className="text-sm text-gray-400">Issued: {q.issue_date}</p>
          {q.valid_until && <p className="text-sm text-gray-400">Valid until: {q.valid_until}</p>}
        </div>
      </div>

      <div className="py-6 border-b border-white/10">
        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Bill to</p>
        <p className="font-bold text-white">{q.client_name}</p>
        {q.client_company && <p className="text-gray-400">{q.client_company}</p>}
        {q.client_address && <p className="text-gray-400">{q.client_address}</p>}
        {q.client_email && <p className="text-gray-400">{q.client_email}</p>}
        {q.client_phone && <p className="text-gray-400">{q.client_phone}</p>}
      </div>

      {q.plan_image_url && (
        <div className="py-6 border-b border-white/10">
          <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Floor plan</p>
          <div className="relative inline-block w-full max-w-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element -- uploaded plan image, arbitrary size/aspect */}
            <img src={q.plan_image_url} alt="Floor plan" className="w-full h-auto rounded-xl border border-white/10 block" />
            {markerItems.map(({ item, i }) => {
              const active = activeMarker === i;
              return (
                <div
                  key={i}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ left: `${item.x_pct}%`, top: `${item.y_pct}%` }}
                  onMouseEnter={() => setActiveMarker(i)}
                  onMouseLeave={() => setActiveMarker((cur) => (cur === i ? null : cur))}
                >
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-[#f2994a] text-black text-[11px] font-black flex items-center justify-center shadow-lg cursor-pointer">
                    {i + 1}
                  </div>
                  {active && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap bg-black border border-white/20 text-white text-xs rounded-lg px-2 py-1 shadow-xl z-20">
                      {item.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <table className="w-full mt-6 text-sm">
        <thead>
          <tr className="text-left text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/10">
            <th className="pb-3"></th>
            <th className="pb-3">Description</th><th className="pb-3">Qty</th><th className="pb-3">Unit price</th>
            <th className="pb-3">Disc %</th><th className="pb-3">Tax %</th><th className="pb-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {q.items.map((item, i) => (
            <tr key={i} className="border-b border-white/5">
              <td className="py-3 w-10">
                {item.x_pct != null ? (
                  <span className="w-5 h-5 rounded-full bg-[#f2994a] text-black text-[10px] font-black flex items-center justify-center">{i + 1}</span>
                ) : item.image_url ? (
                  <Image src={item.image_url} alt="" width={28} height={28} className="w-7 h-7 rounded object-cover" />
                ) : null}
              </td>
              <td className="py-3 text-white">{item.description}</td>
              <td className="py-3 text-gray-400">{item.qty}</td>
              <td className="py-3 text-gray-400">₹{item.unit_price.toLocaleString('en-IN')}</td>
              <td className="py-3 text-gray-400">{item.discount_pct}</td>
              <td className="py-3 text-gray-400">{item.tax_pct}</td>
              <td className="py-3 text-right text-white">₹{itemLineTotal(item).net.toLocaleString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 ml-auto w-64 space-y-1.5 text-sm">
        <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>₹{q.subtotal.toLocaleString('en-IN')}</span></div>
        <div className="flex justify-between text-gray-400"><span>Discount</span><span>-₹{q.discount_total.toLocaleString('en-IN')}</span></div>
        <div className="flex justify-between text-gray-400"><span>Tax</span><span>₹{q.tax_total.toLocaleString('en-IN')}</span></div>
        <div className="flex justify-between text-white font-black text-base border-t border-white/10 pt-1.5 mt-1.5">
          <span>Total</span><span>₹{q.grand_total.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {q.notes && (
        <div className="mt-8">
          <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Notes</p>
          <p className="text-sm text-gray-400 whitespace-pre-wrap">{q.notes}</p>
        </div>
      )}
      {q.terms && (
        <div className="mt-4">
          <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Terms</p>
          <p className="text-sm text-gray-400 whitespace-pre-wrap">{q.terms}</p>
        </div>
      )}
      {COMPANY.bankDetails && (
        <div className="mt-4">
          <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Payment details</p>
          <p className="text-sm text-gray-400 whitespace-pre-wrap">{COMPANY.bankDetails}</p>
        </div>
      )}
    </div>
  );
}
