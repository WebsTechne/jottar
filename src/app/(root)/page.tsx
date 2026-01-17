// app/page.tsx
import { headers } from "next/headers";
import { Note } from "@prisma/client";
import { auth } from "@/lib/auth";
import { overviewNotes as notes } from "@/lib/fetch/get-notes";
import { Header } from "@/components/header";
import { NotesList } from "./notes/page.client";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight03Icon } from "@hugeicons/core-free-icons";
import { getFolders } from "@/lib/fetch/get-folders";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  const overviewNotes: Note[] = (await notes()) ?? [];

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

          {/* client-side list handles updates and archived-removal */}
          <NotesList
            initialNotes={overviewNotes}
            folders={folderDisplay}
            showArchived={false}
          />

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
