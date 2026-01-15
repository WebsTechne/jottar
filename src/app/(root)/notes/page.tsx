import { Header } from "@/components/header";
import { NoteCard } from "@/components/note-card";
import { auth } from "@/lib/auth";
import { Note } from "@prisma/client";
import { headers } from "next/headers";
import { getNotes } from "@/lib/fetch/get-notes";
import { CreateNewBtn } from "./create-new-btn";

export default async function NotesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const allNotes: Note[] = (await getNotes()) ?? [];

  const activeNotes = allNotes.filter((n) => !n.archived);

  const pinnedNotes = activeNotes
    .filter((n) => n.isPinned)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  const unpinnedNotes = activeNotes
    .filter((n) => !n.isPinned)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return (
    <>
      <Header session={session} />

      <main>
        <section className="section">
          <h1 className="heading">Notes</h1>

          <div className="container">
            {pinnedNotes.map((n) => (
              <NoteCard key={n.id} note={n} />
            ))}

            {unpinnedNotes.map((n) => (
              <NoteCard key={n.id} note={n} />
            ))}

            {pinnedNotes.length === 0 && unpinnedNotes.length === 0 && (
              <p>No notes found</p>
            )}
          </div>

          <CreateNewBtn />
        </section>
      </main>
    </>
  );
}
