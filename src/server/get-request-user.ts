// vibecoded with chatgpt 😪
import { auth } from "@/lib/auth";

export async function getRequestUser(req: Request) {
  // 1) Try bearer token first (mobile/native clients sometimes prefer this)
  const authHeader = req.headers.get("authorization") ?? "";
  if (authHeader.startsWith("Bearer ")) {
    try {
      const session = await auth.api.getSession({
        headers: { authorization: authHeader },
      });
      if (session?.user) return session.user;
    } catch (err) {
      // ignore and try cookie next
    }
  }

  // 2) Try cookie header (what your Expo code is sending)
  const cookie = req.headers.get("cookie");
  if (cookie) {
    try {
      const session = await auth.api.getSession({ headers: { cookie } });
      if (session?.user) return session.user;
    } catch (err) {
      // fall through
    }
  }

  // 3) Nothing matched
  return null;
}
