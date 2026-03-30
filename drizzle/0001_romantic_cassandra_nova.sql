ALTER TABLE "users" ADD COLUMN "checkin_token" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_checkin_token_unique" UNIQUE("checkin_token");