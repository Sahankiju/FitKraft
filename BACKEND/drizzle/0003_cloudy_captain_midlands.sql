ALTER TABLE "product_images" ALTER COLUMN "image_url" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "thumbnail" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "public_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "is_primary" boolean DEFAULT false NOT NULL;