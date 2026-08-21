import { createAuthClient } from "better-auth/react";
import {
  usernameClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import type { auth } from "./auth";

const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [usernameClient(), inferAdditionalFields<typeof auth>()],
});

export { authClient };
