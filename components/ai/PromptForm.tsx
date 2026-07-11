"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Button from "@/components/ui/Button";
import AILoader from "./AILoader";
import AIResults from "./AIResults";

interface AskResponse {
  reply: string;
  userLang?: string;
}

export default function PromptForm() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AskResponse | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Something went wrong");
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about Xerovolt products, pricing, or support…"
          className="flex-1 rounded-full bg-black/40 border border-brand/20 px-4 py-2 text-sm sm:text-base text-text placeholder:text-text/40 focus:outline-none focus:ring-2 focus:ring-brand/50"
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={loading || !question.trim()}
          className="shrink-0"
          aria-label="Send question"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

      {loading ? <AILoader /> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {result ? <AIResults reply={result.reply} userLang={result.userLang} /> : null}
    </div>
  );
}
