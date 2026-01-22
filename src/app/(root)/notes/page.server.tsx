import { NotesList } from "./page.client";
import { getNotes, overviewNotes } from "@/lib/fetch/get-notes";
import { getFoldersForDropdown } from "@/lib/fetch/get-folders";
import { Note } from "@prisma/client";

export type NotesView = "active" | "favorites" | "archived" | "trash";

function prepareNotes(
  notes: Note[],
  {
    limit,
    view,
  }: {
    limit?: number;
    view: NotesView;
  },
) {
  let result = notes;

  switch (view) {
    case "trash":
      result = notes.filter((n) => n.trashedAt != null);
      break;

    case "archived":
      result = notes.filter((n) => n.archived && n.trashedAt == null);
      break;

    case "favorites":
      result = notes.filter((n) => n.favorite && n.trashedAt == null);
      break;

    case "active":
    default:
      result = notes.filter((n) => !n.archived && n.trashedAt == null);
  }

  const ordered =
    view === "active"
      ? [
          ...result
            .filter((n) => n.isPinned)
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
          ...result
            .filter((n) => !n.isPinned)
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
        ]
      : result.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return limit ? ordered.slice(0, limit) : ordered;
}

export async function NotesListServer({
  type,
  view,
}: {
  type: "overview" | "all";
  view: NotesView;
}) {
  const [folders, notes] = await Promise.all([
    getFoldersForDropdown(),
    type === "overview" ? overviewNotes() : getNotes(),
  ]);

  const folderDisplay = (folders ?? []).map((f) => ({
    id: f.id,
    name: f.name,
  }));

  const allNotes = Array.isArray(notes) ? notes : [];

  const preparedNotes = prepareNotes(allNotes, {
    limit: type === "overview" ? 3 : undefined,
    view,
  });

  return (
    <NotesList
      initialNotes={preparedNotes}
      folders={folderDisplay}
      view={view}
    />
  );
}
