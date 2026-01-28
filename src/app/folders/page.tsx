// app/folders/page.tsx
import { FoldersListSkeleton } from "./page.client";
import { Suspense } from "react";
import { FoldersListServer } from "./page.server";

export default async function NotesPage() {
  return (
    <>
      <main>
        <section className="section">
          <h1 className="heading">Folders</h1>

          <Suspense fallback={<FoldersListSkeleton />}>
            <FoldersListServer />
          </Suspense>
        </section>
      </main>
    </>
  );
}
