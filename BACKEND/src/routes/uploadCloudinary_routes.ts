import { Hono } from "hono";
import cloudinary from "../lib/cloudinary";

const uploadCloudinaryRoutes = new Hono();

uploadCloudinaryRoutes.post("/upload", async (c) => {
  const body = await c.req.parseBody();
  const file = body["file"];

  if (!(file instanceof File)) {
    return c.json({ error: "Image file is required" }, 400);
  }

  if (!file.type.startsWith("image/")) {
    return c.json({ error: "Only image files are allowed" }, 400);
  }

  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "fitkraft/products",
    resource_type: "image",
  });

  return c.json({
    url: result.secure_url,
    publicId: result.public_id,
  });
});

export default uploadCloudinaryRoutes;