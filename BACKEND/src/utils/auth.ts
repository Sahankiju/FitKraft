import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db_connection";
import { schema } from "../db/schema/schema";

export const auth = betterAuth({
    trustedOrigins: ["http://localhost:5173"],

    baseURL: process.env.BETTER_AUTH_URL, 
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },

    emailAndPassword: {
        enabled: true,
    },

    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
});