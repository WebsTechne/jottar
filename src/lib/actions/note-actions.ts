"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// ///// CREATE
async function createNote(content: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { error: "Not authenticated" };
  }

  const newNote = await prisma.note.create({
    data: {
      userId: session.user.id,
      content: content,
    },
  });

  revalidatePath("/");

  return { data: newNote };
}

async function createTag(name: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { error: "Not authenticated" };
  }

  const newTag = await prisma.tag.create({
    data: {
      userId: session.user.id,
      name: name,
    },
  });

  revalidatePath("/");

  return { data: newTag };
}

async function updateNote(id: string, content: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { error: "Not authenticated" };
  }

  const updatedNote = await prisma.note.update({
    where: {
      id: id,
      userId: session.user.id,
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
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Not authenticated" };

  if (data.title === undefined && data.folderId === undefined) {
    return { error: "Nothing to update: provide title, folderId, or both." };
  }

  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.folderId !== undefined) updateData.folderId = data.folderId;

  try {
    const updatedNote = await prisma.note.update({
      where: { id, userId: session.user.id },
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
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { error: "Not authenticated" };
  }

  try {
    const updatedNote = await prisma.note.update({
      where: {
        id,
        userId: session.user.id,
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

export {
  createNote,
  createTag,
  updateNote,
  updateNoteDetails,
  updateNoteFolder,
};
