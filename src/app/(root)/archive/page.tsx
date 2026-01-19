// app/archive/page.tsx
import { Suspense } from "react";
import { Header } from "@/components/header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getFolders } from "@/lib/fetch/get-folders";
import { NotesListSkeleton } from "../notes/page.client";
import { NotesListServer } from "../notes/page.server";

export default async function NotesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

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
          <h1 className="heading">Archived notes</h1>

          <Suspense fallback={<NotesListSkeleton />}>
            <NotesListServer type="all" showArchived={true} />
          </Suspense>
        </section>
      </main>
    </>
  );
}
