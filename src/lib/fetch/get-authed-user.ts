import { auth } from "../auth";
import { headers } from "next/headers";

const getAuthedUser = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  return user;
};

export { getAuthedUser };
