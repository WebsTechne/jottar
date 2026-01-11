import { Header } from "@/components/header";
import { NoteCard } from "@/components/note-card";
import { auth } from "@/lib/auth";
import { Note } from "@prisma/client";
import { headers } from "next/headers";
import { getNotes } from "../../lib/fetch/get-notes";

export default async function Page() {
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
        <section className="mb-5 border-b px-4 py-4">
          <h1 className="mb-2 text-2xl font-extrabold md:text-3xl">Notes</h1>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        </section>
      </main>
    </>
  );
}
