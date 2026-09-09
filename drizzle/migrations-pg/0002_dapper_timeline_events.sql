ALTER TABLE "timeline_posts" ADD COLUMN IF NOT EXISTS "year" text;--> statement-breakpoint
ALTER TABLE "timeline_posts" ADD COLUMN IF NOT EXISTS "event_date" text;
