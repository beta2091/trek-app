import { pgTable, uuid, text, date, boolean, timestamp, integer, jsonb, uniqueIndex, index } from "drizzle-orm/pg-core";
import { randomBytes } from "crypto";

export function generateCheckinToken(): string {
  return randomBytes(32).toString("hex");
}

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  phone: text("phone").notNull().unique(),
  name: text("name"),
  trekStart: date("trek_start"),
  trekEnd: date("trek_end"),
  timezone: text("timezone").default("America/Chicago").notNull(),
  optedIn: boolean("opted_in").default(true).notNull(),
  checkinToken: text("checkin_token").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dailyCheckins = pgTable(
  "daily_checkins",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    trekDay: integer("trek_day").notNull(),
    date: date("date").notNull(),
    ratings: jsonb("ratings").$type<{
      faith: number;
      family: number;
      fitness: number;
      finance: number;
      fulfillment: number;
    }>().notNull(),
    note: text("note"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("checkin_user_day_idx").on(table.userId, table.trekDay),
  ]
);

export const subscribers = pgTable("subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const smsLogs = pgTable(
  "sms_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    trekDay: integer("trek_day").notNull(),
    sentDate: date("sent_date").notNull(),
    twilioSid: text("twilio_sid"),
    sentAt: timestamp("sent_at").defaultNow().notNull(),
  },
  (table) => [
    index("sms_log_user_date_idx").on(table.userId, table.sentDate),
  ]
);
