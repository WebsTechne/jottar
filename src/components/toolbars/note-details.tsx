"use client";

import { cloneElement, useRef, useState, type ReactElement } from "react";
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
import { type NoteWithNoteTags } from "@/app/(notes)/notes/[id]/page";

import { createTag, updateNoteDetails } from "@/lib/actions/note-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { FolderDropdownItem } from "@/lib/fetch/get-folders";
import { TagWithNoteTags } from "@/lib/fetch/get-tags";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "../ui/sheet";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "../ui/field";
import { ErrorText } from "../error-text";
import { HugeiconsIcon } from "@hugeicons/react";
import { FolderAddIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";

interface NoteDetailsProps {
  children: ReactElement;
  note: NoteWithNoteTags;
  folders: FolderDropdownItem[];
  tags: TagWithNoteTags[];
}

type FormValues = {
  title: string;
  tagIds: string[] | []; // ids
  folderId: string | null;
};

export function NoteDetails({
  children,
  note,
  folders,
  tags,
}: NoteDetailsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState(tags);
  const [selectedTags, setSelectedTags] = useState<typeof tags>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [tagQuery, setTagQuery] = useState("");

  const initialTagIds = note.noteTags.map((nt) => nt.tagId);

  const form = useForm<FormValues>({
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
      form.reset({
        title: note.title || "",
        folderId: note.folderId ?? null,
        tagIds: note.noteTags.map((nt) => nt.tagId),
      });
    } else {
      // optional: reset to original when closed
      form.reset({
        title: note.title || "",
        folderId: note.folderId ?? null,
        tagIds: note.noteTags.map((nt) => nt.tagId),
      });
      setSelectedTags(
        availableTags.filter((tag) => initialTagIds.includes(tag.id)),
      );
    }
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setError("");
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
        setError(result.error);
      } else {
        toast.success("Note updated!");
        router.refresh();
        setOpen(false);
      }
    } catch (err) {
      setError("Failed to update note.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  });

  const handleCreateTag = async () => {
    toast.loading("Creating tag...", { id: "create-tag-toast" });

    try {
      const res = await createTag(comboboxChipsInputRef.current?.value ?? "");

      if (res.error) toast.error(res.error, { id: "create-tag-toast" });
      if (res.data) {
        setAvailableTags((prev) => [...prev, res.data]);
        // setSelectedTags((prev) => [...prev, res.data]);
      }

      toast.success("Tag created!", { id: "create-tag-toast" });
      comboboxChipsInputRef.current?.blur();
    } catch (err) {
      toast.error("Failed to create tag.", { id: "create-tag-toast" });
      console.error(err);
    }
  };

  const anchor = useComboboxAnchor();
  const comboboxChipsInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        nativeButton={false}
        render={(props) => cloneElement(children, props)}
      ></SheetTrigger>
      <SheetContent className="w-full! max-w-115!">
        <form onSubmit={onSubmit} className="contents">
          <FieldSet className="flex flex-col items-center gap-5 p-4">
            <section className="flex w-full flex-col gap-3.5">
              <FieldTitle className="m-0! w-full text-xl leading-tight font-bold! md:text-2xl">
                Note details
              </FieldTitle>
              <FieldDescription className="m-0! w-full leading-tight">
                Update the folder details below to modify its name, slug or
                description.
              </FieldDescription>
            </section>

            <FieldGroup>
              {/* Title */}
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="input-group"
                  >
                    <FieldLabel htmlFor={field.name} className="input-label">
                      Note title
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="text"
                      placeholder="Title"
                      aria-invalid={fieldState.invalid}
                      className="input h-10!"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Tags (multiple) - Controller */}
              <Controller
                name="tagIds"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="input-group"
                  >
                    <FieldLabel htmlFor={field.name} className="input-label">
                      Tags
                    </FieldLabel>
                    <Combobox
                      multiple
                      items={availableTags}
                      value={selectedTags}
                      itemToStringLabel={(tag) => tag.name}
                      autoHighlight
                      onValueChange={(selected) => {
                        const typed = selected;
                        setSelectedTags(typed);
                        field.onChange(typed.map((tag) => tag.id));
                      }}
                    >
                      <ComboboxChips
                        ref={anchor}
                        className="input h-max! min-h-10!"
                      >
                        <ComboboxValue>
                          {(values) => (
                            <>
                              {values.map((tag: (typeof tags)[number]) => (
                                <ComboboxChip key={tag.id}>
                                  {tag.name}
                                </ComboboxChip>
                              ))}
                              <ComboboxChipsInput ref={comboboxChipsInputRef} />
                            </>
                          )}
                        </ComboboxValue>
                      </ComboboxChips>
                      <ComboboxContent anchor={anchor}>
                        <ComboboxEmpty>
                          <Button
                            variant="secondary"
                            onClick={handleCreateTag}
                            // disabled={
                            //   comboboxChipsInputRef.current?.value.trim() === ""
                            // }
                          >
                            Add tag
                          </Button>
                        </ComboboxEmpty>
                        <ComboboxList>
                          {(tag) => (
                            <ComboboxItem key={tag.id} value={tag}>
                              {tag.name}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </Field>
                )}
              />

              {/* Folder (single) */}
              <Controller
                name="folderId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="input-group"
                  >
                    <FieldLabel htmlFor={field.name} className="input-label">
                      Folder
                    </FieldLabel>
                    <Combobox
                      items={folders}
                      value={folders.find((f) => f.id === field.value) ?? null}
                      itemToStringLabel={(folder) => folder.name}
                      onValueChange={(folder) =>
                        field.onChange(folder?.id ?? "")
                      }
                      autoHighlight
                    >
                      <ComboboxInput
                        className="input h-10!"
                        placeholder="Enter a folder name"
                        showClear={true}
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>
                          <ComboboxItem
                            render={
                              <Link
                                href="/folders/new"
                                className="border-border bg-input/30 hover:bg-input/50 hover:text-foreground cursor-pointer"
                              />
                            }
                          >
                            <HugeiconsIcon
                              icon={FolderAddIcon}
                              strokeWidth={2}
                            />
                            Create folder
                          </ComboboxItem>
                        </ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.id} value={item}>
                              {item.name}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </Field>
                )}
              />

              {error && (
                <Field>
                  <ErrorText>{error}</ErrorText>
                </Field>
              )}
            </FieldGroup>
          </FieldSet>

          <SheetFooter className="grid grid-cols-2 p-4!">
            <SheetClose
              render={
                <Button
                  variant="secondary"
                  className="h-11! w-full"
                  onClick={() =>
                    form.reset({
                      title: note.title || "",
                      folderId: note.folderId ?? null,
                      tagIds: initialTagIds,
                    })
                  }
                >
                  Close
                </Button>
              }
            ></SheetClose>
            <Button
              className="h-11! w-full"
              onClick={onSubmit}
              disabled={isSaving}
            >
              {isSaving ? <Spinner /> : "Save"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
