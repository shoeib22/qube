"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Package,
  User,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  ExternalLink,
  CreditCard,
  Clock,
  Plus,
  Trash2,
  Edit,
  Check
} from "lucide-react";

// Import Auth Wrapper
import RequireAuth from "../../../components/auth/RequireAuth";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../lib/supabase";

interface Address {
  id: string;
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export default function UserAccountPage() {
  const [activeTab, setActiveTab] = useState("orders");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const { user, logout } = useAuth();

  const fetchAddresses = useCallback(async () => {
    setLoadingAddresses(true);
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/addresses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAddresses(data.addresses);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  }, []);

  // Fetch addresses when addresses tab is active
  useEffect(() => {
    if (activeTab === "addresses" && user) {
      fetchAddresses();
    }
  }, [activeTab, user, fetchAddresses]);

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const token = await user?.getIdToken();
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setAddresses(addresses.filter(addr => addr.id !== id));
      } else {
        alert('Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Error deleting address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(`/api/addresses/${id}/set-default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Update local state
        setAddresses(addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === id
        })));
      } else {
        alert('Failed to set default address');
      }
    } catch (error) {
      console.error('Error setting default:', error);
      alert('Error setting default address');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 flex flex-col">
        <Header />

        <main className="flex-grow pt-24 pb-12 px-4 md:px-10 max-w-7xl mx-auto w-full">

          <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">

            {/* --- SIDEBAR NAV --- */}
            <aside className="lg:w-72 flex-shrink-0">
              <div className="bg-[#121212] border border-gray-800 rounded-3xl p-6 sticky top-28">
                {/* User Profile Summary */}
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-800">
                  <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-900/20">
                    {user?.email?.[0].toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{user?.displayName || 'User'}</h3>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-2">
                  <NavButton
                    active={activeTab === "orders"}
                    onClick={() => setActiveTab("orders")}
                    icon={<Package size={20} />}
                    label="My Orders"
                  />
                  <NavButton
                    active={activeTab === "profile"}
                    onClick={() => setActiveTab("profile")}
                    icon={<User size={20} />}
                    label="Profile Details"
                  />
                  <NavButton
                    active={activeTab === "addresses"}
                    onClick={() => setActiveTab("addresses")}
                    icon={<MapPin size={20} />}
                    label="Saved Addresses"
                  />
                  <NavButton
                    active={activeTab === "settings"}
                    onClick={() => setActiveTab("settings")}
                    icon={<Settings size={20} />}
                    label="Account Settings"
                  />

                  <div className="pt-4 mt-4 border-t border-gray-800">
                    <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                      <LogOut size={20} />
                      <span className="ml-3 font-medium">Sign Out</span>
                    </button>
                  </div>
                </nav>
              </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 min-w-0">

              {/* TAB: MY ORDERS */}
              {activeTab === "orders" && (
                <div className="space-y-6 animate-fade-in">
                  <h1 className="text-2xl font-bold mb-6">Order History</h1>

                  {/* Mock Order Card 1 */}
                  <OrderCard
                    id="#ORD-7721"
                    date="Oct 24, 2025"
                    total="₹ 5,000"
                    status="Delivered"
                    items={["Smart Hub Pro", "Smart Bulb (x2)"]}
                  />

                  {/* Mock Order Card 2 */}
                  <OrderCard
                    id="#ORD-7718"
                    date="Sep 12, 2025"
                    total="₹ 12,500"
                    status="Delivered"
                    items={["Smart Lock Ultra"]}
                  />
                </div>
              )}

              {/* TAB: PROFILE */}
              {activeTab === "profile" && (
                <div className="bg-[#121212] border border-gray-800 rounded-3xl p-8 animate-fade-in">
                  <h2 className="text-xl font-bold mb-6">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">First Name</label>
                      <input type="text" defaultValue="Shoeib" className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Last Name</label>
                      <input type="text" defaultValue="Mutayyib" className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email Address</label>
                      <input type="email" value={user?.email || ''} disabled className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Phone Number</label>
                      <input type="tel" defaultValue="+91 98765 43210" className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                  <button className="mt-8 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                    Save Changes
                  </button>
                </div>
              )}

              {/* TAB: ADDRESSES */}
              {activeTab === "addresses" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Saved Addresses</h2>
                    <button
                      onClick={() => {
                        setEditingAddress(null);
                        setShowAddressModal(true);
                      }}
                      className="text-sm bg-white text-black px-4 py-2 rounded-full font-bold hover:bg-gray-200 flex items-center gap-2"
                    >
                      <Plus size={16} /> Add New
                    </button>
                  </div>

                  {loadingAddresses ? (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 border-4 border-[#f2994a] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="bg-[#121212] border border-gray-800 rounded-3xl p-12 text-center">
                      <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">No addresses saved yet</p>
                      <button
                        onClick={() => setShowAddressModal(true)}
                        className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-200"
                      >
                        Add Your First Address
                      </button>
                    </div>
                  ) : (
                    addresses.map(address => (
                      <AddressCard
                        key={address.id}
                        address={address}
                        onDelete={() => handleDeleteAddress(address.id)}
                        onEdit={() => {
                          setEditingAddress(address);
                          setShowAddressModal(true);
                        }}
                        onSetDefault={() => handleSetDefault(address.id)}
                      />
                    ))
                  )}
                </div>
              )}

              {/* TAB: SETTINGS */}
              {activeTab === "settings" && <AccountSettingsPanel />}

            </div>
          </div>
        </main>
        <Footer />
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <AddressModal
          address={editingAddress}
          onClose={() => {
            setShowAddressModal(false);
            setEditingAddress(null);
          }}
          onSave={() => {
            setShowAddressModal(false);
            setEditingAddress(null);
            fetchAddresses();
          }}
        />
      )}
    </RequireAuth>
  );
}

