import { NextRequest, NextResponse } from "next/server";
import { checkVerification } from "@/lib/twilio";
import { db } from "@/lib/db";
import { users, generateCheckinToken } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { phone, code, name, trekStart, timezone } = await req.json();

  if (!phone || !code) {
    return NextResponse.json({ error: "Phone and code are required" }, { status: 400 });
  }

  try {
    const check = await checkVerification(phone, code);

    if (check.status !== "approved") {
      return NextResponse.json({ error: "Invalid code" }, { status: 401 });
    }

    // Look up or create user
    const existing = await db.select().from(users).where(eq(users.phone, phone)).limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ user: existing[0] });
    }

    // Compute trek_end = trek_start + 28 days
    let trekEnd: string | undefined;
    if (trekStart) {
      const d = new Date(trekStart);
      d.setDate(d.getDate() + 28);
      trekEnd = d.toISOString().split("T")[0];
    }

    const [newUser] = await db
      .insert(users)
      .values({
        phone,
        name: name || null,
        trekStart: trekStart || null,
        trekEnd: trekEnd || null,
        timezone: timezone || "America/Chicago",
        checkinToken: generateCheckinToken(),
      })
      .returning();

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
