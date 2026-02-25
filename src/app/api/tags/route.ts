import prisma from "@/lib/prisma";
import {
  apiError,
  apiSuccess,
  getRequestUser,
  parseJson,
} from "@/app/api/_utils";

type CreateTagBody = {
  name?: string;
};

export async function GET(req: Request) {
  const user = await getRequestUser(req);
  if (!user) return apiError("Not authenticated", 401);

  const data = await prisma.tag.findMany({
    select: {
      id: true,
      name: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      noteTags: {
        select: {
          noteId: true,
          tagId: true,
        },
      },
    },
    where: { userId: { equals: user.id } },
  });

  return apiSuccess({ data });
}

export async function POST(req: Request) {
  const user = await getRequestUser(req);
  if (!user) return apiError("Not authenticated", 401);

  const body = await parseJson<CreateTagBody>(req);
  if (!body?.name) return apiError("name is required");

  const data = await prisma.tag.create({
    data: {
      userId: user.id,
      name: body.name,
    },
  });

  return apiSuccess({ data }, 201);
}
