"use server";

import prisma from "@/lib/prisma";
import { getAuthedUser } from "@/lib/fetch/get-authed-user";
import { revalidatePath } from "next/cache";

async function createFolder({
  name,
  slug,
  description,
}: {
  name: string;
  slug: string;
  description?: string;
}) {
  const user = await getAuthedUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  try {
    const result = await prisma.folder.create({
      data: { name, slug, description, userId: user.id },
    });

    revalidatePath("/folders");
    return { data: result };
  } catch (err) {
    console.error("Failed to create Folder:", err);
    return { error: "There was an error creating your folder." };
  }
}

async function updateFolder({
  id,
  name,
  slug,
  description,
}: {
  id: string;
  name: string;
  slug: string;
  description: string;
}) {
  const user = await getAuthedUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  try {
    const result = await prisma.folder.update({
      where: { id, userId: user.id },
      data: { name, slug, description },
    });

    revalidatePath(`/folders/${slug}`);
    return { data: result };
  } catch (err) {
    console.error("Failed to update Folder:", err);
    return { error: "There was an error updating your folder." };
  }
}

async function updateNoteFolder(
  noteId: string,
  folderId: string | null, // allow null to "remove from folder"
) {
  const user = await getAuthedUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  try {
    // If assigning to a folder, verify ownership
    if (folderId) {
      const folderExists = await prisma.folder.findFirst({
        where: {
          id: folderId,
          userId: user.id,
        },
        select: { id: true },
      });

      if (!folderExists) {
        return { error: "Folder not found" };
      }
    }

    const result = await prisma.note.updateMany({
      where: {
        id: noteId,
        userId: user.id,
        trashedAt: null,
      },
      data: {
        folderId,
      },
    });

    if (result.count === 0) {
      return { error: "Note not found or not allowed" };
    }

    // Cache hygiene
    revalidatePath("/");
    revalidatePath("/notes");

    return { success: true };
  } catch (err) {
    console.error("Failed to update note folder:", err);
    return { error: "Failed to update note folder" };
  }
}

export { createFolder, updateFolder, updateNoteFolder };
