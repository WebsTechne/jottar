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
      slug: true,
      description: true,
      updatedAt: true,
      _count: { select: { notes: true } },
    },
  });
};

type FolderOverview = Prisma.FolderGetPayload<{
  select: {
    id: true;
    name: true;
    slug: true;
    updatedAt: true;
    _count: {
      select: {
        notes: true;
      };
    };
  };
}>;

const _getFoldersForDropdown = async () => {
  const user = await getAuthedUser();
  if (!user) return [];

  return prisma.folder.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });
};

type FolderDropdownItem = Prisma.FolderGetPayload<{
  select: {
    id: true;
    name: true;
  };
}>;

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
      slug: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { notes: true } },
    },
  });
};

type FolderListItem = Prisma.FolderGetPayload<{
  select: {
    id: true;
    name: true;
    slug: true;
    description: true;
    createdAt: true;
    updatedAt: true;
    _count: {
      select: {
        notes: true;
      };
    };
  };
}>;

export const getFolderWithNotes = async ({
  folderId,
  folderSlug,
  opts,
}: {
  folderId?: string;
  folderSlug?: string;
  opts?: { take?: number; skip?: number };
}) => {
  const user = await getAuthedUser();

  if (!user) return null;

  if (!folderId && !folderSlug) {
    throw new Error("Either folderId or folderSlug must be provided");
  }

  const take = opts?.take ?? undefined; // use undefined to avoid implicit limit
  const skip = opts?.skip ?? undefined;

  return prisma.folder.findFirst({
    where: {
      userId: user.id,
      ...(folderId ? { id: folderId } : { slug: folderSlug }),
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { notes: true } },
      notes: {
        where: { archived: false, trashedAt: null }, // you could filter archived/trashed here if desired
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

type FolderWithNotes = Prisma.FolderGetPayload<{
  select: {
    id: true;
    name: true;
    slug: true;
    description: true;
    createdAt: true;
    updatedAt: true;
    _count: {
      select: {
        notes: true;
      };
    };
    notes: {
      select: {
        id: true;
        title: true;
        content: true;
        folderId: true;
        userId: true;
        isPinned: true;
        favorite: true;
        archived: true;
        createdAt: true;
        updatedAt: true;
        trashedAt: true;
        allowCopy: true;
        copiedFromNoteId: true;
        copiedFromUserId: true;
        shareLinkType: true;
        shareable: true;
        noteTags: true;
      };
    };
  };
}>;

export const getFolders = cache(_getFolders);
export const getFoldersOverview = cache(_getFoldersOverview);
export const getFoldersForDropdown = cache(_getFoldersForDropdown);
export const getFoldersList = cache(_getFoldersList);

export type {
  FolderOverview,
  FolderDropdownItem,
  FolderListItem,
  FolderWithNotes,
};
