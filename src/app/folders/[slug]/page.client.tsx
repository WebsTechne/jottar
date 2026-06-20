"use client";

import { EmptyFolder } from "@/components/notes/empty-note";
import { FolderHeader } from "../folder-header";
import { FolderDropdownItem, FolderWithNotes } from "@/lib/fetch/get-folders";
import { ServerSession } from "@/app/layout";
import { NoteCard } from "@/components/notes/note-card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpdateFolderSheet } from "./update-form";
import { useState } from "react";

export default function FolderPageClient({
  folder,
  folders,
  session,
}: {
  folder: FolderWithNotes;
  folders: FolderDropdownItem[];
  session: ServerSession;
}) {
  const [updateOpen, setUpdateOpen] = useState(false);

  const folderSlim = {
    id: folder.id,
    name: folder.name,
    slug: folder.slug,
    description: folder.description,
  };

  return (
    <>
      <main className="mx-auto w-full max-w-400">
        <FolderHeader session={session} back={true}></FolderHeader>

        {/*Metadata and options */}
        <section className="section">
          <div className="flex items-center justify-between gap-1">
            <h1 className="heading">{folder.name}</h1>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button size="icon-lg" variant="ghost" />}
              >
                <HugeiconsIcon icon={MoreVerticalIcon} className="size-6!" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setUpdateOpen(true)}
                >
                  Edit Folder
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="description">{folder.description}</p>

          <section className="wrap">
            {folder.notes.length === 0 && <EmptyFolder />}

            {folder.notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                view="folder"
                folders={folders}
              />
            ))}
          </section>
        </section>
      </main>

      <UpdateFolderSheet
        folder={folderSlim}
        open={updateOpen}
        onOpenChange={setUpdateOpen}
      />
    </>
  );
}
