import { headers } from "next/headers";
import { Note } from "@prisma/client";
import { auth } from "@/lib/auth";
import { overviewNotes as notes } from "@/lib/fetch/get-notes";
import { Header } from "@/components/header";
import { NoteCard } from "@/components/note-card";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight03Icon } from "@hugeicons/core-free-icons";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  const overviewNotes: Note[] = (await notes()) ?? [];

  return (
    <>
      <Header session={session} />

      <main>
        {/* Notes */}
        <section className="section">
          <h1 className="heading">Notes</h1>

          <div className="container">
            {overviewNotes.map((n) => (
              <NoteCard key={n.id} note={n} />
            ))}

            {overviewNotes.length === 0 && <p>No notes found</p>}
          </div>

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

        {/* Folders */}
        <section className="section">
          <h1 className="heading">Folders</h1>
        </section>
      </main>

      <footer>
        <ul>
          <li>
            <Link href="/legal/privacy">Privacy</Link>
          </li>
          <li>
            <Link href="/legal/terms">Terms and Conditions</Link>
          </li>
        </ul>
      </footer>
    </>
  );
}
