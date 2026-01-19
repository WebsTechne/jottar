// app/trash/page.tsx
import { Suspense } from "react";
import { Header } from "@/components/header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NotesListSkeleton } from "../notes/page.client";
import { NotesListServer } from "../notes/page.server";

export default async function NotesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <>
      <Header session={session} />
      <main>
        <section className="section">
          <h1 className="heading">Trashed notes</h1>

          <Suspense fallback={<NotesListSkeleton />}>
            <NotesListServer type="all" showTrashed={true} />
          </Suspense>
        </section>
      </main>
    </>
  );
}
