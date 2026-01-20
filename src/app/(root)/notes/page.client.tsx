"use client";

import { useCallback, useEffect, useState } from "react";
import { Note } from "@prisma/client";
import { NoteCard, NoteCardSkeleton } from "@/components/notes/note-card";
import {
  EmptyArchive,
  EmptyNotes,
  EmptyTrash,
} from "@/components/notes/empty-note";

function NotesList({
  initialNotes,
  folders,
  showArchived = false,
  showTrashed = false,
}: {
  initialNotes: Note[];
  folders: { id: string; name: string }[];
  showArchived?: boolean;
  showTrashed?: boolean;
}) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const patchAndMaybeReorder = useCallback(
    (updated: Partial<Note> & { id: string }) => {
      setNotes((prev) => {
        const found = prev.find((p) => p.id === updated.id);

        // if unarchived while on archive page, remove it
        if (updated.archived === false && showArchived) {
          return prev.filter((p) => p.id !== updated.id);
        }

        // remove if archived (when not showing archived)
        if (updated.archived === true && !showArchived) {
          return prev.filter((p) => p.id !== updated.id);
        }

        // if restored from trash while on trash page, remove it
        if (updated.trashedAt === null && showTrashed) {
          return prev.filter((p) => p.id !== updated.id);
        }

        // remove if trashed
        if (updated.trashedAt && !showTrashed) {
          return prev.filter((p) => p.id !== updated.id);
        }

        if (!found) {
          // if not found and not archived, add to top
          if (updated.archived === true && !showArchived) return prev;
          return [updated as Note, ...prev];
        }

        const replaced = prev.map((p) =>
          p.id === updated.id ? { ...p, ...updated } : p,
        );

        // pinned-first ordering ONLY for active notes view
        if (updated.isPinned !== undefined && !showArchived && !showTrashed) {
          const pinned = replaced.filter((r) => r.isPinned);
          const others = replaced.filter((r) => !r.isPinned);
          return [...pinned, ...others];
        }

        return replaced;
      });
    },
    [showArchived, showTrashed],
  );

  // BroadcastChannel listener for cross-tab sync
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("notes");
      channel.onmessage = (ev) => {
        if (ev.data?.type === "patch") {
          patchAndMaybeReorder(ev.data.data);
        }
      };
    } catch (e) {
      // BroadcastChannel not supported — ignore
    }
    return () => {
      if (channel) channel.close();
    };
  }, [patchAndMaybeReorder]);

  return (
    <div className="wrap">
      {notes.map((n) => (
        <NoteCard
          key={n.id}
          note={n}
          folders={folders}
          onPatch={(u) => patchAndMaybeReorder(u)}
        />
      ))}

      {notes.length === 0 &&
        (showArchived ? (
          <EmptyArchive />
        ) : showTrashed ? (
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
