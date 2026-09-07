'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Quotation } from '@/lib/quotations';

const STATUS_STYLE: Record<string, string> = {
  draft: 'bg-white/10 text-gray-300',
  sent: 'bg-yellow-500/20 text-yellow-300',
  accepted: 'bg-emerald-500/20 text-emerald-300',
  rejected: 'bg-red-500/20 text-red-300',
};

export default function QuotationsPage() {
  const { user } = useAuth();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQuotations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/quotations', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load quotations');
      setQuotations(data.quotations);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchQuotations();
  }, [fetchQuotations]);

  return (
    <div>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-white/5 pb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Quotations</h1>
          <p className="text-gray-500 mt-2 font-medium">Client sales quotations — create, track, print.</p>
        </div>
        <Link
          href="/dashboard/admin/quotations/new"
          className="px-5 py-2.5 bg-[#f2994a] text-black font-bold rounded-xl text-sm"
        >
          + New quotation
        </Link>
      </header>

      {loading ? (
        <p className="animate-pulse text-gray-500">Loading quotations...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <div className="space-y-4">
          {quotations.map((q) => (
            <Link
              key={q.id}
              href={`/dashboard/admin/quotations/${q.id}`}
              className="p-8 bg-[#0c0c0c] border border-white/5 rounded-2xl flex flex-wrap items-center justify-between gap-8 group hover:border-[#f2994a]/30 transition-all"
            >
              <div>
                <h4 className="font-bold text-lg text-white">{q.client_name}{q.client_company ? ` · ${q.client_company}` : ''}</h4>
                <p className="text-xs text-gray-500 font-medium">{q.quote_number} · {q.issue_date} · ₹{q.grand_total.toLocaleString('en-IN')}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_STYLE[q.status]}`}>
                {q.status}
              </span>
            </Link>
          ))}
          {quotations.length === 0 && (
            <div className="p-8 text-center text-gray-500 border border-white/5 rounded-2xl">No quotations yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
