ALTER TABLE "movies" ADD COLUMN "poster_url" text;--> statement-breakpoint
ALTER TABLE "movies" ADD COLUMN "synopsis" text;--> statement-breakpoint
ALTER TABLE "movies" ADD COLUMN "is_featured" boolean DEFAULT false;