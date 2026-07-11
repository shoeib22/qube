"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  isActive: boolean;
  image: string;
  imageUrl: string;
  serialPrefix: string;
}

interface ProductFormState {
  name: string;
  category: string;
  price: string;
  serialPrefix: string;
  isActive: boolean;
  imageFile: File | null;
}

const EMPTY_FORM: ProductFormState = {
  name: "",
  category: "",
  price: "",
  serialPrefix: "",
  isActive: true,
  imageFile: null,
};

export default function AdminProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const token = await user.getIdToken();
    const res = await fetch("/api/admin/products", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openAddModal = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      serialPrefix: p.serialPrefix,
      isActive: p.isActive,
      imageFile: null,
    });
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setFormError(null);

    const body = new FormData();
    body.append("name", form.name);
    body.append("category", form.category);
    body.append("price", form.price || "0");
    body.append("serialPrefix", form.serialPrefix);
    if (editing) body.append("isActive", String(form.isActive));
    if (form.imageFile) body.append("image", form.imageFile);

    const token = await user.getIdToken();
    const url = editing ? `/api/products/${editing.id}` : "/api/admin/products";
    const res = await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { Authorization: `Bearer ${token}` },
      body,
    });

    if (res.ok) {
      setShowModal(false);
      fetchProducts();
    } else {
      const data = await res.json().catch(() => ({}));
      setFormError(data.error ?? "Save failed");
    }
    setSaving(false);
  };

  const toggleActive = async (p: Product) => {
    if (!user) return;
    setBusyId(p.id);
    const token = await user.getIdToken();
    await fetch(`/api/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    await fetchProducts();
    setBusyId(null);
  };

  const removeProduct = async (p: Product) => {
    if (!user) return;
    if (!confirm(`Remove "${p.name}"? It will be hidden from the storefront but not permanently deleted.`)) return;
    setBusyId(p.id);
    const token = await user.getIdToken();
    await fetch(`/api/products/${p.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchProducts();
    setBusyId(null);
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Product Catalog</h1>
          <p className="text-gray-500 text-sm mt-1">Add, edit, and manage products and their images</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-[#f2994a] text-black font-bold rounded-xl text-sm hover:bg-[#f2994a]/90 transition-colors"
        >
          + Add Product
        </button>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products…"
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white mb-6 focus:outline-none focus:border-[#f2994a]"
      />

      {loading ? (
        <p className="text-gray-500 text-sm animate-pulse">Loading products…</p>
      ) : (
        <div className="border border-white/10 rounded-2xl overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-[#121212] border-b border-white/10 text-gray-400 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                        {p.imageUrl && (
                          <Image src={p.imageUrl} alt={p.name} fill className="object-contain" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-white">{p.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{p.category || "—"}</td>
                  <td className="px-6 py-4 text-gray-400">₹{p.price.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                        p.isActive
                          ? "border-green-500/50 text-green-400 bg-green-500/10"
                          : "border-gray-500/50 text-gray-500 bg-gray-500/10"
                      }`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-xs font-bold">
                      <button onClick={() => openEditModal(p)} className="text-[#f2994a] hover:underline">
                        Edit
                      </button>
                      <button
                        onClick={() => toggleActive(p)}
                        disabled={busyId === p.id}
                        className="text-gray-400 hover:text-white disabled:opacity-50"
                      >
                        {p.isActive ? "Deactivate" : "Reactivate"}
                      </button>
                      {p.isActive && (
                        <button
                          onClick={() => removeProduct(p)}
                          disabled={busyId === p.id}
                          className="text-red-400 hover:text-red-300 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121212] border border-white/10 rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-black text-white mb-6">
              {editing ? `Edit ${editing.name}` : "Add Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f2994a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Category
                  </label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f2994a]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f2994a]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Serial Prefix
                </label>
                <input
                  value={form.serialPrefix}
                  onChange={(e) => setForm((f) => ({ ...f, serialPrefix: e.target.value }))}
                  placeholder="e.g. XV-4TP"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#f2994a]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Image {editing && "(leave empty to keep current)"}
                </label>
                {editing?.imageUrl && !form.imageFile && (
                  <div className="relative w-16 h-16 rounded-lg bg-white/5 border border-white/10 overflow-hidden mb-2">
                    <Image src={editing.imageUrl} alt={editing.name} fill className="object-contain" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm((f) => ({ ...f, imageFile: e.target.files?.[0] ?? null }))}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#f2994a] file:text-black file:font-bold"
                />
              </div>

              {editing && (
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  Active (visible on storefront)
                </label>
              )}

              {formError && <p className="text-sm text-red-400">{formError}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-[#f2994a] text-black font-bold rounded-xl disabled:opacity-60"
                >
                  {saving ? "Saving…" : editing ? "Save Changes" : "Create Product"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="px-6 py-3 border border-white/10 rounded-xl font-bold text-sm hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
