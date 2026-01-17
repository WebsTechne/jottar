// app/notes/page.tsx
import { Header } from "@/components/header";
import { NotesList } from "./page.client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getNotes } from "@/lib/fetch/get-notes";
import { getFolders } from "@/lib/fetch/get-folders";

export default async function NotesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const result = await getNotes();
  const allNotes = Array.isArray(result) ? result : [];

  const folders = (await getFolders()) ?? [];
  const folderDisplay = folders.map((folder) => ({
    name: folder.name,
    id: folder.id,
  }));

  // you were filtering out archived server-side — that's fine, but client can also prune
  const activeNotes = allNotes.filter((n) => !n.archived);

  // order pinned first
  const pinnedNotes = activeNotes
    .filter((n) => n.isPinned)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  const unpinnedNotes = activeNotes
    .filter((n) => !n.isPinned)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  const initialNotes = [...pinnedNotes, ...unpinnedNotes];

  return (
    <>
      <Header session={session} />
      <main>
        <section className="section">
          <h1 className="heading">Notes</h1>
          <NotesList
            initialNotes={initialNotes}
            folders={folderDisplay}
            showArchived={false}
          />
        </section>
      </main>
    </>
  );
}
