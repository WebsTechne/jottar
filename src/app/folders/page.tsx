// app/folders/page.tsx
import { FoldersListSkeleton } from "./page.client";
import { Suspense } from "react";
import { FoldersListServer } from "./page.server";
import { FolderHeader } from "./folder-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function NotesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <>
      <main>
        <FolderHeader session={session} />

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
