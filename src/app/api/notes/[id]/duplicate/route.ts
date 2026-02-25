import prisma from "@/lib/prisma";
import { apiError, apiSuccess, getRequestUser } from "@/app/api/_utils";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getRequestUser(req);
  if (!user) return apiError("Not authenticated", 401);

  const { id } = await params;

  const note = await prisma.note.findFirst({
    where: { id, userId: user.id },
    include: { noteTags: true },
  });
  if (!note) return apiError("Note not found", 404);

  const baseTitle = note.title ?? "Untitled";
  const truncatedTitle = baseTitle.substring(0, 248);
  const newTitle = `${truncatedTitle} (Copy)`;

  const data = await prisma.note.create({
    data: {
      userId: user.id,
      content: note.content,
      folderId: note.folderId,
      title: newTitle,
      noteTags: {
        create: note.noteTags.map((nt) => ({
          tagId: nt.tagId,
        })),
      },
    },
  });

  return apiSuccess({ data }, 201);
}
