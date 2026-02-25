import prisma from "@/lib/prisma";
import { apiError, apiSuccess, getRequestUser } from "@/app/api/_utils";

type ToggleArchiveRow = {
  archived: boolean;
} & Record<string, unknown>;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getRequestUser(req);
  if (!user) return apiError("Not authenticated", 401);

  const { id } = await params;

  try {
    const rows = await prisma.$queryRaw<ToggleArchiveRow[]>`
      UPDATE "note"
      SET "archived" = NOT "archived", "updatedAt" = NOW()
      WHERE id = ${id}::uuid AND "userId" = ${user.id}::uuid
      RETURNING *;
    `;

    if (!rows || rows.length === 0) {
      return apiError("Note not found or access denied", 404);
    }

    const data = rows[0];

    return apiSuccess({
      data,
      message: data.archived ? "Archived" : "Unarchived",
    });
  } catch (error: unknown) {
    console.error("toggleArchive error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to toggle archive";
    return apiError(message);
  }
}
