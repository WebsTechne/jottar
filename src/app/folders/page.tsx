// app/folders/page.tsx
import { FoldersListSkeleton } from "./page.client";
import { Suspense } from "react";
import { FoldersListServer } from "./page.server";
import { FolderHeader } from "./folder-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NewFolderLink } from "./new-folder-link";

export default async function NotesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <>
      <main className="mx-auto w-full max-w-400">
        <FolderHeader session={session}>
          <NewFolderLink />
        </FolderHeader>

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
