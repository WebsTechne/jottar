import Link from "next/link";
import { getFoldersList, getFoldersOverview } from "@/lib/fetch/get-folders";
import { FoldersList } from "./page.client";

async function FoldersListServer() {
  const folders = await getFoldersList();
  return <FoldersList folders={folders} />;
}

async function FoldersOverviewServer() {
  const foldersOverlay = await getFoldersOverview();

  return (
    <div className="wrap-flex">
      {foldersOverlay.length < 1 && (
        <div className="bg-card corner-squircle max-w-max! shrink-0 rounded-4xl border border-dashed p-3">
          No folders found
        </div>
      )}
      {foldersOverlay.map((folder) => (
        <Link
          key={folder.id}
          href={`/folders/${folder.slug}`}
          className="bg-card corner-squircle flex max-w-max! shrink-0 items-center rounded-4xl border p-2"
        >
          {folder.name}
        </Link>
      ))}
    </div>
  );
}

export { FoldersListServer, FoldersOverviewServer };
