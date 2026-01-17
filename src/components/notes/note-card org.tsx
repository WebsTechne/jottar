"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Note } from "@prisma/client";
import { extractTextFromDoc } from "@/lib/helpers/extract-text";
import { formatDateTime } from "@/lib/helpers/format-date-time";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Archive03Icon,
  Copy01Icon,
  Delete02Icon,
  Folder02Icon,
  PinIcon,
  PinOffIcon,
  StarIcon,
} from "@hugeicons/core-free-icons";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  toggleArchive,
  toggleFavorite,
  togglePin,
} from "@/lib/actions/note-actions";

const NoteCard = ({
  note,
  folders,
}: {
  note: Note;
  folders: { name: string; id: string }[];
}) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(open); // controls actual DOM mount
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // local copy for optimistic updates
  const [localNote, setLocalNote] = useState<Note>(note);
  // simple in-flight guard so user can't spam toggles
  const [inFlight, setInFlight] = useState(false);

  // keep localNote in sync if parent prop changes
  useEffect(() => {
    setLocalNote(note);
  }, [note]);

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
      typeof localNote.content === "string"
        ? JSON.parse(localNote.content)
        : localNote.content;

    preview = extractTextFromDoc(parsed).slice(0, 120);
  } catch {
    preview = "";
  }

  const { date, time } = formatDateTime(localNote.updatedAt.toString());

  // optimistic handlers
  const optimisticToggle = async (
    key: "isPinned" | "favorite" | "archived",
    actionFn: (id: string) => Promise<any>,
  ) => {
    if (inFlight) return; // guard
    setInFlight(true);

    const prev = { ...localNote };
    // flip locally
    setLocalNote((s) => ({ ...s, [key]: !s[key] }));

    try {
      const res = await actionFn(localNote.id);
      if (res?.error) {
        // rollback
        setLocalNote(prev);
        toast.error(res.error);
        setInFlight(false);
        return;
      }
      if (res?.data) {
        // server might return updated row — merge it
        setLocalNote((s) => ({ ...s, ...res.data }));
        const channel = new BroadcastChannel("notes");
        channel.postMessage({ type: "patch", data: res.data });
        channel.close();
      }
      toast.success(res?.message ?? "Done");
    } catch (err: any) {
      setLocalNote(prev);
      toast.error(err?.message ?? "Network error");
    } finally {
      setInFlight(false);
    }
  };

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
              {localNote.isPinned && (
                <span className="absolute top-1 right-1 inline-flex size-5 items-center justify-center rounded-full">
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
                  {localNote.title ?? "Untitled Note"}
                </h3>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {preview}
                </p>

                {/*absolute*/}
                <Link
                  href={`/notes/${localNote.id}`}
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
          <ContextMenuGroup>
            {/* /// pin note /// */}
            <ContextMenuItem
              onClick={() => optimisticToggle("isPinned", togglePin)}
            >
              {localNote.isPinned ? (
                <>
                  <HugeiconsIcon icon={PinOffIcon} strokeWidth={2} />
                  Unpin note
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={PinIcon} strokeWidth={2} />
                  Pin note
                </>
              )}
            </ContextMenuItem>

            {/* /// favorite note /// */}
            <ContextMenuItem
              onClick={() => optimisticToggle("isPinned", toggleFavorite)}
            >
              {localNote.favorite ? (
                <>
                  <HugeiconsIcon
                    icon={StarIcon}
                    fill="currentColor"
                    strokeWidth={2}
                  />
                  Remove from favorites
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={StarIcon} strokeWidth={2} />
                  Add to favorites
                </>
              )}
            </ContextMenuItem>
          </ContextMenuGroup>

          <ContextMenuSeparator />

          {/* /// archive note /// */}
          <ContextMenuItem
            onClick={() => optimisticToggle("isPinned", toggleArchive)}
          >
            <HugeiconsIcon icon={Archive03Icon} strokeWidth={2} />
            Archive note
          </ContextMenuItem>

          {/* /// duplicate note ///*/}
          <ContextMenuItem>
            <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
            Duplicate note
          </ContextMenuItem>

          {/* /// folder /// */}
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <HugeiconsIcon icon={Folder02Icon} strokeWidth={2} />
              Move to folder
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuGroup>
                <ContextMenuLabel>My folders</ContextMenuLabel>
                <ContextMenuRadioGroup defaultValue="none">
                  <ContextMenuRadioItem value="none">None</ContextMenuRadioItem>
                  {folders.length < 1 ? (
                    <ContextMenuRadioItem value="none">
                      No folders
                    </ContextMenuRadioItem>
                  ) : (
                    folders.map((folder) => (
                      <ContextMenuRadioItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </ContextMenuRadioItem>
                    ))
                  )}
                </ContextMenuRadioGroup>
              </ContextMenuGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>

          <ContextMenuSeparator />

          {/* /// delete note /// */}
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
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};

export { NoteCard };
