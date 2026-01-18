"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getAuthedUser } from "@/lib/fetch/get-authed-user";

// ///// CREATE
async function createNote(content: string) {
  const user = await getAuthedUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const newNote = await prisma.note.create({
    data: {
      userId: user.id,
      content: content,
    },
  });

  revalidatePath("/");

  return { data: newNote };
}

async function createTag(name: string) {
  const user = await getAuthedUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const newTag = await prisma.tag.create({
    data: {
      userId: user.id,
      name: name,
    },
  });

  revalidatePath("/");

  return { data: newTag };
}

// ///// TOGGLE
// faster toggle using one SQL statement
async function togglePin(id: string) {
  const user = await getAuthedUser();
  if (!user) return { error: "Not authenticated" };

  try {
    const rows: any[] = await prisma.$queryRaw`
      UPDATE "note"
      SET "isPinned" = NOT "isPinned", "updatedAt" = NOW()
      WHERE id = ${id}::uuid AND "userId" = ${user.id}::uuid
      RETURNING *;
    `;

    if (!rows || rows.length === 0) {
      return { error: "Note not found or access denied" };
    }

    const updated = rows[0];
    // revalidatePath(`/notes/${id}`);
    // revalidatePath(`/`);

    return { data: updated, message: updated.isPinned ? "Pinned" : "Unpinned" };
  } catch (err: any) {
    console.error("togglePin error:", err);
    return { error: err.message || "Failed to toggle pin" };
  }
}

async function toggleFavorite(id: string) {
  const user = await getAuthedUser();
  if (!user) return { error: "Not authenticated" };

  try {
    const rows: any[] = await prisma.$queryRaw`
      UPDATE "note"
      SET "favorite" = NOT "favorite", "updatedAt" = NOW()
      WHERE id = ${id}::uuid AND "userId" = ${user.id}::uuid
      RETURNING *;
    `;

    if (!rows || rows.length === 0) {
      return { error: "Note not found or access denied" };
    }

    const updated = rows[0];
    // revalidatePath(`/notes/${id}`);
    // revalidatePath(`/`);

    return {
      data: updated,
      message: updated.favorite
        ? "Added to favorites"
        : "Removed from favorites",
    };
  } catch (err: any) {
    console.error("toggleFavorite error:", err);
    return { error: err.message || "Failed to toggle favorite" };
  }
}

async function toggleArchive(id: string) {
  const user = await getAuthedUser();
  if (!user) return { error: "Not authenticated" };

  try {
    const rows: any[] = await prisma.$queryRaw`
      UPDATE "note"
      SET "archived" = NOT "archived", "updatedAt" = NOW()
      WHERE id = ${id}::uuid AND "userId" = ${user.id}::uuid
      RETURNING *;
    `;

    if (!rows || rows.length === 0) {
      return { error: "Note not found or access denied" };
    }

    const updated = rows[0];
    // revalidatePath(`/notes/${id}`);
    // revalidatePath(`/`);

    return {
      data: updated,
      message: updated.archived ? "Archived" : "Unarchived",
    };
  } catch (err: any) {
    console.error("toggleArchive error:", err);
    return { error: err.message || "Failed to toggle archive" };
  }
}

// ///// UPDATE
async function updateNote(id: string, content: string) {
  const user = await getAuthedUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const updatedNote = await prisma.note.update({
    where: {
      id: id,
      userId: user.id,
    },
    data: {
      content: content,
    },
  });

  revalidatePath(`/notes/${id}`);

  return { data: updatedNote };
}

async function updateNoteDetails(
  id: string,
  data: {
    title?: string;
    folderId?: string | null;
  },
) {
  const user = await getAuthedUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  if (data.title === undefined && data.folderId === undefined) {
    return { error: "Nothing to update: provide title, folderId, or both." };
  }

  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.folderId !== undefined) updateData.folderId = data.folderId;

  try {
    const updatedNote = await prisma.note.update({
      where: { id, userId: user.id },
      data: updateData,
    });

    revalidatePath(`/notes/${id}`);
    revalidatePath(`/`);

    let message = "Note updated successfully";
    if (data.title !== undefined && data.folderId === undefined)
      message = "Title updated successfully";
    if (data.folderId !== undefined && data.title === undefined)
      message = "Folder updated successfully";
    if (data.title !== undefined && data.folderId !== undefined)
      message = "Title and folder updated successfully";

    return { data: updatedNote, message };
  } catch (error) {
    console.error("Failed to update note details:", error);

    let message = "Failed to update note";
    if (data.title !== undefined && data.folderId === undefined)
      message = "Failed to update title";
    if (data.folderId !== undefined && data.title === undefined)
      message = "Failed to update folder";
    if (data.title !== undefined && data.folderId !== undefined)
      message = "Failed to update title and folder";

    return { error: message };
  }
}

async function updateNoteFolder(id: string, folderId: string | null) {
  const user = await getAuthedUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  try {
    const updatedNote = await prisma.note.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        folderId: folderId,
      },
    });

    revalidatePath(`/notes/${id}`);
    revalidatePath(`/`);

    return { data: updatedNote };
  } catch (error) {
    console.error("Failed to update note folder:", error);
    return { error: "Failed to update note folder" };
  }
}

// ///// TRASH
async function trashNote(id: string) {
  const user = await getAuthedUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const updatedNote = await prisma.note.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      trashedAt: new Date(),
    },
  });

  revalidatePath(`/notes/${id}`);

  return { data: updatedNote };
}

async function restoreNote(id: string) {
  const user = await getAuthedUser();
  if (!user) return { error: "Not authenticated" };

  const updatedNote = await prisma.note.update({
    where: { id, userId: user.id },
    data: { trashedAt: null },
  });

  revalidatePath(`/notes/${id}`);
  return { data: updatedNote };
}

export {
  createNote,
  createTag,
  //
  togglePin,
  toggleFavorite,
  toggleArchive,
  //
  updateNote,
  updateNoteDetails,
  updateNoteFolder,
  //
  trashNote,
  restoreNote,
};
