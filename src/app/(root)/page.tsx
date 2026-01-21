// app/page.tsx
import { NotesListSkeleton } from "./notes/page.client";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight03Icon } from "@hugeicons/core-free-icons";
import { NotesListServer } from "./notes/page.server";
import { Suspense } from "react";

export default async function Page() {
  return (
    <>
      <main>
        <section className="section">
          <h1 className="heading">Notes</h1>

          <Suspense fallback={<NotesListSkeleton />}>
            <NotesListServer type="overview" view="active" />
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
