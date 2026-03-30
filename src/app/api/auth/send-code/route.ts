import { NextRequest, NextResponse } from "next/server";
import { sendVerification } from "@/lib/twilio";

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  if (!phone || typeof phone !== "string") {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  try {
    const verification = await sendVerification(phone);
    return NextResponse.json({ status: verification.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send code";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