// --- SUB-COMPONENTS ---

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${active
        ? "bg-white text-black font-bold shadow-lg"
        : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
    >
      <span className={active ? "text-black" : "text-gray-500"}>{icon}</span>
      <span className="ml-3">{label}</span>
      {active && <ChevronRight size={16} className="ml-auto" />}
    </button>
  )
}

function OrderCard({ id, date, total, status, items }: { id: string, date: string, total: string, status: string, items: string[] }) {
  return (
    <div className="bg-[#121212] border border-gray-800 rounded-3xl p-6 group hover:border-gray-600 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 pb-6 border-b border-gray-800 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-bold text-lg">{id}</h3>
            <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-xs font-bold rounded uppercase tracking-wide">
              {status}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500 gap-4">
            <span className="flex items-center gap-1"><Clock size={14} /> {date}</span>
            <span className="flex items-center gap-1"><CreditCard size={14} /> {total}</span>
          </div>
        </div>
        <button className="px-4 py-2 border border-gray-700 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-colors">
          View Invoice
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-black rounded-xl border border-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
         <Image
                       src="/logo/xerovolt.png"
                       alt="Xerovolt Tech Logo"
                       width={160}
                       height={160}
                       className="object-contain cursor-pointer w-[120px] md:w-[160px]"
                       priority
                     />
        </div>
        <div>
          <p className="font-medium text-white">{items[0]}</p>
          {items.length > 1 && (
            <p className="text-sm text-gray-500">and {items.length - 1} other item(s)</p>
          )}
        </div>
        <div className="ml-auto">
          <button className="text-blue-500 hover:text-white text-sm font-medium flex items-center gap-1">
            Track Order <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

function AddressCard({
  address,
  onDelete,
  onEdit,
  onSetDefault
}: {
  address: Address,
  onDelete: () => void,
  onEdit: () => void,
  onSetDefault: () => void
}) {
  return (
    <div className={`bg-[#121212] border ${address.isDefault ? 'border-blue-500/50' : 'border-gray-800'} rounded-3xl p-6 relative`}>
      {address.isDefault && (
        <div className="absolute top-6 right-6 bg-blue-500/10 text-blue-500 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
          <Check size={12} /> DEFAULT
        </div>
      )}
      <div className="flex items-start gap-4">
        <div className="p-3 bg-black rounded-full border border-gray-800">
          <MapPin className="w-6 h-6 text-gray-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-lg mb-1">{address.label}</h4>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            {address.addressLine1}
            {address.addressLine2 && <>, {address.addressLine2}</>}
            <br />
            {address.city}, {address.state} - {address.postalCode}
            <br />
            {address.country}
            <br />
            Phone: {address.phone}
          </p>
          <div className="flex gap-4 text-sm font-medium">
            <button onClick={onEdit} className="text-blue-500 hover:text-blue-400 flex items-center gap-1">
              <Edit size={14} /> Edit
            </button>
            {!address.isDefault && (
              <button onClick={onSetDefault} className="text-green-500 hover:text-green-400 flex items-center gap-1">
                <Check size={14} /> Set as Default
              </button>
            )}
            <button onClick={onDelete} className="text-red-500 hover:text-red-400 flex items-center gap-1">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddressModal({
  address,
  onClose,
  onSave
}: {
  address: Address | null,
  onClose: () => void,
  onSave: () => void
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    label: address?.label || '',
    addressLine1: address?.addressLine1 || '',
    addressLine2: address?.addressLine2 || '',
    city: address?.city || '',
    state: address?.state || '',
    postalCode: address?.postalCode || '',
    country: address?.country || 'India',
    phone: address?.phone || '',
    isDefault: address?.isDefault || false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await user?.getIdToken();
      const url = address ? `/api/addresses/${address.id}` : '/api/addresses';
      const method = address ? 'PUT' : 'POST';

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
        alert(data.error || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Error saving address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#121212] border border-gray-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">
          {address ? 'Edit Address' : 'Add New Address'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Label</label>
            <input
              type="text"
              value={formData.label}
              onChange={e => setFormData({ ...formData, label: e.target.value })}
              placeholder="e.g., Home, Office"
              className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 mt-2"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Address Line 1</label>
            <input
              type="text"
              value={formData.addressLine1}
              onChange={e => setFormData({ ...formData, addressLine1: e.target.value })}
              className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 mt-2"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Address Line 2 (Optional)</label>
            <input
              type="text"
              value={formData.addressLine2}
              onChange={e => setFormData({ ...formData, addressLine2: e.target.value })}
              className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 mt-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 mt-2"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 mt-2"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Postal Code</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 mt-2"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={e => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 mt-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 mt-2"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="isDefault" className="text-sm text-gray-400">Set as default address</label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Address'}
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

function AccountSettingsPanel() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [newEmail, setNewEmail] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('customer_profiles')
      .select('first_name, last_name')
      .eq('id', user.uid)
      .single()
      .then(({ data }) => {
        setFirstName(data?.first_name ?? '');
        setLastName(data?.last_name ?? '');
        setLoadingProfile(false);
      });
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    setProfileMessage(null);
    const { error } = await supabase
      .from('customer_profiles')
      .update({ first_name: firstName, last_name: lastName })
      .eq('id', user.uid);
    setProfileMessage(
      error ? { type: 'error', text: error.message } : { type: 'success', text: 'Profile updated.' }
    );
    setSavingProfile(false);
  };

  const saveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEmail(true);
    setEmailMessage(null);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setEmailMessage(
      error
        ? { type: 'error', text: error.message }
        : { type: 'success', text: 'Check your new inbox to confirm the email change.' }
    );
    setSavingEmail(false);
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: "Passwords don't match." });
      return;
    }

    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordMessage({ type: 'error', text: error.message });
    } else {
      setPasswordMessage({ type: 'success', text: 'Password updated.' });
      setNewPassword('');
      setConfirmPassword('');
    }
    setSavingPassword(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-[#121212] border border-gray-800 rounded-3xl p-8">
        <h2 className="text-xl font-bold mb-6">Profile Details</h2>
        {loadingProfile ? (
          <p className="text-gray-500 text-sm">Loading…</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            {profileMessage && (
              <p className={`mt-4 text-sm ${profileMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {profileMessage.text}
              </p>
            )}
            <button
              onClick={saveProfile}
              disabled={savingProfile}
              className="mt-6 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        )}
      </div>

      <div className="bg-[#121212] border border-gray-800 rounded-3xl p-8">
        <h2 className="text-xl font-bold mb-2">Email Address</h2>
        <p className="text-gray-500 text-sm mb-6">Current: {user?.email}</p>
        <form onSubmit={saveEmail} className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            required
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="new@email.com"
            className="flex-1 bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={savingEmail}
            className="px-6 py-3 border border-gray-700 rounded-xl font-bold hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {savingEmail ? 'Sending...' : 'Update Email'}
          </button>
        </form>
        {emailMessage && (
          <p className={`mt-4 text-sm ${emailMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {emailMessage.text}
          </p>
        )}
      </div>

      <div className="bg-[#121212] border border-gray-800 rounded-3xl p-8">
        <h2 className="text-xl font-bold mb-6">Change Password</h2>
        <form onSubmit={savePassword} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={savingPassword}
            className="md:col-span-2 mt-2 w-fit px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
        {passwordMessage && (
          <p className={`mt-4 text-sm ${passwordMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {passwordMessage.text}
          </p>
        )}
      </div>
    </div>
  );
}