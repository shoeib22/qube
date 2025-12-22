"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";

export interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  image?: string; // kept for future use (OG / WhatsApp)
  className?: string;
}

export default function ShareButton({
  title,
  text,
  url,
  className = "",
}: ShareButtonProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("Link Copied!");

  const handleShare = async () => {
    const shareUrl =
      url || (typeof window !== "undefined" ? window.location.href : "");

    const shareData: ShareData = {
      title: title || "SmartHome Product",
      text: text || "Check out this product!",
      url: shareUrl,
    };

    // ✅ Native Share API (mobile / Safari)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        console.warn("Share cancelled or failed", err);
      }
    }

    // ✅ Clipboard fallback (desktop)
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setFeedbackText("Link Copied!");
        setShowFeedback(true);
        setTimeout(() => setShowFeedback(false), 2000);
      }
    } catch (err) {
      console.error("Clipboard failed", err);
      setFeedbackText("Failed to copy");
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share"
      className={`p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-all relative group ${className}`}
    >
      {showFeedback ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <Share2 className="w-5 h-5" />
      )}

      {/* Tooltip */}
      <div
        className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap transition-opacity duration-200 pointer-events-none border border-gray-700 ${
          showFeedback ? "opacity-100" : "opacity-0"
        }`}
      >
        {feedbackText}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800" />
      </div>
    </button>
  );
}
