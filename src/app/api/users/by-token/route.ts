import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "token query param required" }, { status: 400 });
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.checkinToken, token))
    .limit(1);

  if (result.length === 0) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 404 });
  }

  const user = result[0];
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      trekStart: user.trekStart,
      trekEnd: user.trekEnd,
      timezone: user.timezone,
      optedIn: user.optedIn,
    },
  });
}
