"use client";

import { cloneElement, Fragment, useState, type ReactElement } from "react";
import { useForm, Controller } from "react-hook-form";
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
// import { type FolderWithNotes } from "@/lib/fetch/get-folders";
// import { type TagWithNoteTags } from "@/lib/fetch/get-tags";
import { type NoteWithNoteTags } from "@/app/(notes)/notes/[id]/page";

import { createTag, updateNoteDetails } from "@/lib/actions/note-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

interface NoteDetailsProps {
  children: ReactElement;
  note: NoteWithNoteTags;
  // folders: FolderWithNotes[];
  // tags: TagWithNoteTags[];
}

type FormValues = {
  title: string;
  folderId: string | null;
  tagIds: string[]; // ids
};

export function NoteDetails({
  children,
  note,
  // folders,
  // tags,
}: NoteDetailsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [tagQuery, setTagQuery] = useState("");

  const initialTagIds = note.noteTags.map((nt) => nt.tagId);

  const { control, register, handleSubmit, reset, setValue, watch } =
    useForm<FormValues>({
      defaultValues: {
        title: note.title || "",
        folderId: note.folderId ?? null,
        tagIds: initialTagIds,
      },
    });

  // Make sure form shows latest note when dialog opens/closes.
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      reset({
        title: note.title || "",
        folderId: note.folderId ?? null,
        tagIds: note.noteTags.map((nt) => nt.tagId),
      });
    } else {
      // optional: reset to original when closed
      reset({
        title: note.title || "",
        folderId: note.folderId ?? null,
        tagIds: note.noteTags.map((nt) => nt.tagId),
      });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    setIsSaving(true);
    try {
      // adapt to the API shape your backend expects
      const result = await updateNoteDetails(note.id, {
        title: data.title,
        folderId: data.folderId,
        tagIds: data.tagIds,
      } as any);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Note updated!");
        router.refresh();
        setOpen(false);
      }
    } finally {
      setIsSaving(false);
    }
  });

  const tagsAnchor = useComboboxAnchor();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        nativeButton={false}
        render={(props) => cloneElement(children, props)}
      ></DialogTrigger>
      <DialogContent className="p-4! sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Note details</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          {/* Title - native input: use register */}
          <Input
            type="text"
            id="title"
            placeholder="Title"
            {...register("title")}
            className="input h-10! w-full"
          />

          {/* Tags (multiple) - Controller */}
          {/*<Controller
            control={control}
            name="tagIds"
            render={({ field }) => (
              <Combobox
                multiple
                autoHighlight
                items={tags}
                value={field.value}
                onValueChange={(v) => field.onChange(v)}
              >
                <ComboboxChips ref={tagsAnchor} className="input">
                  <ComboboxValue>
                    {(values: string[]) => (
                      <Fragment>
                        {values
                          .map((tagId) => tags.find((t) => t.id === tagId))
                          .filter(Boolean)
                          .map((tag) => (
                            <ComboboxChip key={tag!.id}>
                              {tag!.name}
                            </ComboboxChip>
                          ))}
                        <ComboboxChipsInput
                          placeholder="Select or create tags..."
                          // local UI input; not tied to react-hook-form directly
                          // onValueChange={(val) => {
                          //   optional: store typed text in local state or create on Enter
                          // }}
                        />
                      </Fragment>
                    )}
                  </ComboboxValue>
                </ComboboxChips>

                <ComboboxContent anchor={tagsAnchor}>
                  <ComboboxEmpty className="flex items-center gap-1.5 px-2">
                    <button
                      type="button"
                      className="bg-input/20 supports-[corner-shape:squircle]:squircle-card flex h-9 w-full items-center justify-center gap-1.5 rounded-2xl border"
                      onClick={async () => {
                        if (!tagQuery.trim()) return;

                        const res = await createTag(tagQuery.trim());

                        if (res?.error) {
                          toast.error(res.error);
                          return;
                        }

                        const newTag = res.data;
                        setValue(
                          "tagIds",
                          [...(field.value || []), newTag.id],
                          {
                            shouldDirty: true,
                          },
                        );

                        toast.success(`Tag created: ${newTag.name}`);
                        setTagQuery("");
                      }}
                    >
                      Create <code className="px-1">{tagQuery || "tag"}</code>
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
              </Combobox>
            )}
          />*/}

          {/* Folder (single) - Controller */}
          {/*<Controller
            control={control}
            name="folderId"
            render={({ field }) => (
              <Combobox
                items={folders}
                value={field.value}
                onValueChange={(v) => field.onChange(v)}
              >
                <ComboboxInput
                  placeholder="Select a folder"
                  className="input"
                  displayValue={(folderId) =>
                    folders.find((f) => f.id === folderId)?.name || ""
                  }
                />
                <ComboboxContent>
                  <ComboboxEmpty className="flex items-center gap-1.5 px-2">
                    <button
                      type="button"
                      className="bg-input/20 supports-[corner-shape:squircle]:squircle-card flex h-9 w-full items-center justify-center gap-1.5 rounded-2xl border"
                      onClick={() => {
                        // example create folder flow
                        const newId = `new-folder-${Date.now()}`;
                        setValue("folderId", newId, { shouldDirty: true });
                      }}
                    >
                      Create Folder
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
              </Combobox>
            )}
          />*/}
        </form>

        <DialogFooter className="grid grid-cols-2">
          <DialogClose
            render={
              <Button
                variant="secondary"
                className="h-11! w-full"
                onClick={() =>
                  reset({
                    title: note.title || "",
                    folderId: note.folderId ?? null,
                    tagIds: initialTagIds,
                  })
                }
              >
                Close
              </Button>
            }
          ></DialogClose>
          <Button
            className="h-11! w-full"
            onClick={onSubmit}
            disabled={isSaving}
          >
            {isSaving ? <Spinner /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
