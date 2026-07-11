"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import PromptForm from "./PromptForm";

export default function AskWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {open ? (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-sm sm:w-96 rounded-2xl border border-brand/20 bg-black/95 backdrop-blur p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-text">Ask Xerovolt</h2>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="text-text/50 hover:text-text transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <PromptForm />
        </div>
      ) : null}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open Xerovolt assistant"}
        className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-brand text-black shadow-lg hover:bg-brand-strong hover:shadow-glow transition-all"
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
    </div>
  );
}
