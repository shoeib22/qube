"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface SupportProduct {
  id: string;
  name: string;
  category: string;
  serialPrefix: string | null;
  imageUrl: string | null;
}

interface ProductDocument {
  id: string;
  category: "manual" | "installGuide" | "specSheet" | "software";
  title: string;
  fileType: string;
  fileSize: number;
  downloadUrl: string | null;
}

const CATEGORY_ORDER: ProductDocument["category"][] = ["manual", "installGuide", "specSheet", "software"];
const CATEGORY_LABELS: Record<ProductDocument["category"], string> = {
  manual: "Manuals",
  installGuide: "Install Guides",
  specSheet: "Spec Sheets",
  software: "Software",
};

// Matches serial numbers like "XV-4TP-000123": a prefix (letters/digits/dashes)
// followed by a dash and a trailing numeric unit number.
const SERIAL_PATTERN = /^([A-Za-z0-9-]+)-(\d+)$/;

function findMatches(query: string, products: SupportProduct[]): SupportProduct[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const serialMatch = trimmed.match(SERIAL_PATTERN);
  if (serialMatch) {
    const prefix = serialMatch[1].toLowerCase();
    const bySerial = products.filter((p) => p.serialPrefix?.toLowerCase() === prefix);
    if (bySerial.length > 0) return bySerial;
  }

  const lower = trimmed.toLowerCase();
  return products.filter((p) => p.name.toLowerCase().includes(lower));
}

export default function SupportPage() {
  const [products, setProducts] = useState<SupportProduct[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<SupportProduct | null>(null);
  const [documents, setDocuments] = useState<ProductDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", product: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/support/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []));
  }, []);

  const selectProduct = useCallback(async (p: SupportProduct) => {
    setSelected(p);
    setForm((f) => ({ ...f, product: p.id }));
    setLoadingDocs(true);
    const res = await fetch(`/api/support/documents?productId=${p.id}`);
    const data = await res.json();
    setDocuments(data.documents ?? []);
    setLoadingDocs(false);
  }, []);

  const clearSelection = () => {
    setSelected(null);
    setDocuments([]);
  };

  const matches = useMemo(() => findMatches(query, products), [query, products]);

  useEffect(() => {
    if (matches.length === 1 && matches[0].id !== selected?.id) {
      selectProduct(matches[0]);
    }
  }, [matches, selected, selectProduct]);

  const groupedDocs = CATEGORY_ORDER
    .map((category) => ({ category, docs: documents.filter((d) => d.category === category) }))
    .filter((g) => g.docs.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/support/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", product: "", subject: "", message: "" });
      } else {
        const data = await res.json();
        setSubmitError(data.error ?? "Submission failed");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <section className="bg-[#155cfc] px-6 py-12 md:py-16 text-center">
          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-3">Support Center</p>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">How can we help?</h1>
          <p className="text-blue-100 max-w-lg mx-auto text-sm mb-6">Search by product name or the serial number on your device to find manuals, guides, and software.</p>
          <div className="max-w-md mx-auto">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (selected) clearSelection();
              }}
              placeholder='e.g. "4 Touch-Pro" or "XV-4TP-000123"'
              className="w-full px-5 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-300"
            />
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {!selected && query.trim() && matches.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500 text-sm">{`No products found for "${query}". Try a different name, or submit a request below.`}</p>
            </div>
          )}

          {!selected && matches.length > 1 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{matches.length} products found</p>
              {matches.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectProduct(p)}
                  className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-[#155cfc] hover:shadow-sm transition-all text-left bg-white"
                >
                  {p.imageUrl && (
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image src={p.imageUrl} alt={p.name} fill className="object-contain" />
                    </div>
                  )}
                  <span className="font-bold text-gray-900 text-sm">{p.name}</span>
                </button>
              ))}
            </div>
          )}

          {selected && (
            <div>
              <button onClick={() => { clearSelection(); setQuery(""); }} className="text-xs font-bold text-[#155cfc] hover:underline mb-6">
                ← Search again
              </button>

              <div className="flex items-center gap-4 mb-8">
                {selected.imageUrl && (
                  <div className="relative w-16 h-16 flex-shrink-0 border border-gray-200 rounded-xl overflow-hidden">
                    <Image src={selected.imageUrl} alt={selected.name} fill className="object-contain" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-black text-gray-900">{selected.name}</h2>
                  <p className="text-sm text-gray-500">{selected.category}</p>
                </div>
              </div>

              {loadingDocs ? (
                <p className="text-sm text-gray-500">Loading documents…</p>
              ) : groupedDocs.length === 0 ? (
                <p className="text-sm text-gray-500">{"No documents available for this product yet. Submit a request below and we'll help directly."}</p>
              ) : (
                <div className="space-y-8">
                  {groupedDocs.map(({ category, docs }) => (
                    <section key={category}>
                      <h3 className="text-sm font-black text-gray-900 mb-3">{CATEGORY_LABELS[category]}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {docs.map((d) => (
                          <a
                            key={d.id}
                            href={d.downloadUrl ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-[#155cfc] hover:shadow-sm transition-all bg-white"
                          >
                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm">📄</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-900 leading-tight truncate">{d.title}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{d.fileType.toUpperCase()} · {(d.fileSize / 1024).toFixed(0)} KB</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <section className="bg-gray-50 border-t border-gray-100 py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Still need help?</h2>
              <p className="text-gray-500 mt-2 text-sm">Submit a support request and our team will get back to you within 24 hours.</p>
            </div>

            {submitted ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                <h3 className="font-black text-gray-900 text-lg">Ticket Submitted</h3>
                <p className="text-gray-500 text-sm mt-2">{"We'll reach out to you soon."}</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-xs text-[#155cfc] font-bold hover:underline">Submit another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Name *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your name"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#155cfc] bg-white" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Email *</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#155cfc] bg-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Product</label>
                    <select value={form.product} onChange={e => setForm(f => ({ ...f, product: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#155cfc] bg-white">
                      <option value="">Select product</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      <option value="general">General / Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Subject *</label>
                    <input required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      placeholder="Brief subject"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#155cfc] bg-white" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Describe your issue in detail..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#155cfc] bg-white resize-none" />
                </div>

                {submitError && <p className="text-sm text-red-500">{submitError}</p>}

                <button type="submit" disabled={submitting}
                  className="w-full py-3.5 bg-[#155cfc] text-white font-bold rounded-xl hover:bg-[#1249d4] transition-colors shadow-md shadow-blue-200 disabled:opacity-60">
                  {submitting ? "Submitting…" : "Submit Support Request"}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
