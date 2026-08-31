import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { SharedNoteClient } from "./page.client";
import { Prisma } from "@prisma/client";

interface SharedPageProps {
  params: {
    token: string;
  };
}

export type SharedNote = Prisma.NoteGetPayload<{
  select: {
    archived: true;
    allowCopy: true;
    content: true;
    shareable: true;
    shareLinkType: true;
    shareToken: true;
    title: true;
    trashedAt: true;
    user: {
      select: { displayUsername: true; name: true; image: true };
    };
  };
}>;

export default async function SharedNotePage({ params }: SharedPageProps) {
  const awaitedParams = await params;
  const token = awaitedParams.token;

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return notFound();
  }

  const note = await prisma.note.findFirst({
    where: { shareable: true, shareLinkType: "TOKEN", shareToken: token },
    select: {
      archived: true,
      allowCopy: true,
      content: true,
      shareable: true,
      shareLinkType: true,
      shareToken: true,
      title: true,
      trashedAt: true,
      user: {
        select: { displayUsername: true, name: true, image: true },
      },
    },
  });

  if (!note) return notFound();

  return (
    <>
      <SharedNoteClient note={note} />
    </>
  );
}
