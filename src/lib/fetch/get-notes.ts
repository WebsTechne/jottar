// lib/fetch/get-notes.ts
import prisma from "@/lib/prisma";
import { getAuthedUser } from "./get-authed-user";

const getNotes = async () => {
  const user = await getAuthedUser();

  if (!user) {
    throw new Error("Not authenticated");
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
      // new fields
      trashedAt: true,
      allowCopy: true,
      copiedFromNoteId: true,
      copiedFromUserId: true,
      shareLinkType: true,
      shareable: true,
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
      // new fields
      trashedAt: true,
      allowCopy: true,
      copiedFromNoteId: true,
      copiedFromUserId: true,
      shareLinkType: true,
      shareable: true,
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
    where: {
      userId: user.id,
      archived: false,
      trashedAt: null,
      isPinned: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 2,
  });

  const remaining = 3 - pinned.length;

  const unpinned = await prisma.note.findMany({
    where: {
      userId: user.id,
      archived: false,
      trashedAt: null,
      isPinned: false,
    },
    orderBy: { updatedAt: "desc" },
    take: remaining,
  });

  return [...pinned, ...unpinned];
};

export { getNote, getNotes, overviewNotes };
