"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import PanelPreview from "@/components/configurator/PanelPreview";

interface Config {
  id: string;
  userId: string;
  userEmail?: string;
  name: string;
  panel: string;
  material: string;
  size: string;
  accessory: string;
  slots: Array<{ slotIndex: number; iconId: string; iconName: string }>;
  materialColor: string;
  frameColor: string;
  technology: string;
  qty: number;
  deviceId: string | null;
  savedAt: { _seconds: number } | null;
}

interface Device {
  deviceId: string;
  friendlyName: string;
  room: string;
}

export default function AdminConfigsPage() {
  const { user } = useAuth();
  const [configs, setConfigs] = useState<Config[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState<string | null>(null);
  const [linkTarget, setLinkTarget] = useState("");
  const [previewConfig, setPreviewConfig] = useState<Config | null>(null);
  const [saving, setSaving] = useState(false);

  const getToken = async () => user ? user.getIdToken() : "";

  const fetchAll = async () => {
    if (!user) return;
    const token = await getToken();
    const [cRes, dRes] = await Promise.all([
      fetch("/api/admin/configs", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("/api/admin/devices", { headers: { Authorization: `Bearer ${token}` } }),
    ]);
    const cData = await cRes.json();
    const dData = await dRes.json();
    setConfigs(cData.configs ?? []);
    setDevices(dData.devices ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, [user]);

  const handleLink = async (configId: string, deviceId: string | null) => {
    setSaving(true);
    const token = await getToken();
    await fetch(`/api/admin/configs/${configId}/link-device`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ deviceId }),
    });
    setSaving(false);
    setLinking(null);
    setLinkTarget("");
    fetchAll();
  };

  const formatDate = (ts: Config["savedAt"]) =>
    ts?._seconds ? new Date(ts._seconds * 1000).toLocaleDateString() : "—";

  return (
    <div className="flex gap-6">
      {/* Config table */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Panel Configs</h1>
            <p className="text-gray-500 text-sm mt-1">View user-saved configs and link them to devices</p>
          </div>
          <span className="text-xs text-gray-600 font-mono bg-white/5 px-3 py-1.5 rounded-lg">
            {configs.length} config{configs.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="text-gray-500 text-sm">Loading…</div>
        ) : configs.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <div className="text-4xl mb-3">🎨</div>
            <p className="font-bold">No saved configs yet</p>
            <p className="text-sm mt-1">Users save configs from the panel configurator</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-gray-500 text-xs">
                  <th className="text-left py-3 px-3 font-bold uppercase tracking-wider">Name</th>
                  <th className="text-left py-3 px-3 font-bold uppercase tracking-wider">User</th>
                  <th className="text-left py-3 px-3 font-bold uppercase tracking-wider">Size</th>
                  <th className="text-left py-3 px-3 font-bold uppercase tracking-wider">Tech</th>
                  <th className="text-left py-3 px-3 font-bold uppercase tracking-wider">Device</th>
                  <th className="text-left py-3 px-3 font-bold uppercase tracking-wider">Saved</th>
                  <th className="text-left py-3 px-3 font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {configs.map(config => (
                  <tr key={config.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="py-3 px-3 font-bold text-white max-w-[160px] truncate">{config.name}</td>
                    <td className="py-3 px-3 text-xs text-gray-400 max-w-[140px] truncate">{config.userEmail ?? config.userId}</td>
                    <td className="py-3 px-3 text-gray-300 text-xs">{config.size}</td>
                    <td className="py-3 px-3 text-gray-300 text-xs">{config.technology}</td>
                    <td className="py-3 px-3">
                      {config.deviceId ? (
                        <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded font-mono">
                          {devices.find(d => d.deviceId === config.deviceId)?.friendlyName ?? config.deviceId}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-600">Unlinked</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-xs text-gray-500">{formatDate(config.savedAt)}</td>
                    <td className="py-3 px-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPreviewConfig(previewConfig?.id === config.id ? null : config)}
                          className="text-xs text-gray-500 hover:text-white transition-colors"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => { setLinking(config.id); setLinkTarget(config.deviceId ?? ""); }}
                          className="text-xs font-bold text-[#f2994a] hover:text-orange-300 transition-colors"
                        >
                          {config.deviceId ? "Relink" : "Link Device"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Side panel — preview or link modal */}
      {(previewConfig || linking) && (
        <div className="w-[320px] flex-shrink-0 bg-[#0c0c0c] border border-white/5 rounded-2xl p-5">
          {previewConfig && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-sm">{previewConfig.name}</h3>
                <button onClick={() => setPreviewConfig(null)} className="text-gray-600 hover:text-white text-lg">×</button>
              </div>
              <PanelPreview
                sizeId={previewConfig.size}
                materialColorId={previewConfig.materialColor}
                frameColorId={previewConfig.frameColor}
                slots={previewConfig.slots}
                className="w-full"
              />
              <div className="mt-4 space-y-2 text-xs">
                {[
                  ["Panel", "Edge"],
                  ["Material", previewConfig.material],
                  ["Size", previewConfig.size],
                  ["Technology", previewConfig.technology],
                  ["Qty", String(previewConfig.qty)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-gray-500">{k}</span>
                    <span className="text-white font-bold">{v}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {linking && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-sm">Link to Device</h3>
                <button onClick={() => setLinking(null)} className="text-gray-600 hover:text-white text-lg">×</button>
              </div>
              <select
                value={linkTarget}
                onChange={e => setLinkTarget(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f2994a] mb-4"
              >
                <option value="">— Select device —</option>
                {devices.map(d => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.friendlyName} {d.room ? `(${d.room})` : ""}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => handleLink(linking, linkTarget || null)}
                  disabled={saving}
                  className="flex-1 py-2 bg-[#f2994a] text-black text-xs font-bold rounded-lg hover:bg-orange-400 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving…" : linkTarget ? "Link" : "Unlink"}
                </button>
                <button onClick={() => setLinking(null)} className="flex-1 py-2 bg-white/5 text-gray-400 text-xs font-bold rounded-lg hover:bg-white/10 transition-colors">
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
