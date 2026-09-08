'use client';

import { use, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Quotation } from '@/lib/quotations';
import QuotationForm from '../../QuotationForm';

export default function EditQuotationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    (async () => {
      const token = await user.getIdToken();
      const res = await fetch(`/api/admin/quotations/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to load quotation');
        return;
      }
      setQuotation(data.quotation);
    })();
  }, [user, id]);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!quotation) return <p className="animate-pulse text-gray-500">Loading…</p>;
  return <QuotationForm initial={quotation} />;
}
