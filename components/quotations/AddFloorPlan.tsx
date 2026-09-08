'use client';

import { useRef, useState } from 'react';

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f2994a]';
const labelClass = 'text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5';

export default function AddFloorPlan({
  onAdd,
  onClose,
}: {
  onAdd: (label: string, file: File) => Promise<void>;
  onClose: () => void;
}) {
  const [label, setLabel] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleAdd() {
    if (!label || !file) return;
    setBusy(true);
    setError('');
    try {
      await onAdd(label, file);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6" onClick={onClose}>
      <div
        className="bg-[#0c0c0c] border border-white/10 rounded-2xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-sm font-black text-white mb-4">Add a floor plan</h2>

        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Floor label</label>
            <input
              autoFocus
              className={inputClass}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Ground Floor"
            />
          </div>
          <div>
            <label className={labelClass}>Plan image</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-gray-400 text-left transition-colors"
            >
              {file ? file.name : 'Choose an image…'}
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl">
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!label || !file || busy}
            className="flex-1 py-2.5 bg-[#f2994a] text-black text-sm font-bold rounded-xl disabled:opacity-60"
          >
            {busy ? 'Uploading…' : 'Add floor'}
          </button>
        </div>
      </div>
    </div>
  );
}
