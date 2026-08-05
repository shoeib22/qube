import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await prisma.xerovoltErvLead.create({
      data: {
        name: body.name,
        email: body.email,
        contact: body.contact,
        product: "ERV",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERV API ERROR:", error);
    return NextResponse.json(
      { error: "Failed to save data" },
      { status: 500 }
    );
  }
}
