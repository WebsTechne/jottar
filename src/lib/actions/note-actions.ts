"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createNote(content: string) {
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

export async function updateNote(id: string, content: string) {
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

export async function updateNoteDetails(
  id: string,
  data: {
    title?: string;
    folderId?: string | null;
  },
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { error: "Not authenticated" };
  }

  try {
    const updatedNote = await prisma.note.update({
      where: {
        id: id,
        userId: session.user.id,
      },
      data: {
        title: data.title,
      },
    });

    revalidatePath(`/notes/${id}`);
    revalidatePath(`/`);

    return { data: updatedNote };
  } catch (error) {
    console.error("Failed to update note details:", error);
    return { error: "Failed to update note details" };
  }
}

