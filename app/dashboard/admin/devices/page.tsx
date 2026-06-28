"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Device {
  deviceId: string;
  friendlyName: string;
  room: string;
  state: Record<string, unknown>;
  lastUpdated: string;
}

export default function AdminDevicesPage() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editRoom, setEditRoom] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchDevices = async () => {
    if (!user) { setLoading(false); return; }
    const token = await user.getIdToken();
    const res = await fetch("/api/admin/devices", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setDevices(data.devices ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchDevices(); }, [user]);

  const startEdit = (d: Device) => {
    setEditingId(d.deviceId);
    setEditName(d.friendlyName);
    setEditRoom(d.room === "—" ? "" : d.room);
  };

  const saveEdit = async () => {
    if (!user || !editingId) return;
    setSaving(true);
    const token = await user.getIdToken();
    await fetch(`/api/admin/devices/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ friendlyName: editName, room: editRoom }),
    });
    setSaving(false);
    setEditingId(null);
    fetchDevices();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Devices</h1>
          <p className="text-gray-500 text-sm mt-1">Manage registered IoT devices and their room assignments</p>
        </div>
        <span className="text-xs text-gray-600 font-mono bg-white/5 px-3 py-1.5 rounded-lg">
          {devices.length} device{devices.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading…</div>
      ) : devices.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <div className="text-4xl mb-3">🔌</div>
          <p className="font-bold">No devices found</p>
          <p className="text-sm mt-1">Devices appear here once they connect to MQTT</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-gray-500 text-xs">
                <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Device ID</th>
                <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Friendly Name</th>
                <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Room</th>
                <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">State</th>
                <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Last Updated</th>
                <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map(d => (
                <tr key={d.deviceId} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-gray-400">{d.deviceId}</td>
                  <td className="py-3 px-4">
                    {editingId === d.deviceId ? (
                      <input value={editName} onChange={e => setEditName(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-xs w-full focus:outline-none focus:border-[#f2994a]" />
                    ) : (
                      <span className="font-bold text-white">{d.friendlyName}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {editingId === d.deviceId ? (
                      <input value={editRoom} onChange={e => setEditRoom(e.target.value)} placeholder="Room name"
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-xs w-full focus:outline-none focus:border-[#f2994a]" />
                    ) : (
                      <span className="text-gray-400">{d.room}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-mono text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                      {typeof d.state === "object" ? JSON.stringify(d.state).slice(0, 40) + "…" : String(d.state)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-500">
                    {d.lastUpdated ? new Date(d.lastUpdated).toLocaleString() : "—"}
                  </td>
                  <td className="py-3 px-4">
                    {editingId === d.deviceId ? (
                      <div className="flex gap-2">
                        <button onClick={saveEdit} disabled={saving}
                          className="text-xs font-bold text-[#f2994a] hover:text-orange-300 transition-colors">
                          {saving ? "Saving…" : "Save"}
                        </button>
                        <button onClick={() => setEditingId(null)}
                          className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(d)}
                        className="text-xs font-bold text-gray-500 hover:text-white transition-colors">
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
