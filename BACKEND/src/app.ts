import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';

import { auth } from "./utils/auth";

const app = new Hono();

// Middleware
app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


// Better Auth
app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

// Test route
app.get("/", (c) => {
  return c.json({
    message: "API is running",
  });
});

app.route('/',productRoutes);
app.route('/', categoryRoutes);

export default app;