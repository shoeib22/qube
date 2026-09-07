'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { computeTotals, emptyItem, Quotation, QuoteItem } from '@/lib/quotations';

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f2994a]';
const labelClass = 'text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5';

export default function QuotationForm({ initial }: { initial?: Quotation }) {
  const router = useRouter();
  const { user } = useAuth();

  const [clientName, setClientName] = useState(initial?.client_name || '');
  const [clientCompany, setClientCompany] = useState(initial?.client_company || '');
  const [clientEmail, setClientEmail] = useState(initial?.client_email || '');
  const [clientPhone, setClientPhone] = useState(initial?.client_phone || '');
  const [clientAddress, setClientAddress] = useState(initial?.client_address || '');
  const [validUntil, setValidUntil] = useState(initial?.valid_until || '');
  const [notes, setNotes] = useState(initial?.notes || '');
  const [terms, setTerms] = useState(
    initial?.terms || 'Prices in INR. Quotation valid for the period stated above. 50% advance to confirm.'
  );
  const [items, setItems] = useState<QuoteItem[]>(initial?.items?.length ? initial.items : [emptyItem()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const totals = computeTotals(items);

  function updateItem(i: number, patch: Partial<QuoteItem>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function save() {
    if (!user) return;
    setSaving(true);
    setError('');
    try {
      const token = await user.getIdToken();
      const payload = {
        status: initial?.status || 'draft',
        issue_date: initial?.issue_date || new Date().toISOString().slice(0, 10),
        valid_until: validUntil || null,
        client_name: clientName,
        client_company: clientCompany || null,
        client_email: clientEmail || null,
        client_phone: clientPhone || null,
        client_address: clientAddress || null,
        items,
        notes: notes || null,
        terms: terms || null,
      };
      const url = initial ? `/api/admin/quotations/${initial.id}` : '/api/admin/quotations';
      const res = await fetch(url, {
        method: initial ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save quotation');
      router.push(`/dashboard/admin/quotations/${data.quotation.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-black tracking-tight text-white mb-8">
        {initial ? `Edit ${initial.quote_number}` : 'New Quotation'}
      </h1>
      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-8 mb-6">
        <h2 className="text-sm font-black text-white mb-4">Client</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Name</label>
            <input className={inputClass} value={clientName} onChange={(e) => setClientName(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Company</label>
            <input className={inputClass} value={clientCompany} onChange={(e) => setClientCompany(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input className={inputClass} value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input className={inputClass} value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Address</label>
            <input className={inputClass} value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Valid until</label>
            <input
              type="date"
              className={inputClass}
              value={validUntil || ''}
              onChange={(e) => setValidUntil(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-8 mb-6">
        <h2 className="text-sm font-black text-white mb-4">Line items</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
            <span>Description</span><span>Qty</span><span>Unit price</span><span>Disc %</span><span>Tax %</span><span>Total</span><span></span>
          </div>
          {items.map((item, i) => {
            const line = computeTotals([item]).grand_total;
            return (
              <div key={i} className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 items-center">
                <input className={inputClass} value={item.description} onChange={(e) => updateItem(i, { description: e.target.value })} />
                <input type="number" min={0} className={inputClass} value={item.qty} onChange={(e) => updateItem(i, { qty: Number(e.target.value) })} />
                <input type="number" min={0} step="0.01" className={inputClass} value={item.unit_price} onChange={(e) => updateItem(i, { unit_price: Number(e.target.value) })} />
                <input type="number" min={0} max={100} className={inputClass} value={item.discount_pct} onChange={(e) => updateItem(i, { discount_pct: Number(e.target.value) })} />
                <input type="number" min={0} max={100} className={inputClass} value={item.tax_pct} onChange={(e) => updateItem(i, { tax_pct: Number(e.target.value) })} />
                <span className="text-sm text-gray-400 text-right">{line.toFixed(2)}</span>
                {items.length > 1 && (
                  <button onClick={() => removeItem(i)} className="text-red-400 text-sm font-bold px-2">✕</button>
                )}
              </div>
            );
          })}
        </div>
        <button
          onClick={() => setItems((prev) => [...prev, emptyItem()])}
          className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl"
        >
          + Add item
        </button>

        <div className="mt-6 ml-auto w-64 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>₹{totals.subtotal.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between text-gray-400"><span>Discount</span><span>-₹{totals.discount_total.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between text-gray-400"><span>Tax</span><span>₹{totals.tax_total.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between text-white font-black text-base border-t border-white/10 pt-1.5 mt-1.5">
            <span>Total</span><span>₹{totals.grand_total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-8 mb-6">
        <h2 className="text-sm font-black text-white mb-4">Notes & terms</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Notes</label>
            <textarea rows={2} className={inputClass} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Terms</label>
            <textarea rows={2} className={inputClass} value={terms} onChange={(e) => setTerms(e.target.value)} />
          </div>
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving || !clientName || items.length === 0}
        className="px-6 py-3 bg-[#f2994a] text-black font-bold rounded-xl disabled:opacity-60"
      >
        {saving ? 'Saving…' : initial ? 'Save changes' : 'Create quotation'}
      </button>
    </div>
  );
}
