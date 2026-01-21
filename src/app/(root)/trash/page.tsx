// app/trash/page.tsx
import { Suspense } from "react";
import { NotesListSkeleton } from "../notes/page.client";
import { NotesListServer } from "../notes/page.server";

export default async function NotesPage() {
  return (
    <>
      <main>
        <section className="section">
          <h1 className="heading">Trash</h1>

          <Suspense fallback={<NotesListSkeleton />}>
            <NotesListServer type="all" view="trash" />
          </Suspense>
        </section>
      </main>
    </>
  );
}
