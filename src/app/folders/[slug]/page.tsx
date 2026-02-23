import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { FolderWithNotes, getFolderWithNotes } from "@/lib/fetch/get-folders";
import { NoteCard } from "@/components/notes/note-card";
import { FolderHeader } from "../folder-header";

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
      <p className="font-mono">
        You need to be signed in to view this page.{" "}
        <a href="/auth/sign-in">Sign in</a>{" "}
      </p>
    );

  const folder: FolderWithNotes | null = await getFolderWithNotes({
    folderSlug: slug,
  });
  if (!folder)
    return (
      <p className="font-mono">
        This folder was not found. <a href="/folders">All folders.</a>
      </p>
    );

  return (
    <>
      <FolderHeader session={session} back={true}></FolderHeader>

      {/*Metadata and options*/}
      <section className="section">
        <h1 className="heading">{folder.name}</h1>
        <p className="description">{folder.description}</p>

        <section className="wrap">
          {folder.notes.map((note) => (
            <NoteCard key={note.id} note={note} view="active" folders={[]} />
          ))}
        </section>
      </section>
    </>
  );
}
