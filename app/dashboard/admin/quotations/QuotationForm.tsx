'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { computeTotals, emptyItem, FloorPlan, Quotation, QuoteItem } from '@/lib/quotations';
import QuickAddItem from '@/components/quotations/QuickAddItem';
import AddFloorPlan from '@/components/quotations/AddFloorPlan';

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
  const [showDiscount, setShowDiscount] = useState(initial?.show_discount ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(initial?.floor_plans ?? []);
  const [activeFloorId, setActiveFloorId] = useState<string | null>(initial?.floor_plans?.[0]?.id ?? null);
  const [addingFloor, setAddingFloor] = useState(false);
  const [pendingPoint, setPendingPoint] = useState<{ x_pct: number; y_pct: number } | null>(null);
  const [activeMarker, setActiveMarker] = useState<number | null>(null);

  const totals = computeTotals(items);
  const activeFloor = floorPlans.find((f) => f.id === activeFloorId) ?? null;
  const markerItems = items
    .map((item, i) => ({ item, i }))
    .filter(({ item }) => item.floor_id === activeFloorId && item.x_pct != null && item.y_pct != null);

  function updateItem(i: number, patch: Partial<QuoteItem>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function addFloor(label: string, file: File) {
    if (!user || !initial) return;
    setError('');
    const token = await user.getIdToken();
    const body = new FormData();
    body.append('plan', file);
    body.append('label', label);
    const res = await fetch(`/api/admin/quotations/${initial.id}/plan`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload floor plan');
    const newFloors: FloorPlan[] = data.quotation.floor_plans;
    setFloorPlans(newFloors);
    setActiveFloorId(newFloors[newFloors.length - 1].id);
    setAddingFloor(false);
  }

  function removeFloor(floorId: string) {
    const floor = floorPlans.find((f) => f.id === floorId);
    if (!floor) return;
    if (!confirm(`Remove "${floor.label}"? Products placed on it will become unplaced line items, not deleted.`)) return;
    setFloorPlans((prev) => prev.filter((f) => f.id !== floorId));
    setItems((prev) =>
      prev.map((it) => (it.floor_id === floorId ? { ...it, floor_id: null, x_pct: null, y_pct: null } : it))
    );
    setActiveFloorId((prev) => (prev === floorId ? floorPlans.find((f) => f.id !== floorId)?.id ?? null : prev));
  }

  function handlePlanClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!activeFloorId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x_pct = ((e.clientX - rect.left) / rect.width) * 100;
    const y_pct = ((e.clientY - rect.top) / rect.height) * 100;
    setPendingPoint({ x_pct, y_pct });
  }

  async function uploadItemImage(file: File) {
    if (!user || !initial) throw new Error('Save the quotation first');
    const token = await user.getIdToken();
    const body = new FormData();
    body.append('image', file);
    const res = await fetch(`/api/admin/quotations/${initial.id}/item-image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload photo');
    return data.url as string;
  }

  function placeItem(item: { description: string; unit_price: number; image_url: string | null }) {
    if (!pendingPoint || !activeFloorId) return;
    setItems((prev) => [
      ...prev,
      {
        description: item.description,
        qty: 1,
        unit_price: item.unit_price,
        discount_pct: 0,
        tax_pct: 0,
        product_id: null,
        image_url: item.image_url,
        floor_id: activeFloorId,
        x_pct: pendingPoint.x_pct,
        y_pct: pendingPoint.y_pct,
      },
    ]);
    setPendingPoint(null);
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
        show_discount: showDiscount,
        ...(initial ? { floor_plans: floorPlans } : {}),
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
        <h2 className="text-sm font-black text-white mb-1">Floor plans</h2>
        {!initial ? (
          <p className="text-sm text-gray-500">Save the quotation first, then come back here to upload plans and place products on them.</p>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">Add one plan per floor if needed, then click anywhere on the active one to place a priced product.</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {floorPlans.map((floor) => (
                <div
                  key={floor.id}
                  className={`flex items-center gap-2 pl-4 pr-2 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    activeFloorId === floor.id ? 'bg-[#f2994a] text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                  onClick={() => setActiveFloorId(floor.id)}
                >
                  {floor.label}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFloor(floor.id); }}
                    className={activeFloorId === floor.id ? 'text-black/60 hover:text-black' : 'text-gray-500 hover:text-red-400'}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() => setAddingFloor(true)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl"
              >
                + Add floor
              </button>
            </div>

            {activeFloor && (
              <div
                className="relative inline-block w-full max-w-2xl cursor-crosshair"
                onClick={handlePlanClick}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- uploaded plan image, arbitrary size/aspect */}
                <img src={activeFloor.image_url} alt={activeFloor.label} className="w-full h-auto rounded-xl border border-white/10 block select-none" draggable={false} />
                {markerItems.map(({ item, i }, n) => {
                  const active = activeMarker === i;
                  return (
                    <div
                      key={i}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                      style={{ left: `${item.x_pct}%`, top: `${item.y_pct}%` }}
                      onMouseEnter={() => setActiveMarker(i)}
                      onMouseLeave={() => setActiveMarker((cur) => (cur === i ? null : cur))}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-[#f2994a] text-black text-[11px] font-black flex items-center justify-center shadow-lg">
                        {n + 1}
                      </div>
                      {active && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap bg-black border border-white/20 text-white text-xs rounded-lg px-2 py-1 shadow-xl z-20 flex items-center gap-2">
                          {item.description}
                          <button onClick={() => removeItem(i)} className="text-red-400 font-bold">✕</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {addingFloor && <AddFloorPlan onAdd={addFloor} onClose={() => setAddingFloor(false)} />}
      {pendingPoint && (
        <QuickAddItem onAdd={placeItem} onClose={() => setPendingPoint(null)} uploadImage={uploadItemImage} />
      )}

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
                <div className="flex items-center gap-2">
                  {item.x_pct != null && (
                    <span className="w-5 h-5 shrink-0 rounded-full bg-[#f2994a] text-black text-[10px] font-black flex items-center justify-center">●</span>
                  )}
                  <input className={inputClass} value={item.description} onChange={(e) => updateItem(i, { description: e.target.value })} />
                </div>
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
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setItems((prev) => [...prev, emptyItem()])}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl"
          >
            + Add item
          </button>
          <label className="flex items-center gap-2 text-xs font-bold text-gray-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showDiscount}
              onChange={(e) => setShowDiscount(e.target.checked)}
              className="accent-[#f2994a] w-4 h-4"
            />
            Show discount to customer
          </label>
        </div>

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
