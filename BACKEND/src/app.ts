import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';


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

app.route('/',productRoutes);
app.route('/', categoryRoutes);

export default app;