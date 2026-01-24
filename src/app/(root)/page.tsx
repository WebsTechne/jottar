// app/page.tsx
import { NotesListSkeleton } from "./notes/page.client";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight03Icon } from "@hugeicons/core-free-icons";
import { NotesListServer } from "./notes/page.server";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { FoldersOverviewServer } from "./folders/page.server";

export default async function Page() {
  const widths = [144.34, 160.13, 92.55];

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

          <Suspense
            fallback={
              <div className="wrap-flex">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="corner-squircle relative h-10.5 overflow-clip rounded-4xl border-1"
                    style={{ width: widths[i] }}
                  >
                    <Skeleton className="corner-squircle size-full rounded-[inherit]" />
                  </div>
                ))}
              </div>
            }
          >
            <FoldersOverviewServer />
          </Suspense>

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
