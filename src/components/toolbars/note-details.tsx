"use client";

import { cloneElement, Fragment, useState, type ReactElement } from "react";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import capitalize from "@/lib/helpers/capitalize";
import { type FolderWithNotes } from "@/lib/fetch/get-folders";
import { type TagWithNoteTags } from "@/lib/fetch/get-tags";
import { type NoteWithNoteTags } from "@/app/notes/[id]/page";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";

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

  // States for controlled form inputs
  const [title, setTitle] = useState(note.title || "");
  const [selectedFolderId, setSelectedFolderId] = useState(note.folderId);
  const initialSelectedTagIds = note.noteTags.map((nt) => nt.tagId);
  const [selectedTagIds, setSelectedTagIds] = useState(initialSelectedTagIds);

  // States for combobox text input values
  const [tagInputValue, setTagInputValue] = useState("");
  const [folderInputValue, setFolderInputValue] = useState("");

  const resetState = () => {
    setTitle(note.title || "");
    setSelectedFolderId(note.folderId);
    setSelectedTagIds(initialSelectedTagIds);
    setTagInputValue("");
    setFolderInputValue("");
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetState();
    }
  };

  const tagsAnchor = useComboboxAnchor();

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

          {/* Tags Combobox (multiple) */}
          {/*<Combobox
            multiple
            autoHighlight
            items={tags}
            value={selectedTagIds}
            onValueChange={setSelectedTagIds}
          >
            <ComboboxChips ref={tagsAnchor} className="input">
              <ComboboxValue>
                {(values) => (
                  <Fragment>
                    {values
                      .map((tagId) => tags.find((t) => t.id === tagId))
                      .filter(Boolean)
                      .map((tag) => (
                        <ComboboxChip key={tag!.id} value={tag!.id}>
                          {tag!.name}
                        </ComboboxChip>
                      ))}
                    <ComboboxChipsInput
                      placeholder="Select or create tags..."
                      value={tagInputValue}
                      onValueChange={(value) => {
                        setTagInputValue(value.toLowerCase());
                      }}
                    />
                  </Fragment>
                )}
              </ComboboxValue>
            </ComboboxChips>
            <ComboboxContent anchor={tagsAnchor}>
              <ComboboxEmpty className="flex items-center gap-1.5 px-2">
                <button
                  type="button"
                  className="bg-input/20 corner-squircle flex h-9 w-full items-center justify-center gap-1.5 rounded-4xl border"
                >
                  <HugeiconsIcon icon={PlusSignIcon} size={16} />
                  Create
                  <code className="rounded-sm bg-blue-300/80 px-1 py-0.5 font-mono text-blue-700 dark:bg-blue-600/30! dark:text-white/80">
                    {tagInputValue}
                  </code>
                  Tag
                </button>
              </ComboboxEmpty>
              <ComboboxList>
                {tags.map((tag) => (
                  <ComboboxItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>*/}

          {/* Folders Combobox (single) */}
          {/*<Combobox
            items={folders}
            value={selectedFolderId}
            onValueChange={setSelectedFolderId}
          >
            <ComboboxInput
              placeholder="Select a folder"
              className="input"
              value={folderInputValue}
              onValueChange={(value) => {
                setFolderInputValue(value.toLowerCase());
              }}
              displayValue={(folderId) =>
                folders.find((f) => f.id === folderId)?.name || ""
              }
            />
            <ComboboxContent>
              <ComboboxEmpty className="flex items-center gap-1.5 px-2">
                <button
                  type="button"
                  className="bg-input/20 corner-squircle flex h-9 w-full items-center justify-center gap-1.5 rounded-4xl border"
                >
                  <HugeiconsIcon icon={PlusSignIcon} size={16} />
                  Create
                  <code className="rounded-sm bg-purple-300/80 px-1 py-0.5 font-mono text-purple-700 dark:bg-purple-600/30! dark:text-white/80">
                    {folderInputValue}
                  </code>
                  Folder
                </button>
              </ComboboxEmpty>
              <ComboboxList>
                {folders.map((folder) => (
                  <ComboboxItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>*/}
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
