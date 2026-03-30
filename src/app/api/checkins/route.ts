import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dailyCheckins } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// POST /api/checkins — create or upsert a daily check-in
export async function POST(req: NextRequest) {
  const { userId, trekDay, date, ratings, note } = await req.json();

  if (!userId || !trekDay || !date || !ratings) {
    return NextResponse.json(
      { error: "userId, trekDay, date, and ratings are required" },
      { status: 400 }
    );
  }

  // Validate ratings shape
  const footprints = ["faith", "family", "fitness", "finance", "fulfillment"];
  for (const fp of footprints) {
    const val = ratings[fp];
    if (typeof val !== "number" || val < 1 || val > 10) {
      return NextResponse.json(
        { error: `ratings.${fp} must be a number between 1 and 10` },
        { status: 400 }
      );
    }
  }

  if (trekDay < 1 || trekDay > 28) {
    return NextResponse.json({ error: "trekDay must be between 1 and 28" }, { status: 400 });
  }

  // Upsert: if check-in for this user+day exists, update it
  const existing = await db
    .select()
    .from(dailyCheckins)
    .where(and(eq(dailyCheckins.userId, userId), eq(dailyCheckins.trekDay, trekDay)))
    .limit(1);

  if (existing.length > 0) {
    const [updated] = await db
      .update(dailyCheckins)
      .set({ ratings, note: note || null, date })
      .where(eq(dailyCheckins.id, existing[0].id))
      .returning();
    return NextResponse.json({ checkin: updated });
  }

  const [checkin] = await db
    .insert(dailyCheckins)
    .values({ userId, trekDay, date, ratings, note: note || null })
    .returning();

  return NextResponse.json({ checkin }, { status: 201 });
}

// GET /api/checkins?userId=...
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId query param required" }, { status: 400 });
  }

  const result = await db
    .select()
    .from(dailyCheckins)
    .where(eq(dailyCheckins.userId, userId))
    .orderBy(dailyCheckins.trekDay);

  return NextResponse.json({ checkins: result });
}
