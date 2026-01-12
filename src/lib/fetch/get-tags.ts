// lib/fetch/get-tags.ts
import prisma from "@/lib/prisma";
import { cache } from "react";
import { auth } from "../auth";
import { headers } from "next/headers";
import { Prisma } from "@prisma/client";

const _getTags = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) {
    return;
  }

  return prisma.tag.findMany({
    select: {
      id: true,
      name: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      noteTags: {
        select: {
          noteId: true,
          tagId: true,
        },
      },
    },
    where: { userId: { equals: user.id } },
  });
};

export const getTags = cache(_getTags);

export type TagWithNoteTags = Prisma.TagGetPayload<{
  select: {
    id: true;
    name: true;
    userId: true;
    createdAt: true;
    updatedAt: true;
    noteTags: {
      select: {
        noteId: true;
        tagId: true;
      };
    };
  };
}>;
