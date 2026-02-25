import { apiError, apiSuccess, getRequestUser } from "@/app/api/_utils";

export async function GET(req: Request) {
  const user = await getRequestUser(req);

  if (!user) {
    return apiError("Not authenticated", 401);
  }

  return apiSuccess({ data: user });
}
