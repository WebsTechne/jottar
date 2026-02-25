import prisma from "@/lib/prisma";
import {
  apiError,
  apiSuccess,
  getRequestUser,
  parseJson,
} from "@/app/api/_utils";

type UpdateNoteFolderBody = {
  folderId?: string | null;
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getRequestUser(req);
  if (!user) return apiError("Not authenticated", 401);

  const { id: noteId } = await params;
  const body = await parseJson<UpdateNoteFolderBody>(req);

  if (!body || body.folderId === undefined) {
    return apiError("folderId is required (set null to remove folder)");
  }

  if (body.folderId) {
    const folderExists = await prisma.folder.findFirst({
      where: {
        id: body.folderId,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!folderExists) {
      return apiError("Folder not found", 404);
    }
  }

  const result = await prisma.note.updateMany({
    where: {
      id: noteId,
      userId: user.id,
      trashedAt: null,
    },
    data: {
      folderId: body.folderId,
    },
  });

  if (result.count === 0) {
    return apiError("Note not found or not allowed", 404);
  }

  return apiSuccess({ success: true });
}
