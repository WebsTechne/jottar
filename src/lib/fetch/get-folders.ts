// lib/fetch/get-folders.ts
import prisma from "@/lib/prisma";
import { cache } from "react";
import { Prisma } from "@prisma/client";
import { getAuthedUser } from "./get-authed-user";

const _getFoldersOverview = async () => {
  const user = await getAuthedUser();
  if (!user) return [];

  return prisma.folder.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: 3,
    select: {
      id: true,
      name: true,
      description: true,
      updatedAt: true,
      _count: { select: { notes: true } },
    },
  });
};

const _getFolders = async () => {
  const user = await getAuthedUser();

  if (!user) {
    return;
  }

  return prisma.folder.findMany({
    where: { userId: { equals: user.id } },
    include: {
      notes: true,
    },
  });
};

const _getFoldersList = async () => {
  const user = await getAuthedUser();
  if (!user) return [];

  return prisma.folder.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" }, // or updatedAt if you prefer
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { notes: true } },
    },
  });
};

export const getFolderWithNotes = async (
  folderId: string,
  opts?: { take?: number; skip?: number },
) => {
  const user = await getAuthedUser();
  if (!user) return null;

  const take = opts?.take ?? undefined; // use undefined to avoid implicit limit
  const skip = opts?.skip ?? undefined;

  return prisma.folder.findFirst({
    where: { id: folderId, userId: user.id },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { notes: true } },
      notes: {
        where: {}, // you could filter archived/trashed here if desired
        orderBy: { updatedAt: "desc" },
        take,
        skip,
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
          trashedAt: true,
          allowCopy: true,
          copiedFromNoteId: true,
          copiedFromUserId: true,
          shareLinkType: true,
          shareable: true,
        },
      },
    },
  });
};

export const getFolders = cache(_getFolders);
export const getFoldersOverview = cache(_getFoldersOverview);
export const getFoldersList = cache(_getFoldersList);

export type FolderWithNotes = Prisma.FolderGetPayload<{
  include: {
    notes: true;
  };
}>;
