import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  FolderWithNotes,
  getFolderWithNotes,
  getFoldersForDropdown,
} from "@/lib/fetch/get-folders";
import { NoteCard } from "@/components/notes/note-card";
import { FolderHeader } from "../folder-header";
import { EmptyFolder } from "@/components/notes/empty-note";
import FolderPageClient from "./page.client";

interface FolderPageProps {
  params: {
    slug: string;
  };
}

export default async function FolderPage({ params }: FolderPageProps) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session)
    return (
      <p className="p-4 font-mono">
        You need to be signed in to view this page.{" "}
        <a href="/auth/sign-in" className="underline">
          Sign in
        </a>{" "}
      </p>
    );

  const [folder, folders] = await Promise.all([
    getFolderWithNotes({ folderSlug: slug }),
    getFoldersForDropdown(),
  ]);

  if (!folder)
    return (
      <p className="p-4 font-mono">
        This folder was not found.{" "}
        <a href="/folders" className="underline">
          All folders.
        </a>
      </p>
    );

  return (
    <FolderPageClient folder={folder} session={session} folders={folders} />
  );
}
