import { NotesList } from "./page.client";
import { getNotes, overviewNotes } from "@/lib/fetch/get-notes";
import { getFolders } from "@/lib/fetch/get-folders";
import { Note } from "@prisma/client";

function prepareNotes(
  notes: Note[],
  {
    limit,
    showArchived,
    showTrashed,
  }: {
    limit?: number;
    showArchived?: boolean;
    showTrashed?: boolean;
  },
) {
  let result = notes;

  // showTrashed takes precedence: show all trashed notes (including archived)
  if (showTrashed) {
    result = result.filter((n) => n.trashedAt != null);
  } else if (showArchived) {
    // only archived notes (exclude trashed ones)
    result = result.filter((n) => n.archived && n.trashedAt == null);
  } else {
    // default: exclude archived and trashed notes from the normal list
    result = result.filter((n) => !n.archived && n.trashedAt == null);
  }

  const ordered =
    showArchived || showTrashed
      ? result.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      : [
          ...result
            .filter((n) => n.isPinned)
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
          ...result
            .filter((n) => !n.isPinned)
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
        ];

  return limit ? ordered.slice(0, limit) : ordered;
}

export async function NotesListServer({
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
    showTrashed,
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
