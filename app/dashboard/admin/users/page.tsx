"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import { useAuth } from "../../../../context/AuthContext";
import { auth } from "../../../../lib/firebase";

interface UserData {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const { user: currentUser } = useAuth(); // for getting the token

    useEffect(() => {
        fetchUsers();
    }, [currentUser]);

    const fetchUsers = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const token = await currentUser.getIdToken();
            const res = await fetch("/api/admin/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (data.users) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        if (!currentUser) return;
        setUpdating(userId);
        try {
            const token = await currentUser.getIdToken();
            const res = await fetch("/api/admin/users", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId, role: newRole }),
            });

            if (res.ok) {
                // Optimistic update or refetch
                setUsers((prev) =>
                    prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
                );
            } else {
                alert("Failed to update role");
            }
        } catch (error) {
            console.error("Error updating role", error);
        } finally {
            setUpdating(null);
        }
    };

    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <div className="min-h-screen bg-black text-white p-8 sm:p-12">
                <header className="mb-10">
                    <h1 className="text-2xl font-light uppercase tracking-[0.2em] text-white/90">
                        User Management
                    </h1>
                    <div className="mt-4 h-[1px] w-12 bg-[#f2994a]" />
                </header>

                {loading ? (
                    <p className="animate-pulse">Loading users...</p>
                ) : (
                    <div className="overflow-x-auto border border-white/10 rounded-lg">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#121212] border-b border-white/10 text-gray-400 uppercase tracking-wider text-xs">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium">
                                            {u.firstName} {u.lastName}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${u.role === "admin"
                                                        ? "border-green-500/50 text-green-400 bg-green-500/10"
                                                        : "border-gray-500/50 text-gray-400 bg-gray-500/10"
                                                    }`}
                                            >
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={u.role}
                                                onChange={(e) => handleRoleUpdate(u.id, e.target.value)}
                                                disabled={updating === u.id}
                                                className="bg-black border border-white/20 rounded px-2 py-1 text-xs outline-none focus:border-[#f2994a]"
                                            >
                                                <option value="customer">Customer</option>
                                                <option value="admin">Admin</option>
                                                <option value="manager">Manager</option>
                                            </select>
                                            {updating === u.id && (
                                                <span className="ml-2 text-[10px] animate-pulse">...</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {users.length === 0 && (
                            <div className="p-8 text-center text-gray-500">No users found.</div>
                        )}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
