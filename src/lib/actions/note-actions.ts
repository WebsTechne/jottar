"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createNote(content: object) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { error: "Not authenticated" };
  }

  const newNote = await prisma.note.create({
    data: {
      userId: session.user.id,
      content: JSON.stringify(content),
    },
  });

  revalidatePath("/");

  return { data: newNote };
}

export async function updateNote(id: string, content: object) {
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
      content: JSON.stringify(content),
    },
  });

  revalidatePath(`/notes/${id}`);

  return { data: updatedNote };
}
