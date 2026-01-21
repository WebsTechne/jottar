"use client";

import { useCallback, useEffect, useState } from "react";
import { Note } from "@prisma/client";
import { NoteCard, NoteCardSkeleton } from "@/components/notes/note-card";
import {
  EmptyArchive,
  EmptyFavorites,
  EmptyNotes,
  EmptyTrash,
} from "@/components/notes/empty-note";
import { NotesView } from "./page.server";

function NotesList({
  initialNotes,
  folders,
  //
  view,
}: {
  initialNotes: Note[];
  folders: { id: string; name: string }[];
  //
  view: NotesView;
}) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const applyPatchToList = useCallback(
    (updated: Partial<Note> & { id: string }) => {
      setNotes((prev) => {
        const found = prev.find((p) => p.id === updated.id);

        if (found) {
          // if not favorite while on favorite page, remove it
          if (updated.favorite === false && view === "favorites") {
            return prev.filter((p) => p.id !== updated.id);
          }

          // if unarchived while on archive page, remove it
          if (updated.archived === false && view === "archived") {
            return prev.filter((p) => p.id !== updated.id);
          }

          // remove if archived (when not showing archived)
          if (updated.archived === true && !(view === "archived")) {
            return prev.filter((p) => p.id !== updated.id);
          }

          // if restored from trash while on trash page, remove it
          if (updated.trashedAt === null && view === "trash") {
            return prev.filter((p) => p.id !== updated.id);
          }

          // remove if trashed
          if (updated.trashedAt && !(view === "trash")) {
            return prev.filter((p) => p.id !== updated.id);
          }
        }

        if (!found) {
          if (view === "favorites" && updated.favorite !== true) return prev;
          if (updated.archived === true && !(view === "archived")) return prev;
          if (updated.trashedAt && !(view === "trash")) return prev;
          return [updated as Note, ...prev];
        }

        const replaced = prev.map((p) =>
          p.id === updated.id ? { ...p, ...updated } : p,
        );

        // pinned-first ordering ONLY for active notes view
        if (
          updated.isPinned !== undefined &&
          !(view === "favorites") &&
          !(view === "archived") &&
          !(view === "trash")
        ) {
          const pinned = replaced.filter((r) => r.isPinned);
          const others = replaced.filter((r) => !r.isPinned);
          return [...pinned, ...others];
        }

        return replaced;
      });
    },
    [view],
  );

  // BroadcastChannel listener for cross-tab sync
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("notes");
      channel.onmessage = (ev) => {
        if (ev.data?.type === "patch") {
          applyPatchToList(ev.data.data);
        }
      };
    } catch (e) {
      // BroadcastChannel not supported — ignore
    }
    return () => {
      if (channel) channel.close();
    };
  }, [applyPatchToList]);

  return (
    <div className="wrap">
      {notes.map((n) => (
        <NoteCard
          key={n.id}
          note={n}
          folders={folders}
          onPatch={(u) => applyPatchToList(u)}
        />
      ))}

      {notes.length === 0 &&
        (view === "favorites" ? (
          <EmptyFavorites />
        ) : view === "archived" ? (
          <EmptyArchive />
        ) : view === "trash" ? (
          <EmptyTrash />
        ) : (
          <EmptyNotes />
        ))}
    </div>
  );
}

function NotesListSkeleton() {
  return (
    <div className="wrap">
      {[...Array(3)].map((_, i) => (
        <NoteCardSkeleton key={i} />
      ))}
    </div>
  );
}

export { NotesList, NotesListSkeleton };
