import { FolderListItem } from "@/lib/fetch/get-folders";
import { FolderCard, FolderCardSkeleton } from "@/components/notes/folder-card";

function FoldersList({ folders }: { folders: FolderListItem[] }) {
  return (
    <div className="xs:grid-cols-2 grid w-full gap-3 md:grid-cols-3 lg:grid-cols-4">
      {folders.map((folder: FolderListItem) => (
        <FolderCard key={folder.id} folder={folder} />
      ))}
    </div>
  );
}

function FoldersListSkeleton() {
  return (
    <div className="wrap">
      {[...Array(3)].map((_, i) => (
        <FolderCardSkeleton key={i} />
      ))}
    </div>
  );
}

export { FoldersList, FoldersListSkeleton };
