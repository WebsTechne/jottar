// app/notes/page.tsx
import { NotesListSkeleton } from "./page.client";
import { getFolders } from "@/lib/fetch/get-folders";
import { Suspense } from "react";
import { NotesListServer } from "./page.server";

export default async function NotesPage() {
  const folders = (await getFolders()) ?? [];
  const folderDisplay = folders.map((folder) => ({
    name: folder.name,
    id: folder.id,
  }));

  return (
    <>
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
