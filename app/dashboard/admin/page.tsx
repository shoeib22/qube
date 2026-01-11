'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import RequireAuth from '../../../components/auth/RequireAuth';
import { auth } from '../../../lib/firebase';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  isActive: boolean;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const kpis = [
    { label: 'Total Revenue', value: '₹0', trend: '0%', color: 'text-grey-500' },
    { label: 'Active Orders', value: '0', trend: '0 Pending', color: 'text-grey-500' },
    { label: 'Total Products', value: products.length.toString(), trend: `${products.filter(p => p.isActive).length} active`, color: 'text-blue-500' },
    { label: 'Total Customers', value: '0', trend: '0 this month', color: 'text-grey-500' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search and category
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch('/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
        setFilteredProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchProducts(); // Refresh list
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <RequireAuth requireAdmin>
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2 font-medium">Monitoring the Qube ecosystem performance.</p>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {kpis.map((kpi, i) => (
            <div key={i} className="p-8 bg-[#0c0c0c] border border-white/5 rounded-2xl hover:border-white/10 transition-all">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-4">{kpi.label}</p>
              <h2 className="text-3xl font-bold mb-2">{kpi.value}</h2>
              <p className={`text-xs font-bold ${kpi.color}`}>{kpi.trend}</p>
            </div>
          ))}
        </div>

        {/* Product Management Section */}
        <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl overflow-hidden shadow-2xl mb-12">
          <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-bold text-lg">Product Management</h3>
              <p className="text-sm text-gray-500 mt-1">{filteredProducts.length} products found</p>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowProductModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#f2994a] text-black text-sm font-black uppercase tracking-widest rounded-lg hover:bg-white transition-colors"
            >
              <Plus size={16} /> Add Product
            </button>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#f2994a]"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#f2994a]"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 border-4 border-[#f2994a] border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No products found
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-widest text-gray-600 border-b border-white/5">
                    <th className="p-6">Name</th>
                    <th className="p-6">Category</th>
                    <th className="p-6">Price</th>
                    <th className="p-6">Status</th>
                    <th className="p-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                      <td className="p-6 font-bold text-white/90">{product.name}</td>
                      <td className="p-6 text-gray-500">{product.category}</td>
                      <td className="p-6 font-black text-[#f2994a]">
                        {product.price ? `₹${product.price.toLocaleString()}` : 'TBD'}
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border ${product.isActive
                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setShowProductModal(true);
                            }}
                            className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-lg">Live Order Stream</h3>
            <button className="text-xs font-black uppercase tracking-widest text-[#f2994a]">View All Orders</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-600 border-b border-white/5">
                  <th className="p-8">ID</th>
                  <th className="p-8">Customer</th>
                  <th className="p-8">Product</th>
                  <th className="p-8">Amount</th>
                  <th className="p-8">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[1, 2, 3].map((_, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                    <td className="p-8 font-mono text-gray-400">#QB-10{i}</td>
                    <td className="p-8 font-bold text-white/90">Kashif User</td>
                    <td className="p-8 text-gray-500">Qube Smart Hub Pro</td>
                    <td className="p-8 font-black text-[#f2994a]">₹0</td>
                    <td className="p-8">
                      <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase rounded-full border border-green-500/20">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
          onSave={() => {
            setShowProductModal(false);
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )}
    </RequireAuth>
  );
}

function ProductModal({
  product,
  onClose,
  onSave
}: {
  product: Product | null,
  onClose: () => void,
  onSave: () => void
}) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    price: product?.price || 0,
    image: product?.image || '',
    isActive: product?.isActive ?? true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await auth.currentUser?.getIdToken();
      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products';
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSave();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#121212] border border-gray-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f2994a] mt-2"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Smart Lighting, Plugs & IR"
              className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f2994a] mt-2"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Price (₹)</label>
            <input
              type="number"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              min="0"
              step="0.01"
              className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f2994a] mt-2"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Image URL</label>
            <input
              type="text"
              value={formData.image}
              onChange={e => setFormData({ ...formData, image: e.target.value })}
              placeholder="/images/products/product-name.png"
              className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f2994a] mt-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="isActive" className="text-sm text-gray-400">Product is active (visible in shop)</label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#f2994a] text-black py-3 rounded-xl font-bold hover:bg-white transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-700 rounded-xl font-bold hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}