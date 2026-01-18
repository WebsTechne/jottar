import { NotesList } from "./page.client";
import { getNotes, overviewNotes } from "@/lib/fetch/get-notes";
import { getFolders } from "@/lib/fetch/get-folders";
import { Note } from "@prisma/client";

function prepareNotes(
  notes: Note[],
  {
    limit,
    showArchived,
  }: {
    limit?: number;
    showArchived?: boolean;
  },
) {
  let result = notes;

  if (!showArchived) {
    result = result.filter((n) => !n.archived);
  }

  const pinned = result
    .filter((n) => n.isPinned)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  const unpinned = result
    .filter((n) => !n.isPinned)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  const ordered = [...pinned, ...unpinned];

  return limit ? ordered.slice(0, limit) : ordered;
}

export default async function NotesListServer({
  type,
  showArchived = false,
  showTrashed = false,
}: {
  type: "overview" | "all";
  showArchived?: boolean;
  showTrashed?: boolean;
}) {
  const [folders, notes] = await Promise.all([
    getFolders(),
    type === "overview" ? overviewNotes() : getNotes(),
  ]);

  const folderDisplay = (folders ?? []).map((f) => ({
    id: f.id,
    name: f.name,
  }));

  const allNotes = Array.isArray(notes) ? notes : [];

  const preparedNotes = prepareNotes(allNotes, {
    limit: type === "overview" ? 3 : undefined,
    showArchived,
  });

  return (
    <NotesList
      initialNotes={preparedNotes}
      folders={folderDisplay}
      showArchived={showArchived}
      showTrashed={showTrashed}
    />
  );
}
