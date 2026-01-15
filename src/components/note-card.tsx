"use client";

import { extractTextFromDoc } from "@/lib/helpers/extract-text";
import { formatDateTime } from "@/lib/helpers/format-date-time";
import { PinIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Note } from "@prisma/client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const NoteCard = ({ note }: { note: Note }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  const { date, time } = useMemo(() => {
    if (!isClient) {
      return { date: "", time: "" };
    }
    return formatDateTime(note.updatedAt.toString());
  }, [isClient, note.updatedAt]);

  let preview = "";
  try {
    const parsed =
      typeof note.content === "string"
        ? JSON.parse(note.content)
        : note.content;

    preview = extractTextFromDoc(parsed).slice(0, 120);
  } catch {
    preview = "";
  }

  return (
    <div className="bg-card corner-squircle relative w-full rounded-4xl border p-2">
      {note.isPinned && (
        <span className="absolute top-1 right-1 inline-flex size-5 items-center justify-center rounded-full border">
          <HugeiconsIcon
            icon={PinIcon}
            size={16}
            fill="var(--muted-foreground)"
            className="text-muted-foreground"
          />
        </span>
      )}

      <div className="relative h-max w-full">
        <h3 className="line-clamp-1 text-base font-semibold tracking-tight">
          {note.title ?? "Untitled Note"}
        </h3>
        <p className="text-muted-foreground line-clamp-2 text-sm">{preview}</p>

        {/*absolute*/}
        <Link href={`/notes/${note.id}`} className="absolute inset-0 z-10" />
      </div>

      <div className="flex items-center justify-end gap-2 font-mono">
        <span className="text-muted-foreground text-xs">{date}</span>
        <span className="text-muted-foreground text-xs">{time}</span>
      </div>
    </div>
  );
};

export { NoteCard };
