import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import NotePageClient from "./page.client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface NotePageProps {
  params: {
    id: string;
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const awaitedParams = await params;

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return notFound();
  }

  const note = await prisma.note.findUnique({
    where: {
      id: awaitedParams.id,
      userId: session.user.id,
    },
  });

  if (!note) {
    return notFound();
  }

  return <NotePageClient note={note} />;
}
