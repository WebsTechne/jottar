import prisma from "@/lib/prisma";
import { apiError, apiSuccess, getRequestUser } from "@/app/api/_utils";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getRequestUser(req);
  if (!user) return apiError("Not authenticated", 401);

  const { id } = await params;

  const data = await prisma.note.update({
    where: { id, userId: user.id },
    data: { trashedAt: null },
  });

  return apiSuccess({ data });
}
