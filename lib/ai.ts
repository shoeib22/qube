// Server-only: calls the Xerovolt WhatsApp bot's RAG endpoint so the site's
// AI assistant answers from the same knowledge base as the WhatsApp bot.
// Never import this from a "use client" file — it reads server-only env vars.

export interface AskBotResult {
  reply: string;
  userLang?: string;
}

export async function askXerovoltBot(question: string, sessionId?: string): Promise<AskBotResult> {
  const gatewayUrl = process.env.GATEWAY_URL;
  const gatewayApiKey = process.env.GATEWAY_API_KEY;

  if (!gatewayUrl || !gatewayApiKey) {
    throw new Error("AI assistant is not configured: missing GATEWAY_URL or GATEWAY_API_KEY");
  }

  const res = await fetch(`${gatewayUrl.replace(/\/$/, "")}/public/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-gateway-key": gatewayApiKey,
    },
    body: JSON.stringify({ question, sessionId }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`AI assistant request failed (${res.status}): ${body || res.statusText}`);
  }

  const data = (await res.json()) as AskBotResult;
  return { reply: data.reply ?? "", userLang: data.userLang };
}
