'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export type CatalogProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
};

export default function ProductPicker({
  onSelect,
  onClose,
}: {
  onSelect: (product: CatalogProduct) => void;
  onClose: () => void;
}) {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6" onClick={onClose}>
      <div
        className="bg-[#0c0c0c] border border-white/10 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-white/10">
          <h2 className="text-sm font-black text-white mb-3">Place a product</h2>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f2994a]"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <p className="text-gray-500 text-sm p-3">Loading products…</p>
          ) : filtered.length === 0 ? (
            <p className="text-gray-500 text-sm p-3">No products match &quot;{query}&quot;.</p>
          ) : (
            <div className="space-y-1">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelect(p)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-left transition-colors"
                >
                  {p.imageUrl ? (
                    <Image src={p.imageUrl} alt="" width={40} height={40} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-white/5 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.category}</p>
                  </div>
                  <p className="text-sm font-bold text-[#f2994a] shrink-0">₹{p.price.toLocaleString('en-IN')}</p>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="p-3 border-t border-white/10">
          <button onClick={onClose} className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
