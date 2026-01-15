"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Note } from "@prisma/client";
import { extractTextFromDoc } from "@/lib/helpers/extract-text";
import { formatDateTime } from "@/lib/helpers/format-date-time";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, PinIcon } from "@hugeicons/core-free-icons";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NoteCard = ({ note }: { note: Note }) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(open); // controls actual DOM mount
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (value) setMounted(true); // mount immediately on open
  };

  // when closing -> wait for animation end before unmounting
  useEffect(() => {
    if (!open && mounted && overlayRef.current) {
      const el = overlayRef.current;
      const onAnimEnd = (e: AnimationEvent) => {
        // ensure we respond to the overlay's animation
        if (e.target === el) setMounted(false);
      };
      el.addEventListener("animationend", onAnimEnd as EventListener);
      // fallback: cleanup if unmounted unexpectedly
      return () =>
        el.removeEventListener("animationend", onAnimEnd as EventListener);
    }
  }, [open, mounted]);

  // control body scroll while overlay is visible (mounted), not while `open` is true
  useEffect(() => {
    if (mounted) document.body.classList.add("overflow");
    else document.body.classList.remove("overflow");
    return () => document.body.classList.remove("overflow");
  }, [mounted]);

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

  const { date, time } = formatDateTime(note.updatedAt.toString());

  return (
    // Note Card
    <>
      {mounted && (
        <div
          ref={overlayRef}
          data-state={open ? "open" : "closed"} // <-- important
          className="overlay"
        />
      )}

      <ContextMenu open={open} onOpenChange={handleOpenChange}>
        <ContextMenuTrigger
          render={
            <div
              className={cn(
                "bg-card corner-squircle relative flex w-full flex-col rounded-4xl border p-2",
                open && "z-1005",
              )}
            >
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

              <div className="relative h-max w-full flex-1">
                <h3 className="line-clamp-1 text-base font-semibold tracking-tight">
                  {note.title ?? "Untitled Note"}
                </h3>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {preview}
                </p>

                {/*absolute*/}
                <Link
                  href={`/notes/${note.id}`}
                  className="absolute inset-0 z-10"
                />
              </div>

              <div className="flex items-center justify-end gap-2 font-mono">
                <span className="text-muted-foreground text-xs">{date}</span>
                <span className="text-muted-foreground text-xs">{time}</span>
              </div>
            </div>
          }
        ></ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Profile</ContextMenuItem>
          <ContextMenuItem>Billing</ContextMenuItem>
          <ContextMenuItem>Team</ContextMenuItem>
          <ContextMenuItem>Subscription</ContextMenuItem>
          <ContextMenuItem
            variant="destructive"
            onClick={() =>
              toast.warning("Are you sure you want to delete this note?", {
                action: {
                  label: "Delete",
                  onClick: () => {
                    toast.success("Note deleted successfully!");
                  },
                },
              })
            }
          >
            <HugeiconsIcon icon={Delete02Icon} />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};

export { NoteCard };
