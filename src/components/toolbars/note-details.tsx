"use client";

import { cloneElement, useState, type ReactElement } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import capitalize from "@/lib/helpers/capitalize";
import { type FolderWithNotes } from "@/lib/fetch/get-folders";
import { type TagWithNoteTags } from "@/lib/fetch/get-tags";
import { type NoteWithNoteTags } from "@/app/notes/[id]/page";
import { Button } from "../ui/button";

interface NoteDetailsProps {
  children: ReactElement;
  note: NoteWithNoteTags;
  folders: FolderWithNotes[];
  tags: TagWithNoteTags[];
}

export function NoteDetails({
  children,
  note,
  folders,
  tags,
}: NoteDetailsProps) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState(note.title || "");
  const [selectedFolderId, setSelectedFolderId] = useState(note.folderId);
  const initialSelectedTagIds = note.noteTags.map((nt) => nt.tagId);
  const [selectedTagIds, setSelectedTagIds] = useState(initialSelectedTagIds);

  const resetState = () => {
    setTitle(note.title || "");
    setSelectedFolderId(note.folderId);
    setSelectedTagIds(initialSelectedTagIds);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetState();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={(props) => cloneElement(children, props)}
      ></DialogTrigger>
      <DialogContent className="p-4! sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Note details</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-3">
          <Input
            type="text"
            name="title"
            id="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input h-10! w-full"
          />

          <MultiSelect
            values={selectedTagIds}
            onValuesChange={setSelectedTagIds}
          >
            <MultiSelectTrigger className="input w-full">
              <MultiSelectValue placeholder="Select tags..." />
            </MultiSelectTrigger>
            <MultiSelectContent>
              <MultiSelectGroup>
                {tags.map((tag) => (
                  <MultiSelectItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </MultiSelectItem>
                ))}
              </MultiSelectGroup>
            </MultiSelectContent>
          </MultiSelect>

          <Select
            value={selectedFolderId ?? ""}
            onValueChange={setSelectedFolderId}
          >
            <SelectTrigger className="input w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="">No Folder</SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {capitalize(folder.name)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </form>

        <DialogFooter className="grid grid-cols-2">
          <DialogClose
            className="h-11! w-full"
            render={
              <Button
                variant="secondary"
                className="h-11! w-full"
                onClick={resetState}
              >
                Close
              </Button>
            }
          />
          <Button className="h-11! w-full">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
