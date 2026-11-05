ALTER TABLE "product_images" ALTER COLUMN "image_url" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "public_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_public_id_unique" UNIQUE("public_id");