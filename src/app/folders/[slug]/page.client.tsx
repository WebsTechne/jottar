"use client";

import { EmptyFolder } from "@/components/notes/empty-note";
import { FolderHeader } from "../folder-header";
import { FolderDropdownItem, FolderWithNotes } from "@/lib/fetch/get-folders";
import { ServerSession } from "@/app/layout";
import { NoteCard } from "@/components/notes/note-card";

export default function FolderPageClient({
  folder,
  folders,
  session,
}: {
  folder: FolderWithNotes;
  folders: FolderDropdownItem[];
  session: ServerSession;
}) {
  return (
    <main className="mx-auto w-full max-w-400">
      <FolderHeader session={session} back={true}></FolderHeader>

      {/*Metadata and options*/}
      <section className="section">
        <h1 className="heading">{folder.name}</h1>
        <p className="description">{folder.description}</p>

        <section className="wrap">
          {folder.notes.length === 0 && <EmptyFolder />}

          {folder.notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              view="folder"
              folders={folders}
            />
          ))}
        </section>
      </section>
    </main>
  );
}
