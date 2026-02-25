import prisma from "@/lib/prisma";
import {
  apiError,
  apiSuccess,
  getRequestUser,
  parseJson,
} from "@/app/api/_utils";

type UpdateBody = {
  content?: string;
  title?: string;
  folderId?: string | null;
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getRequestUser(req);
  if (!user) return apiError("Not authenticated", 401);

  const { id } = await params;

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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getRequestUser(req);
  if (!user) return apiError("Not authenticated", 401);

  const { id } = await params;
  const body = await parseJson<UpdateBody>(req);
  if (!body) return apiError("Invalid JSON body");

  const hasContent = body.content !== undefined;
  const hasDetails = body.title !== undefined || body.folderId !== undefined;

  if (hasContent && hasDetails) {
    return apiError(
      "Provide either content updates or title/folderId updates in one request.",
    );
  }

  if (!hasContent && !hasDetails) {
    return apiError("Nothing to update");
  }

  if (hasContent) {
    const data = await prisma.note.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        content: body.content,
      },
    });

    return apiSuccess({ data });
  }

  const updateData: { title?: string; folderId?: string | null } = {};
  if (body.title !== undefined) updateData.title = body.title;
  if (body.folderId !== undefined) updateData.folderId = body.folderId;

  try {
    const data = await prisma.note.update({
      where: { id, userId: user.id },
      data: updateData,
    });

    let message = "Note updated successfully";
    if (body.title !== undefined && body.folderId === undefined) {
      message = "Title updated successfully";
    }
    if (body.folderId !== undefined && body.title === undefined) {
      message = "Folder updated successfully";
    }
    if (body.title !== undefined && body.folderId !== undefined) {
      message = "Title and folder updated successfully";
    }

    return apiSuccess({ data, message });
  } catch (error) {
    console.error("Failed to update note details:", error);

    let message = "Failed to update note";
    if (body.title !== undefined && body.folderId === undefined) {
      message = "Failed to update title";
    }
    if (body.folderId !== undefined && body.title === undefined) {
      message = "Failed to update folder";
    }
    if (body.title !== undefined && body.folderId !== undefined) {
      message = "Failed to update title and folder";
    }

    return apiError(message);
  }
}
