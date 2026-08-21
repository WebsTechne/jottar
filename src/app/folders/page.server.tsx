import Link from "next/link";
import { getFoldersList, getFoldersOverview } from "@/lib/fetch/get-folders";
import { FoldersList } from "./page.client";

async function FoldersListServer() {
  const fetched = await getFoldersList();
  const now = new Date();
  const folders = [
    {
      name: "Shared Notes",
      id: "blah-blah-blah",
      slug: "shared-notes",
      createdAt: now,
      updatedAt: now,
      description: "Notes you made available to others",
      _count: { notes: 0 },
    },
    ...fetched,
  ];
  return <FoldersList folders={folders} />;
}

async function FoldersOverviewServer() {
  const fetched = await getFoldersOverview();
  const now = new Date();
  const foldersOverlay = fetched.concat([
    {
      name: "Shared Notes",
      id: "blah-blah-blah",
      slug: "shared-notes",
      updatedAt: now,
      description: "Notes you made available to others",
      _count: { notes: 0 },
    },
  ]);

  return (
    <div className="wrap-flex">
      {foldersOverlay.length < 1 && (
        <div className="bg-card supports-[corner-shape:squircle]:squircle-card max-w-max! shrink-0 rounded-xl border border-dashed p-3">
          No folders found
        </div>
      )}
      {foldersOverlay.map((folder) => (
        <Link
          key={folder.id}
          href={`/folders/${folder.slug}`}
          className="bg-card supports-[corner-shape:squircle]:squircle-card flex max-w-max! shrink-0 items-center rounded-xl border p-2"
        >
          {folder.name}
        </Link>
      ))}
    </div>
  );
}

export { FoldersListServer, FoldersOverviewServer };
