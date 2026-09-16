import type {Context, Next} from 'hono';
import {auth} from '../utils/auth';

export const adminOnly = async (c: Context, next: Next) => {
    const session = await auth.api.getSession({
        headers: c.req.raw.headers,
    });
    if (!session) {
        return c.json(
        { message: "Authentication required" },
        401
        );
    }

    if (session.user.role !== "admin") {
        return c.json(
        { message: "Admin access required" },
        403
        );
    }

  await next();
}