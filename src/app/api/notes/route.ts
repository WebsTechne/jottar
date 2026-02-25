import prisma from "@/lib/prisma";
import {
  apiError,
  apiSuccess,
  getRequestUser,
  parseJson,
} from "@/app/api/_utils";

type CreateNoteBody = {
  content?: string;
};

export async function GET(req: Request) {
  const user = await getRequestUser(req);
  if (!user) return apiError("Not authenticated", 401);

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") ?? "list";
  const id = url.searchParams.get("id");

  if (mode === "one") {
    if (!id) return apiError("id is required for mode=one");

    const data = await prisma.note.findUnique({
      select: {
        id: true,
        title: true,
        content: true,
        folderId: true,
        userId: true,
        isPinned: true,
        favorite: true,
        archived: true,
        createdAt: true,
        updatedAt: true,
        noteTags: true,
        trashedAt: true,
        allowCopy: true,
        copiedFromNoteId: true,
        copiedFromUserId: true,
        shareLinkType: true,
        shareable: true,
      },
      where: { id, userId: user.id },
    });

    return apiSuccess({ data });
  }

  if (mode === "overview") {
    const pinned = await prisma.note.findMany({
      where: {
        userId: user.id,
        archived: false,
        trashedAt: null,
        isPinned: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 2,
    });

    const remaining = 3 - pinned.length;

    const unpinned = await prisma.note.findMany({
      where: {
        userId: user.id,
        archived: false,
        trashedAt: null,
        isPinned: false,
      },
      orderBy: { updatedAt: "desc" },
      take: remaining,
    });

    return apiSuccess({ data: [...pinned, ...unpinned] });
  }

  const data = await prisma.note.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      folderId: true,
      userId: true,
      isPinned: true,
      favorite: true,
      archived: true,
      createdAt: true,
      updatedAt: true,
      noteTags: true,
      trashedAt: true,
      allowCopy: true,
      copiedFromNoteId: true,
      copiedFromUserId: true,
      shareLinkType: true,
      shareable: true,
    },
    where: { userId: { equals: user.id } },
  });

  return apiSuccess({ data });
}

export async function POST(req: Request) {
  const user = await getRequestUser(req);
  if (!user) return apiError("Not authenticated", 401);

  const body = await parseJson<CreateNoteBody>(req);
  if (!body?.content) return apiError("content is required");

  const data = await prisma.note.create({
    data: {
      userId: user.id,
      content: body.content,
    },
  });

  return apiSuccess({ data }, 201);
}
