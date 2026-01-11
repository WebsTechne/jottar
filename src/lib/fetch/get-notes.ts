// lib/fetch/get-notes.ts
import prisma from "@/lib/prisma";
import { cache } from "react";
import { auth } from "../auth";
import { headers } from "next/headers";

const _getNotes = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

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
    },
    where: {
      userId: { equals: user.id },
    },
  });
};

export const getNotes = cache(_getNotes);
