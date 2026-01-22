// app/page.tsx
import { NotesListSkeleton } from "./notes/page.client";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight03Icon } from "@hugeicons/core-free-icons";
import { NotesListServer } from "./notes/page.server";
import { Suspense } from "react";
import { getFoldersOverview } from "@/lib/fetch/get-folders";

export default async function Page() {
  const foldersOverlay = await getFoldersOverview();

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

        {/* Folders */}
        <section className="section">
          <h1 className="heading">Folders</h1>

          <div className="wrap-flex">
            <Suspense fallback={<></>}>
              {foldersOverlay.length < 1 && (
                <div className="bg-card corner-squircle max-w-max! shrink-0 rounded-4xl border border-dashed p-3">
                  No folders found
                </div>
              )}
              {foldersOverlay.map((folder) => (
                <div
                  key={folder.id}
                  className="bg-card corner-squircle max-w-max! shrink-0 rounded-4xl border p-3"
                >
                  {folder.name}
                </div>
              ))}
            </Suspense>
          </div>

          <div className="footing">
            <Link
              href="/folders"
              className="flex items-center gap-1 hover:underline"
            >
              View all folders
              <HugeiconsIcon icon={ArrowUpRight03Icon} size={16} />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
