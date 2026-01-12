import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import NotePageClient from "./page.client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getFolders } from "@/lib/fetch/get-folders";
import { getTags } from "@/lib/fetch/get-tags";
import { Prisma } from "@prisma/client";

interface NotePageProps {
  params: {
    id: string;
  };
}

export type NoteWithNoteTags = Prisma.NoteGetPayload<{
  include: {
    noteTags: {
      select: {
        tagId: true;
      };
    };
  };
}>;

export default async function NotePage({ params }: NotePageProps) {
  const awaitedParams = await params;

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return notFound();
  }

  const note: NoteWithNoteTags | null = await prisma.note.findUnique({
    where: {
      id: awaitedParams.id,
      userId: session.user.id,
    },
    include: {
      noteTags: {
        select: {
          tagId: true,
        },
      },
    },
  });

  const [folders, tags] = await Promise.all([getFolders(), getTags()]);

  if (!note) {
    return notFound();
  }

  return (
    <NotePageClient note={note} folders={folders || []} tags={tags || []} />
  );
}
