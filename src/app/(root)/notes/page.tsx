// app/notes/page.tsx
import { NotesListSkeleton } from "./page.client";
import { Suspense } from "react";
import { NotesListServer } from "./page.server";

export default async function NotesPage() {
  return (
    <>
      <main>
        <section className="section">
          <h1 className="heading">Notes</h1>

          <Suspense fallback={<NotesListSkeleton />}>
            <NotesListServer type="all" view="active" />
          </Suspense>
        </section>
      </main>
    </>
  );
}
