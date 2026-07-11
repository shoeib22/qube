"use client";

interface AIResultsProps {
  reply: string;
  userLang?: string;
}

export default function AIResults({ reply, userLang }: AIResultsProps) {
  return (
    <div className="rounded-2xl border border-brand/20 bg-brand-soft/40 p-4 sm:p-5 text-sm sm:text-base text-text whitespace-pre-wrap break-words">
      {reply}
      {userLang ? (
        <div className="mt-2 text-xs text-text/50">Detected language: {userLang}</div>
      ) : null}
    </div>
  );
}
