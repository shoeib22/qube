'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Quotation, QuoteStatus } from '@/lib/quotations';
import QuoteDocument from '@/components/quotations/QuoteDocument';

const STATUSES: QuoteStatus[] = ['draft', 'sent', 'accepted', 'rejected'];

export default function QuotationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

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

  async function copyLink() {
    const url = `${window.location.origin}/quote/${id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function deleteQuotation() {
    if (!user || !quotation) return;
    if (!confirm(`Delete quotation ${quotation.quote_number}? This can't be undone.`)) return;
    setDeleting(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/admin/quotations/${quotation.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/dashboard/admin/quotations');
    } catch {
      setError('Failed to delete quotation');
      setDeleting(false);
    }
  }

  if (error) return <p className="text-red-400">{error}</p>;
  if (!quotation) return <p className="animate-pulse text-gray-500">Loading…</p>;
  const q = quotation;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Link href="/dashboard/admin/quotations" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-[#f2994a]">
          ← All quotations
        </Link>
        <Link href={`/dashboard/admin/quotations/${q.id}/edit`} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl">
          Edit
        </Link>
        <button onClick={copyLink} className="px-4 py-2 bg-[#f2994a] text-black text-xs font-bold rounded-xl">
          {copied ? 'Link copied!' : 'Copy customer link'}
        </button>
        <select
          value={q.status}
          onChange={(e) => setStatus(e.target.value as QuoteStatus)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white"
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button
          onClick={deleteQuotation}
          disabled={deleting}
          className="ml-auto px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl disabled:opacity-60"
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>

      <QuoteDocument quotation={q} />
    </div>
  );
}
