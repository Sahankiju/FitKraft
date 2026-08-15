import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db_connection";
import { schema } from "../db/schema/schema";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    requireEmailVerification: true,
  },

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  plugins: [
    emailOTP({
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        console.log("Sending verification OTP:", { email, otp, type });
        if (type !== "email-verification") return;

        const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

        const { data, error } = await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: "Verify your FitKraft email",
          html: `
            <h2>FitKraft Email Verification</h2>
            <p>Your verification code is:</p>
            <h1>${otp}</h1>
          `,
        });

        console.log("Resend data:", data);
        console.log("Resend error:", error);

        if (error) {
          throw new Error(`Failed to send verification email: ${error.message}`);
        }

        if (!data?.id) {
          throw new Error("Verification email was not accepted by Resend.");
        }
      },
    }),
  ],
});