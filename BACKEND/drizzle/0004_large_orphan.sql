ALTER TABLE "customisation_option" ALTER COLUMN "thumbnail" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "thumbnail" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "customisation_group" ADD COLUMN "product_id" uuid;--> statement-breakpoint
ALTER TABLE "customisation_group" ADD COLUMN "selection_type" varchar(20) DEFAULT 'single' NOT NULL;--> statement-breakpoint
ALTER TABLE "customisation_group" ADD COLUMN "min_selections" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "customisation_group" ADD COLUMN "max_selections" integer;--> statement-breakpoint
ALTER TABLE "customisation_group" ADD CONSTRAINT "customisation_group_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "customisation_option_group_name_unique" ON "customisation_option" USING btree ("group_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "product_customisation_unique" ON "product_customisation" USING btree ("product_id","group_id");