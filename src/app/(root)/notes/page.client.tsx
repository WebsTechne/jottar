"use client";

import { useEffect, useState } from "react";
import { Note } from "@prisma/client";
import { NoteCard } from "@/components/notes/note-card";

export function NotesList({
  initialNotes,
  folders,
  showArchived = false, // if false, remove archived notes from the visible list
}: {
  initialNotes: Note[];
  folders: { id: string; name: string }[];
  showArchived?: boolean;
}) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  // merge/patch updated note; if archived and showArchived === false -> remove
  const patchAndMaybeReorder = (updated: Partial<Note> & { id: string }) => {
    setNotes((prev) => {
      const found = prev.find((p) => p.id === updated.id);

      // if update marks archived and we don't show archived, remove it
      if ((updated as any).archived === true && !showArchived) {
        return prev.filter((p) => p.id !== updated.id);
      }

      if (!found) {
        // if not found and not archived, add to top (optional)
        if ((updated as any).archived === true && !showArchived) return prev;
        return [updated as Note, ...prev];
      }

      const replaced = prev.map((p) =>
        p.id === updated.id ? { ...p, ...updated } : p,
      );

      // pinned-first stable ordering — keep updated item in new position if it toggled pin
      if ((updated as any).isPinned !== undefined) {
        const pinned = replaced.filter((r) => r.isPinned);
        const others = replaced.filter((r) => !r.isPinned);
        return [...pinned, ...others];
      }

      return replaced;
    });
  };

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
  }, [showArchived]);

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

      {notes.length === 0 && <p>No notes found</p>}
    </div>
  );
}
