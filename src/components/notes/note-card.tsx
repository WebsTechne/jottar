"use client";

import { extractTextFromDoc } from "@/lib/helpers/extract-text";
import { formatDateTime } from "@/lib/helpers/format-date-time";
import {
  Archive03Icon,
  ArchiveOff03Icon,
  Copy01Icon,
  Delete02Icon,
  Folder02Icon,
  FolderAddIcon,
  InformationCircleIcon,
  PinIcon,
  PinOffIcon,
  ReloadIcon,
  Share01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Note } from "@prisma/client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { NotesView } from "@/app/(root)/notes/page.server";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useOverlay } from "@/context/overlay-context";
import {
  duplicateNote,
  restoreNote,
  toggleArchive,
  toggleFavorite,
  togglePin,
  trashNote,
} from "@/lib/actions/note-actions";
import { updateNoteFolder } from "@/lib/actions/folder-actions";
import { FolderDropdownItem } from "@/lib/fetch/get-folders";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { DeleteNoteDialog } from "./delete-note-dialog";

type Props = {
  note: Note;
  folders: FolderDropdownItem[];
  // optional callback to notify parent list about a server-updated note
  onPatch?: (updated: Partial<Note> & { id: string }) => void;
  view: NotesView;
};

const NoteCard = ({ note, folders, onPatch, view }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogOpenChange = (value: boolean) => {
    setDialogOpen(value);
  };

  // local copy for optimistic updates
  const [localNote, setLocalNote] = useState<Note>(note);
  // simple in-flight guard so user can't spam toggles
  const [inFlight, setInFlight] = useState(false);

  // keep localNote in sync if parent prop changes
  useEffect(() => {
    setLocalNote(note);
  }, [note]);

  const { active, open, close } = useOverlay();
  const owner = `note-context:${localNote.id}` as const;
  const isOpen = active === owner;

  const handleTrashConfirm = async (id: string) => {
    if (inFlight) return;
    setInFlight(true);

    const prev = { ...localNote };

    // optimistic update: mark trashed now
    setLocalNote((s) => ({ ...s, trashedAt: new Date() }));

    try {
      const res = await trashNote(id);

      if (res?.error) {
        // rollback
        setLocalNote(prev);
        toast.error(res.error);
        return;
      }

      if (res?.data) {
        // merge server truth
        setLocalNote((s) => ({ ...s, ...res.data }));
        onPatch?.(res.data);

        // broadcast patch to other tabs (same pattern as optimisticToggle)
        try {
          const channel = new BroadcastChannel("notes");
          channel.postMessage({ type: "patch", data: res.data });
          channel.close();
        } catch (e) {
          // ignore if unavailable
        }
      }

      toast.success("Moved to Trash", {
        action: {
          label: "Undo",
          onClick: () => handleTrashConfirm(id),
        },
      });
      // close dialog / menu
      setDialogOpen(false);
      close();
    } catch (err: any) {
      setLocalNote(prev);
      toast.error(err?.message ?? "Network error");
    } finally {
      setInFlight(false);
    }
  };

  const handleRestore = async (id: string) => {
    if (inFlight) return;
    setInFlight(true);

    const prev = { ...localNote };

    // optimistic update: restore immediately
    setLocalNote((s) => ({ ...s, trashedAt: null }));

    try {
      const res = await restoreNote(id);

      if (res?.error) {
        // rollback
        setLocalNote(prev);
        toast.error(res.error);
        return;
      }

      if (res?.data) {
        setLocalNote((s) => ({ ...s, ...res.data }));
        onPatch?.(res.data);

        // sync other tabs
        try {
          const channel = new BroadcastChannel("notes");
          channel.postMessage({ type: "patch", data: res.data });
          channel.close();
        } catch {
          // ignore
        }
      }

      toast.success("Restored", {
        action: {
          label: "Undo",
          onClick: () => handleTrashConfirm(id),
        },
      });
      close();
    } catch (err: any) {
      setLocalNote(prev);
      toast.error(err?.message ?? "Network error");
    } finally {
      setInFlight(false);
    }
  };

  const handleDuplicateNote = async (noteId: string) => {
    if (inFlight) return;
    setInFlight(true);

    try {
      const res = await duplicateNote(noteId);
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      if (res?.data) {
        toast.success("Note duplicated");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Network error");
    } finally {
      setInFlight(false);
    }
  };

  // memoized preview extraction — avoids JSON.parse on every render
  const preview = useMemo(() => {
    try {
      const parsed =
        typeof localNote.content === "string"
          ? JSON.parse(localNote.content)
          : localNote.content;
      return extractTextFromDoc(parsed).slice(0, 120);
    } catch {
      return "";
    }
  }, [localNote.content]);

  // memoize formatted date/time
  const { date, time } = useMemo(
    () => formatDateTime(localNote.updatedAt.toString()),
    [localNote.updatedAt],
  );

  // optimistic handlers
  const optimisticToggle = async (
    key: "isPinned" | "favorite" | "archived" | "folderId",
    actionFn: (id: string) => Promise<any>,
    { force = false, showUndo = false } = {},
  ) => {
    const id = localNote.id;

    if (inFlight && !force) return; // guard
    setInFlight(true);

    const prev = { ...localNote };
    // flip locally
    setLocalNote((s) => ({ ...s, [key]: !s[key] }));

    try {
      const res = await actionFn(id);

      if (res?.error) {
        // rollback
        setLocalNote(prev);
        toast.error(res.error);
        return;
      }

      if (res?.data) {
        // merge server truth
        setLocalNote((s) => ({ ...s, ...res.data }));
        // notify parent list (so it can remove archived notes or reorder)
        onPatch?.(res.data);
        // broadcast to other tabs
        try {
          const channel = new BroadcastChannel("notes");
          channel.postMessage({ type: "patch", data: res.data });
          channel.close();
        } catch (e) {
          // BroadcastChannel might not be available in every environment — ignore fallback
        }
      }

      if (showUndo) {
        toast.success("Done", {
          action: {
            label: "Undo",
            onClick: () => optimisticToggle(key, actionFn, { force: true }),
          },
        });
      } else {
        toast.success("Done", {
          action: {
            label: "Undo",
            onClick: () => optimisticToggle(key, actionFn, { force: true }),
          },
        });
      }
    } catch (err: any) {
      setLocalNote(prev);
      toast.error(err?.message ?? "Network error");
    } finally {
      setInFlight(false);
    }
  };

  const EXCLUDED_FOLDERS = new Set(["imported notes", "shared notes"]);

  const usableFolders = folders.filter((folder) => {
    const normalizedName = folder.name.trim().toLowerCase();
    return !EXCLUDED_FOLDERS.has(normalizedName);
  });

  return (
    <>
      <DeleteNoteDialog
        id={localNote.id}
        title={localNote.title ?? "Untitled note"}
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        onConfirm={() => handleTrashConfirm(localNote.id)}
      />

      <ContextMenu
        open={isOpen}
        onOpenChange={(v) => (v ? open(owner) : close())}
      >
        <ContextMenuTrigger
          render={
            <div
              className={cn(
                "bg-muted dark:bg-card! corner-squircle relative z-1 flex w-full flex-col overflow-clip rounded-4xl p-3 pb-2! transition-shadow duration-300",
                isOpen && "z-1005 shadow-sm",
              )}
            >
              <span className="pointer-events-none absolute top-1 right-1 inline-flex min-h-5 w-5 flex-col items-center justify-center gap-0.75">
                {localNote.isPinned && view === "active" && (
                  <HugeiconsIcon
                    icon={PinIcon}
                    size={16}
                    fill="var(--muted-foreground)"
                    className="text-muted-foreground"
                  />
                )}
                {localNote.favorite &&
                  (view === "active" || view === "favorites") && (
                    <HugeiconsIcon
                      icon={StarIcon}
                      size={14}
                      fill="var(--muted-foreground-51)"
                      className="text-transparent"
                    />
                  )}
              </span>

              <div className="relative h-max w-full flex-1">
                <h3 className="line-clamp-1 text-base font-semibold tracking-tight">
                  {localNote.title ?? "Untitled Note"}
                </h3>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {preview}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 font-mono">
                <span className="text-muted-foreground text-xs">{date}</span>
                <span className="text-muted-foreground text-xs">{time}</span>
              </div>

              {/* absolute clickable layer */}
              <Link
                href={`/notes/${localNote.id}`}
                className="absolute inset-0 z-10"
              />
            </div>
          }
        />
        <ContextMenuContent className="min-w-52!">
          {!localNote.archived && !localNote.trashedAt && (
            <>
              <ContextMenuGroup>
                {view === "active" && (
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
                )}

                <ContextMenuItem
                  onClick={() => optimisticToggle("favorite", toggleFavorite)}
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
            </>
          )}

          {!localNote.trashedAt && (
            <>
              <ContextMenuItem
                onClick={() =>
                  optimisticToggle("archived", toggleArchive, {
                    showUndo: true,
                  })
                }
              >
                {localNote.archived ? (
                  <>
                    <HugeiconsIcon icon={ArchiveOff03Icon} strokeWidth={2} />
                    Unarchive note
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={Archive03Icon} strokeWidth={2} />
                    Archive note
                  </>
                )}
              </ContextMenuItem>

              <ContextMenuSeparator />
            </>
          )}

          {!localNote.trashedAt && (
            <>
              <ContextMenuItem
                onClick={() => handleDuplicateNote(localNote.id)}
              >
                <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
                Duplicate note
              </ContextMenuItem>

              <ContextMenuSub>
                <ContextMenuSubTrigger>
                  <HugeiconsIcon icon={Folder02Icon} strokeWidth={2} />
                  Move to folder
                </ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuGroup>
                    <ContextMenuItem
                      nativeButton={true}
                      render={
                        <Button
                          variant="outline"
                          className="w-full justify-start!"
                          onClick={() =>
                            toast("This feature isn't available yet")
                          }
                        >
                          <HugeiconsIcon icon={FolderAddIcon} strokeWidth={2} />
                          New folder
                        </Button>
                      }
                    />

                    {usableFolders.length > 0 && <ContextMenuSeparator />}

                    <ContextMenuRadioGroup
                      defaultValue={localNote.folderId ?? "none"}
                    >
                      <ContextMenuRadioItem value="none">
                        None
                      </ContextMenuRadioItem>
                      {usableFolders.map((folder) => (
                        <ContextMenuRadioItem
                          key={folder.id}
                          value={folder.id}
                          onClick={() =>
                            optimisticToggle("folderId", toggleFavorite)
                          }
                        >
                          {folder.name}
                        </ContextMenuRadioItem>
                      ))}
                    </ContextMenuRadioGroup>
                  </ContextMenuGroup>
                </ContextMenuSubContent>
              </ContextMenuSub>

              <ContextMenuSeparator />
            </>
          )}

          {!localNote.archived && !localNote.trashedAt && (
            <ContextMenuItem
              onClick={() => toast("This feature isn't available yet")}
            >
              <HugeiconsIcon icon={Share01Icon} strokeWidth={2} />
              Share note
            </ContextMenuItem>
          )}

          <ContextMenuItem
            onClick={() => toast("This feature isn't available yet")}
          >
            <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} />
            Info
          </ContextMenuItem>

          <ContextMenuSeparator />

          {localNote.trashedAt && (
            <ContextMenuItem onClick={() => handleRestore(localNote.id)}>
              <HugeiconsIcon icon={ReloadIcon} strokeWidth={2} />
              Restore from trash
            </ContextMenuItem>
          )}

          {!localNote.trashedAt ? (
            <ContextMenuItem
              variant="destructive"
              onClick={() => handleDialogOpenChange(true)}
            >
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
              Trash
            </ContextMenuItem>
          ) : (
            <ContextMenuItem
              variant="destructive"
              onClick={() => toast("This feature isn't available yet")}
            >
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
              Delete permanently
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};

const NoteCardSkeleton = () => {
  return (
    <div className="corner-squircle flex-center h-25 w-full overflow-clip rounded-4xl">
      <Skeleton className="size-full" />
    </div>
  );
};

export { NoteCard, NoteCardSkeleton };
