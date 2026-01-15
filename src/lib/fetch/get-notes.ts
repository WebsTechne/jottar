// lib/fetch/get-notes.ts
import prisma from "@/lib/prisma";
import { cache } from "react";
import { getAuthedUser } from "./get-authed-user";

const getNotes = async () => {
  const user = await getAuthedUser();

  if (!user) {
    return;
  }

  return prisma.note.findMany({
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
    },
    where: { userId: { equals: user.id } },
  });
};
// const getNotes = cache(_getNotes);

const getNote = async (id: string) => {
  const user = await getAuthedUser();

  if (!user) {
    return;
  }

  return prisma.note.findUnique({
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
    },
    where: { id, userId: user.id },
  });
};

const overviewNotes = async () => {
  const user = await getAuthedUser();

  if (!user) {
    return;
  }

  const pinned = await prisma.note.findMany({
    where: { userId: user.id, archived: false, isPinned: true },
    orderBy: { updatedAt: "desc" },
    take: 2,
  });

  const remaining = 3 - pinned.length;

  const unpinned = await prisma.note.findMany({
    where: { userId: user.id, archived: false, isPinned: false },
    orderBy: { updatedAt: "desc" },
    take: remaining,
  });

  return [...pinned, ...unpinned];
};

export { getNote, getNotes, overviewNotes };
