"use server";

import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";

type SignUpInfo = {
  name: string;
  email: string;
  password: string;
  callbackURL: string;
};
type SignInInfo = {
  email: string;
  password: string;
  callbackURL: string;
};
type SignInSocialInfo = {
  provider: "google" | "apple";
  callbackURL: string;
};

const signUp = async ({ name, email, password, callbackURL }: SignUpInfo) => {
  const result = await auth.api.signUpEmail({
    body: { name, email, password, callbackURL },
  });

  return result;
};

const signIn = async ({ email, password, callbackURL }: SignInInfo) => {
  const result = await auth.api.signInEmail({
    body: { email, password, callbackURL },
  });

  return result;
};

const signInSocial = async ({ provider, callbackURL }: SignInSocialInfo) => {
  const { url } = await auth.api.signInSocial({
    body: { provider, callbackURL },
  });

  if (url) {
    redirect(url);
  }
};

const signOut = async () => {
  const result = await auth.api.signOut({ headers: await headers() });

  return result;
};

export { signIn, signInSocial, signUp, signOut };
