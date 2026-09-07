// Server-only: analyzes an uploaded floor/electrical plan image with Gemini
// vision and returns where Xerovolt products should go. Never import from a
// "use client" file -- it reads a server-only env var and uses `sharp`.

import sharp from "sharp";
import { GoogleGenAI, Type } from "@google/genai";
import { PRODUCTS, PLACEMENT_GUIDELINES, describeCatalog, type ProductCode } from "./planMapperCatalog";

const MAX_DIM = 1536;
const GRID_STEP = 10;

export interface Placement {
  product: ProductCode;
  room: string;
  x_pct: number;
  y_pct: number;
  reasoning: string;
}

export interface PlanMapperResult {
  planType: string;
  roomsIdentified: string[];
  placements: Placement[];
}

/**
 * Resize the plan and overlay a labeled percent-grid (0-100 on both axes)
 * before sending it to Gemini -- gives the model a reliable coordinate system
 * to report positions against, since raw pixel grounding from vision models
 * is unreliable. Mirrors plan_mapper.py's add_grid()/resize_for_model().
 */
async function buildGridImage(buffer: Buffer): Promise<Buffer> {
  const oriented = sharp(buffer).rotate();
  const meta = await oriented.metadata();
  const w = meta.width ?? MAX_DIM;
  const h = meta.height ?? MAX_DIM;
  const scale = Math.min(1, MAX_DIM / Math.max(w, h));
  const rw = Math.max(1, Math.round(w * scale));
  const rh = Math.max(1, Math.round(h * scale));

  const resized = await oriented.resize(rw, rh).png().toBuffer();

  let overlay = "";
  for (let pct = 0; pct <= 100; pct += GRID_STEP) {
    const x = Math.round((rw * pct) / 100);
    const y = Math.round((rh * pct) / 100);
    overlay += `<line x1="${x}" y1="0" x2="${x}" y2="${rh}" stroke="red" stroke-width="1"/>`;
    overlay += `<line x1="0" y1="${y}" x2="${rw}" y2="${y}" stroke="red" stroke-width="1"/>`;
    overlay += `<text x="${x + 2}" y="12" font-size="12" fill="red">${pct}</text>`;
    overlay += `<text x="2" y="${y + 12}" font-size="12" fill="red">${pct}</text>`;
  }
  const svg = `<svg width="${rw}" height="${rh}" xmlns="http://www.w3.org/2000/svg">${overlay}</svg>`;

  return sharp(resized)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toBuffer();
}

function buildSystemPrompt(): string {
  return `You are a home-automation installation planner for Xerovolt. You are given an image of a house's floor plan or electrical plan, overlaid with a red reference grid labeled in percent (0-100) along both axes so you can report positions precisely as x_pct/y_pct (0=left/top, 100=right/bottom).

Your job: decide which Xerovolt products to place, where, and why, then return the structured result described by the response schema.

Product catalog:
${describeCatalog()}

Placement guidelines:
${PLACEMENT_GUIDELINES}

Read any room labels/text visible on the plan and use them to identify room types. If a room has no legible label, infer its likely type from layout (fixtures, size, adjacency, door/window placement) and say so in your reasoning. Only place products that make sense for rooms you can actually identify -- do not invent rooms that aren't shown. Use the grid lines to estimate x_pct/y_pct for each product's marker position within the room it belongs to.`;
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    plan_type: { type: Type.STRING, enum: ["floor_plan", "electrical_plan", "other"] },
    rooms_identified: { type: Type.ARRAY, items: { type: Type.STRING } },
    placements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          product: { type: Type.STRING, enum: Object.keys(PRODUCTS) },
          room: { type: Type.STRING },
          x_pct: { type: Type.NUMBER },
          y_pct: { type: Type.NUMBER },
          reasoning: { type: Type.STRING },
        },
        required: ["product", "room", "x_pct", "y_pct", "reasoning"],
      },
    },
  },
  required: ["placements"],
};

export async function analyzePlan(fileBuffer: Buffer): Promise<PlanMapperResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Plan Mapper is not configured: missing GEMINI_API_KEY");
  }

  const gridImage = await buildGridImage(fileBuffer);
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.5-pro",
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType: "image/png", data: gridImage.toString("base64") } },
          { text: "Here is the plan. Place the products." },
        ],
      },
    ],
    config: {
      systemInstruction: buildSystemPrompt(),
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini returned no content");
  }

  const parsed = JSON.parse(text) as {
    plan_type?: string;
    rooms_identified?: string[];
    placements?: Placement[];
  };

  return {
    planType: parsed.plan_type ?? "other",
    roomsIdentified: parsed.rooms_identified ?? [],
    placements: parsed.placements ?? [],
  };
}
