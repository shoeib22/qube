// app/dashboard/admin/documents/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface SupportProduct {
  id: string;
  name: string;
  category: string;
  serialPrefix: string | null;
  imageUrl: string | null;
}

interface ProductDocument {
  id: string;
  productId: string;
  productName: string;
  category: "manual" | "installGuide" | "specSheet" | "software";
  title: string;
  storagePath: string;
  fileType: string;
  fileSize: number;
}

const CATEGORY_LABELS: Record<ProductDocument["category"], string> = {
  manual: "Manual",
  installGuide: "Install Guide",
  specSheet: "Spec Sheet",
  software: "Software",
};

export default function AdminDocumentsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<SupportProduct[]>([]);
  const [productQuery, setProductQuery] = useState("");
  const [selected, setSelected] = useState<SupportProduct | null>(null);
  const [serialPrefixInput, setSerialPrefixInput] = useState("");
  const [savingPrefix, setSavingPrefix] = useState(false);

  const [documents, setDocuments] = useState<ProductDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const [uploadCategory, setUploadCategory] = useState<ProductDocument["category"]>("manual");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/support/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []));
  }, []);

  const fetchDocuments = useCallback(async (productId: string) => {
    if (!user) return;
    setLoadingDocs(true);
    const token = await user.getIdToken();
    const res = await fetch(`/api/admin/documents?productId=${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setDocuments(data.documents ?? []);
    setLoadingDocs(false);
  }, [user]);

  const selectProduct = (p: SupportProduct) => {
    setSelected(p);
    setSerialPrefixInput(p.serialPrefix ?? "");
    fetchDocuments(p.id);
  };

  const saveSerialPrefix = async () => {
    if (!user || !selected) return;
    setSavingPrefix(true);
    const token = await user.getIdToken();
    await fetch(`/api/products/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ serialPrefix: serialPrefixInput }),
    });
    setSelected({ ...selected, serialPrefix: serialPrefixInput });
    setSavingPrefix(false);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selected || !uploadFile) return;
    setUploading(true);
    setUploadError(null);

    const token = await user.getIdToken();
    const body = new FormData();
    body.append("file", uploadFile);
    body.append("productId", selected.id);
    body.append("productName", selected.name);
    body.append("category", uploadCategory);
    body.append("title", uploadTitle);

    const res = await fetch("/api/admin/documents", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body,
    });

    if (res.ok) {
      setUploadTitle("");
      setUploadFile(null);
      fetchDocuments(selected.id);
    } else {
      const data = await res.json();
      setUploadError(data.error ?? "Upload failed");
    }
    setUploading(false);
  };

  const deleteDocument = async (docId: string) => {
    if (!user || !selected) return;
    const token = await user.getIdToken();
    await fetch(`/api/admin/documents/${docId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchDocuments(selected.id);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight text-white">Support Documents</h1>
        <p className="text-gray-500 text-sm mt-1">Upload manuals, install guides, spec sheets, and software for each product</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div>
          <input
            value={productQuery}
            onChange={(e) => setProductQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white mb-3 focus:outline-none focus:border-[#f2994a]"
          />
          <div className="space-y-1 max-h-[60vh] overflow-y-auto">
            {filteredProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => selectProduct(p)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  selected?.id === p.id ? "bg-[#f2994a] text-black" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {p.name}
                {p.serialPrefix && <span className="block text-[10px] font-mono opacity-60">{p.serialPrefix}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {!selected ? (
            <div className="text-gray-600 text-sm py-20 text-center">Select a product to manage its documents</div>
          ) : (
            <div className="space-y-8">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Serial Prefix</label>
                <div className="flex gap-2">
                  <input
                    value={serialPrefixInput}
                    onChange={(e) => setSerialPrefixInput(e.target.value)}
                    placeholder="e.g. XV-4TP"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#f2994a]"
                  />
                  <button
                    onClick={saveSerialPrefix}
                    disabled={savingPrefix}
                    className="px-5 py-2.5 bg-[#f2994a] text-black font-bold rounded-xl text-sm disabled:opacity-60"
                  >
                    {savingPrefix ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-black text-white mb-3">Documents for {selected.name}</h2>
                {loadingDocs ? (
                  <div className="text-gray-600 text-sm">Loading…</div>
                ) : documents.length === 0 ? (
                  <div className="text-gray-600 text-sm">No documents uploaded yet</div>
                ) : (
                  <div className="space-y-2 mb-6">
                    {documents.map((d) => (
                      <div key={d.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                        <div>
                          <p className="text-sm font-bold text-white">{d.title}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            {CATEGORY_LABELS[d.category]} · {d.fileType.toUpperCase()} · {(d.fileSize / 1024).toFixed(0)} KB
                          </p>
                        </div>
                        <button
                          onClick={() => deleteDocument(d.id)}
                          className="text-xs font-bold text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <form onSubmit={handleUpload} className="space-y-3 border-t border-white/10 pt-6">
                <h2 className="text-sm font-black text-white">Upload New Document</h2>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as ProductDocument["category"])}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f2994a]"
                  >
                    <option value="manual">Manual</option>
                    <option value="installGuide">Install Guide</option>
                    <option value="specSheet">Spec Sheet</option>
                    <option value="software">Software</option>
                  </select>
                  <input
                    required
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="Title, e.g. Installation Guide v2"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f2994a]"
                  />
                </div>
                <input
                  required
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#f2994a] file:text-black file:font-bold"
                />
                {uploadError && <p className="text-sm text-red-400">{uploadError}</p>}
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-3 bg-[#f2994a] text-black font-bold rounded-xl disabled:opacity-60"
                >
                  {uploading ? "Uploading…" : "Upload Document"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
