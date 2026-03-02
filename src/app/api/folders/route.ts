import prisma from "../../../lib/prisma";
import {
  apiError,
  apiSuccess,
  getRequestUser,
  parseJson,
} from "@/app/api/_utils";

type CreateFolderBody = {
  name?: string;
  slug?: string;
  description?: string;
  userId?: string;
};

export async function GET(req: Request) {
  const user = await getRequestUser(req);
  if (!user) return apiError("Not authenticated", 401);

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") ?? "list";
  const folderId = url.searchParams.get("folderId") ?? undefined;
  const folderSlug = url.searchParams.get("folderSlug") ?? undefined;
  const takeRaw = url.searchParams.get("take");
  const skipRaw = url.searchParams.get("skip");

  if (folderId || folderSlug) {
    if (!folderId && !folderSlug) {
      return apiError("Either folderId or folderSlug must be provided");
    }

    const take = takeRaw ? Number(takeRaw) : undefined;
    const skip = skipRaw ? Number(skipRaw) : undefined;

    const data = await prisma.folder.findFirst({
      where: {
        userId: user.id,
        ...(folderId ? { id: folderId } : { slug: folderSlug }),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { notes: true } },
        notes: {
          where: { archived: false, trashedAt: null },
          orderBy: { updatedAt: "desc" },
          take,
          skip,
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
        },
      },
    });

    return apiSuccess({ data });
  }

  if (mode === "overview") {
    const data = await prisma.folder.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        updatedAt: true,
        _count: { select: { notes: true } },
      },
    });

    return apiSuccess({ data });
  }

  if (mode === "dropdown") {
    const data = await prisma.folder.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    });

    return apiSuccess({ data });
  }

  const data = await prisma.folder.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { notes: true } },
    },
  });

  return apiSuccess({ data });
}

export async function POST(req: Request) {
  const user = await getRequestUser(req);
  if (!user) return apiError("Not authenticated", 401);

  const body = await parseJson<CreateFolderBody>(req);
  if (!body?.name || !body?.slug) {
    return apiError("name and slug are required");
  }

  try {
    const data = await prisma.folder.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        // Preserve existing action contract while defaulting safely to authed user.
        userId: user.id,
      },
    });

    return apiSuccess({ data }, 201);
  } catch (error) {
    console.error("Failed to create Folder:", error);
    return apiError("There was an error creating your folder.");
  }
}
