import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';


const app = new Hono();

// Middleware
app.use(
  '*',
  cors({
    origin: '*',
  })
);

app.get('/', (c) => {
  return c.json({
    message: 'API is running',
  });
});

export default app;