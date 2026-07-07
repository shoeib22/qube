"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Room {
  id: string;
  name: string;
  created_at: string;
}

interface SystemStatus {
  supabase: { connected: boolean };
  mqtt: { configured: boolean; lastEventAt: string | null; recentlyActive: boolean };
}

function StatusCard({
  title,
  ok,
  okLabel,
  badLabel,
  detail,
}: {
  title: string;
  ok: boolean;
  okLabel: string;
  badLabel: string;
  detail?: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">{title}</p>
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2 h-2 rounded-full ${ok ? "bg-green-500" : "bg-red-500"}`} />
        <span className={`text-lg font-black ${ok ? "text-green-400" : "text-red-400"}`}>
          {ok ? okLabel : badLabel}
        </span>
      </div>
      {detail && <p className="text-xs text-gray-500 mt-2">{detail}</p>}
    </div>
  );
}

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRoom, setNewRoom] = useState("");
  const [adding, setAdding] = useState(false);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const token = await user.getIdToken();
    const headers = { Authorization: `Bearer ${token}` };
    const [statusRes, roomsRes] = await Promise.all([
      fetch("/api/admin/system-status", { headers }),
      fetch("/api/admin/rooms", { headers }),
    ]);
    setStatus(await statusRes.json());
    const roomsData = await roomsRes.json();
    setRooms(roomsData.rooms ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newRoom.trim()) return;
    setAdding(true);
    setRoomError(null);
    const token = await user.getIdToken();
    const res = await fetch("/api/admin/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: newRoom.trim() }),
    });
    if (res.ok) {
      setNewRoom("");
      fetchAll();
    } else {
      const data = await res.json().catch(() => ({}));
      setRoomError(data.error ?? "Failed to add room");
    }
    setAdding(false);
  };

  const removeRoom = async (room: Room) => {
    if (!user) return;
    if (!confirm(`Remove room "${room.name}"? Devices already assigned to it keep their room label as free text.`)) return;
    setBusyId(room.id);
    const token = await user.getIdToken();
    await fetch(`/api/admin/rooms/${room.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchAll();
    setBusyId(null);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight text-white">System Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Integration health and home-automation configuration</p>
      </div>

      <div className="mb-10">
        <h2 className="text-sm font-black text-white mb-4">Integration Health</h2>
        {loading || !status ? (
          <p className="text-gray-500 text-sm animate-pulse">Checking…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatusCard
              title="Supabase"
              ok={status.supabase.connected}
              okLabel="Connected"
              badLabel="Unreachable"
            />
            <StatusCard
              title="MQTT Broker"
              ok={status.mqtt.configured}
              okLabel="Configured"
              badLabel="Not configured"
              detail={
                !status.mqtt.configured
                  ? "MQTT_BROKER / MQTT_USERNAME / MQTT_PASSWORD aren't set for this deployment — device state won't sync. Set these in apphosting.yaml / Secret Manager, same as the Supabase keys."
                  : status.mqtt.recentlyActive
                    ? `Last device event ${new Date(status.mqtt.lastEventAt!).toLocaleString()}`
                    : status.mqtt.lastEventAt
                      ? `No activity in 24h — last event ${new Date(status.mqtt.lastEventAt).toLocaleString()}`
                      : "No device events recorded yet"
              }
            />
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-black text-white mb-1">Rooms</h2>
        <p className="text-gray-500 text-xs mb-4">
          Canonical room list used when assigning devices, so names stay consistent across the Devices page.
        </p>

        <form onSubmit={addRoom} className="flex gap-2 mb-4 max-w-md">
          <input
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            placeholder="e.g. Living Room"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f2994a]"
          />
          <button
            type="submit"
            disabled={adding || !newRoom.trim()}
            className="px-5 py-2.5 bg-[#f2994a] text-black font-bold rounded-xl text-sm disabled:opacity-60"
          >
            {adding ? "Adding…" : "Add"}
          </button>
        </form>
        {roomError && <p className="text-sm text-red-400 mb-4">{roomError}</p>}

        {loading ? (
          <p className="text-gray-500 text-sm animate-pulse">Loading rooms…</p>
        ) : rooms.length === 0 ? (
          <p className="text-gray-600 text-sm">No rooms added yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full pl-4 pr-2 py-1.5"
              >
                <span className="text-sm text-white">{room.name}</span>
                <button
                  onClick={() => removeRoom(room)}
                  disabled={busyId === room.id}
                  className="w-5 h-5 flex items-center justify-center rounded-full text-gray-500 hover:text-red-400 hover:bg-red-500/10 text-xs disabled:opacity-50"
                  aria-label={`Remove ${room.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
