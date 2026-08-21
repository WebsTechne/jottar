import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import prisma from "./prisma";

export const auth = betterAuth({
  ///// Setup
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  ///// Advanced
  advanced: { database: { generateId: () => crypto.randomUUID() } },

  ///// Email & Password
  emailAndPassword: { enabled: true, autoSignIn: true },

  ///// Social providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  ///// Trust expo mobile
  trustedOrigins: [
    "jottar://",
    "jottar://*",
    "exp://",
    "exp://**",
    "exp://10.198.*.*:*/**",
    "http://10.12.162.24:3000",
  ],

  ///// Plugins
  plugins: [username(), nextCookies()],
});
