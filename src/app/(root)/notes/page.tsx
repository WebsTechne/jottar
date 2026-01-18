// app/notes/page.tsx
import { Header } from "@/components/header";
import { NotesList, NotesListSkeleton } from "./page.client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getNotes } from "@/lib/fetch/get-notes";
import { getFolders } from "@/lib/fetch/get-folders";
import { Suspense } from "react";
import NotesListServer from "./page.server";

export default async function NotesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const result = await getNotes();
  const allNotes = Array.isArray(result) ? result : [];

  const folders = (await getFolders()) ?? [];
  const folderDisplay = folders.map((folder) => ({
    name: folder.name,
    id: folder.id,
  }));

  return (
    <>
      <Header session={session} />
      <main>
        <section className="section">
          <h1 className="heading">Notes</h1>

          <Suspense fallback={<NotesListSkeleton />}>
            <NotesListServer type="all" />
          </Suspense>
        </section>
      </main>
    </>
  );
}
