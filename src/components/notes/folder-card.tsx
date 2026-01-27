"use client";
import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import type { FolderListItem } from "@/lib/fetch/get-folders";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useOverlay } from "@/context/overlay-context";

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
import { Skeleton } from "../ui/skeleton";

function FolderCard({ folder }: { folder: FolderListItem }) {
  // local copy for optimistic updates
  const [localFolder, setLocalFolder] = useState<FolderListItem>(folder);
  // simple in-flight guard so user can't spam actions
  const [inFlight, setInFlight] = useState(false);

  const { active, open, close } = useOverlay();
  const owner = `folder-context:${localFolder.id}` as const;
  const isOpen = active === owner;

  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogOpenChange = (value: boolean) => {
    setDialogOpen(value);
  };
  return (
    <ContextMenu
      open={isOpen}
      onOpenChange={(v) => (v ? open(owner) : close())}
    >
      <ContextMenuTrigger
        render={
          <div
            className={cn(
              "bg-muted dark:bg-card! corner-squircle relative z-1 flex h-21 w-full flex-col overflow-clip rounded-4xl p-3 pb-2! transition-shadow duration-300",
              isOpen && "z-1005 shadow-sm",
            )}
          >
            <div className="relative h-max w-full flex-1">
              <h3 className="line-clamp-1 flex items-center justify-between gap-1 text-base font-semibold tracking-tight">
                <span className="line-clamp-1 flex-1 text-sm">
                  {localFolder.name}
                </span>
                <span className="bg-muted text-muted-foreground font-sm shrink-0 rounded-lg px-2">
                  {folder._count.notes}
                </span>
              </h3>
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {localFolder.description || "No description"}
              </p>
            </div>

            {/* absolute clickable layer */}
            <Link
              href={`/folders/${localFolder.slug}`}
              className="absolute inset-0 z-10"
            />
          </div>
        }
      />
    </ContextMenu>
  );
}
function FolderCardSkeleton() {
  return (
    <div className="corner-squircle flex-center h-21 w-full overflow-clip rounded-4xl">
      <Skeleton className="size-full" />
    </div>
  );
}

export { FolderCard, FolderCardSkeleton };
