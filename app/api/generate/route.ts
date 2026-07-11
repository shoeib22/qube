import { NextResponse } from "next/server";
import { askXerovoltBot } from "@/lib/ai";

export async function POST(req: Request) {
  const { question, sessionId } = await req.json();

  if (typeof question !== "string" || !question.trim()) {
    return NextResponse.json({ error: "question is required" }, { status: 400 });
  }

  try {
    const result = await askXerovoltBot(question, sessionId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("askXerovoltBot failed:", error);
    return NextResponse.json({ error: "Failed to get a response from the assistant" }, { status: 500 });
  }
}
