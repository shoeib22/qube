'use client';

import { useRef, useState } from 'react';

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f2994a]';
const labelClass = 'text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5';

export default function QuickAddItem({
  onAdd,
  onClose,
  uploadImage,
}: {
  onAdd: (item: { description: string; unit_price: number; image_url: string | null }) => void;
  onClose: () => void;
  uploadImage: (file: File) => Promise<string>;
}) {
  const [description, setDescription] = useState('');
  const [unitPrice, setUnitPrice] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function pickFile(f: File | null) {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function handleAdd() {
    if (!description) return;
    setBusy(true);
    setError('');
    try {
      const image_url = file ? await uploadImage(file) : null;
      onAdd({ description, unit_price: unitPrice, image_url });
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
        <h2 className="text-sm font-black text-white mb-4">Add product at this point</h2>

        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Description</label>
            <input
              autoFocus
              className={inputClass}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Smart Panel Pro"
            />
          </div>
          <div>
            <label className={labelClass}>Price</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className={inputClass}
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
            />
          </div>
          <div>
            <label className={labelClass}>Photo (optional)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element -- local file preview
                <img src={preview} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-white/10 shrink-0" />
              )}
              <span className="text-sm text-gray-400">{file ? file.name : 'Choose a photo…'}</span>
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl">
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!description || busy}
            className="flex-1 py-2.5 bg-[#f2994a] text-black text-sm font-bold rounded-xl disabled:opacity-60"
          >
            {busy ? 'Adding…' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
