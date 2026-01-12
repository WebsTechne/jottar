// lib/fetch/get-folders.ts
import prisma from "@/lib/prisma";
import { cache } from "react";
import { auth } from "../auth";
import { headers } from "next/headers";
import { Prisma } from "@prisma/client";

const _getFolders = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

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

export const getFolders = cache(_getFolders);

export type FolderWithNotes = Prisma.FolderGetPayload<{
  include: {
    notes: true;
  };
}>;
