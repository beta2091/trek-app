import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, smsLogs } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { twilioClient } from "@/lib/twilio";

function getHourInTimezone(date: Date, timezone: string): number {
  return parseInt(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: timezone,
    }).format(date)
  );
}

function getDateInTimezone(date: Date, timezone: string): string {
  // en-CA locale gives YYYY-MM-DD format
  return new Intl.DateTimeFormat("en-CA", { timeZone: timezone }).format(date);
}

function calculateTrekDay(trekStart: string, todayStr: string): number {
  const start = new Date(trekStart + "T00:00:00Z");
  const today = new Date(todayStr + "T00:00:00Z");
  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Day 1 is the start date
}

export async function GET(req: NextRequest) {
  // Verify Vercel Cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const results: { userId: string; trekDay: number; twilioSid: string }[] = [];
  const errors: { userId: string; error: string }[] = [];

  // Get all opted-in users with active trek data and a check-in token
  const eligibleUsers = await db
    .select()
    .from(users)
    .where(eq(users.optedIn, true));

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.VERCEL_URL}`;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;

  if (!fromPhone) {
    return NextResponse.json(
      { error: "TWILIO_PHONE_NUMBER not configured" },
      { status: 500 }
    );
  }

  for (const user of eligibleUsers) {
    // Skip users missing required data
    if (!user.trekStart || !user.trekEnd || !user.checkinToken) continue;

    try {
      // Check if current hour in user's timezone is within 7-9 AM window
      const userHour = getHourInTimezone(now, user.timezone);
      if (userHour < 7 || userHour >= 9) continue;

      // Get today's date in user's timezone
      const userToday = getDateInTimezone(now, user.timezone);

      // Check trek is active: trek_start <= today <= trek_end
      if (userToday < user.trekStart || userToday > user.trekEnd) continue;

      // Check no SMS already sent today
      const alreadySent = await db
        .select({ id: smsLogs.id })
        .from(smsLogs)
        .where(and(eq(smsLogs.userId, user.id), eq(smsLogs.sentDate, userToday)))
        .limit(1);

      if (alreadySent.length > 0) continue;

      // Calculate trek day
      const trekDay = calculateTrekDay(user.trekStart, userToday);
      if (trekDay < 1 || trekDay > 28) continue;

      // Send SMS via Twilio
      const message = await twilioClient.messages.create({
        to: user.phone,
        from: fromPhone,
        body: `Day ${trekDay} of your TREK. How did yesterday go? Tap to check in: ${appUrl}/checkin/${user.checkinToken}`,
      });

      // Log the send
      await db.insert(smsLogs).values({
        userId: user.id,
        trekDay,
        sentDate: userToday,
        twilioSid: message.sid,
      });

      results.push({ userId: user.id, trekDay, twilioSid: message.sid });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      errors.push({ userId: user.id, error: errorMsg });
      console.error(`SMS send failed for user ${user.id}:`, errorMsg);
    }
  }

  console.log(
    `Daily check-in cron: ${results.length} sent, ${errors.length} failed, ${eligibleUsers.length} total eligible`
  );

  return NextResponse.json({
    sent: results.length,
    failed: errors.length,
    results,
    errors,
  });
}
