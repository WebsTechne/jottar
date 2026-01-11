// lib/fetch/get-notes.ts
import prisma from "@/lib/prisma";
import { cache } from "react";

const _getNotes = async () => {
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
    },
  });
};

export const getNotes = cache(_getNotes);
