import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// GET /api/users?phone=+1234567890
export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get("phone");

  if (!phone) {
    return NextResponse.json({ error: "phone query param required" }, { status: 400 });
  }

  const result = await db.select().from(users).where(eq(users.phone, phone)).limit(1);

  if (result.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: result[0] });
}

// PATCH /api/users  — update user fields
export async function PATCH(req: NextRequest) {
  const { userId, ...updates } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  // Allow updating: name, timezone, optedIn, trekStart (recomputes trekEnd)
  const allowed: Record<string, unknown> = {};
  if (updates.name !== undefined) allowed.name = updates.name;
  if (updates.timezone !== undefined) allowed.timezone = updates.timezone;
  if (updates.optedIn !== undefined) allowed.optedIn = updates.optedIn;
  if (updates.trekStart !== undefined) {
    allowed.trekStart = updates.trekStart;
    const d = new Date(updates.trekStart);
    d.setDate(d.getDate() + 28);
    allowed.trekEnd = d.toISOString().split("T")[0];
  }

  if (Object.keys(allowed).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const [updated] = await db
    .update(users)
    .set(allowed)
    .where(eq(users.id, userId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: updated });
}
