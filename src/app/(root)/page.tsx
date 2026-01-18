// app/page.tsx
import { headers } from "next/headers";
import { Note } from "@prisma/client";
import { auth } from "@/lib/auth";
import { Header } from "@/components/header";
import { NotesListSkeleton } from "./notes/page.client";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight03Icon } from "@hugeicons/core-free-icons";
import { getFolders } from "@/lib/fetch/get-folders";
import NotesListServer from "./notes/page.server";
import { Suspense } from "react";

export default async function Page() {
  const [session, folders] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getFolders(),
  ]);

  return (
    <>
      <Header session={session} />

      <main>
        <section className="section">
          <h1 className="heading">Notes</h1>

          <Suspense fallback={<NotesListSkeleton />}>
            <NotesListServer type="overview" />
          </Suspense>

          <div className="footing">
            <Link
              href="/notes"
              className="flex items-center gap-1 hover:underline"
            >
              View all notes
              <HugeiconsIcon icon={ArrowUpRight03Icon} size={16} />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
