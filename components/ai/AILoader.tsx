"use client";

import { Loader2 } from "lucide-react";

export default function AILoader() {
  return (
    <div className="flex items-center gap-2 text-sm text-text/70 py-2" role="status" aria-live="polite">
      <Loader2 className="h-4 w-4 animate-spin text-brand" />
      <span>Thinking…</span>
    </div>
  );
}
