import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
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
    "jottar://", // Basic scheme
    "jottar://*", // Wildcard support for all paths following the scheme
    "exp://", // Trust all Expo URLs (prefix matching)
    "exp://**", // Trust all Expo URLs (wildcard matching)
    "exp://10.198.*.*:*/**", // Trust 10.198.x.x IP range with any port and path,
    "http://10.10.54.32:3000",
  ],

  ///// Plugins
  plugins: [nextCookies()],
});
