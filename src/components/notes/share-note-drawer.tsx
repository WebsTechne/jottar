import { NoteData } from "@/lib/fetch/get-notes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "../ui/field";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { cn } from "@/lib/utils";
import { useOverlay } from "@/context/overlay-context";
import { toggleShareOptions } from "@/lib/actions/note-actions";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, Copy02Icon, CopyCheck } from "@hugeicons/core-free-icons";
import { Spinner } from "../ui/spinner";
import { copyToClipboard } from "@/lib/helpers/copy-to-clipboard";

const formSchema = z.object({
  shareNote: z.boolean(),
  showUsername: z.boolean(),
  allowCopy: z.boolean(),
});
type FormValues = z.infer<typeof formSchema>;

const ShareNoteBody = ({
  note,
  setNote,
  shareLink,
}: {
  note: NoteData;
  setNote: Dispatch<SetStateAction<NoteData>>;
  shareLink: string;
}) => {
  const isMobile = useIsMobile();
  const [isCopying, setIsCopying] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shareNote: note.shareable,
      showUsername: note.shareLinkType === "USERNAME",
      allowCopy: note.allowCopy,
    },
  });

  const onSubmit = async (data: FormValues) => {
    const { allowCopy, shareNote: shareable, showUsername } = data;
    const shareLinkType = showUsername ? "USERNAME" : "TOKEN";

    try {
      const res = await toggleShareOptions({
        id: note.id,
        allowCopy,
        shareLinkType,
        shareable,
      });

      if (res.error) {
        toast.error(res.error);
        console.error(res.error);
      }

      if (res.data) {
        const { allowCopy, shareLinkType, shareable } = res.data;
        setNote((n) => ({ ...n, allowCopy, shareLinkType, shareable }));
      }
    } catch (err) {}
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareLink);

    if (success) {
      toast.success("Link copied to clipboard");
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
    } else {
      toast.error("Failed to copy link");
    }
  };

  const watchShareNote = useWatch({ control, name: "shareNote" });

  return (
    <form id="share-options-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <InputGroup
          className="h-11 border! bg-transparent font-mono"
          aria-disabled={!note.shareable}
        >
          <InputGroupInput
            value={shareLink}
            readOnly
            disabled={!note.shareable}
          />
          <InputGroupButton
            className="mr-1 aspect-square h-8/10! rounded-lg!"
            disabled={!note.shareable}
            onClick={handleCopyLink}
          >
            <HugeiconsIcon
              icon={isCopying ? CopyCheck : Copy01Icon}
              className="size-5!"
            />
          </InputGroupButton>
        </InputGroup>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor="share-note" className="cursor-pointer border-none">
          <Field orientation="horizontal" className="py-3!">
            <FieldContent>
              <FieldTitle>Share note</FieldTitle>
              <FieldDescription>
                Let anyone with the link view this note
              </FieldDescription>
            </FieldContent>
            <Controller
              name="shareNote"
              control={control}
              render={({ field }) => (
                <Switch
                  id="share-note"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
              )}
            />
          </Field>
        </FieldLabel>

        <FieldLabel
          htmlFor="show-username"
          className={cn(
            "cursor-pointer border-none duration-200",
            !watchShareNote && "pointer-events-none opacity-50",
          )}
        >
          <Field orientation="horizontal" className="py-3!">
            <FieldContent>
              <FieldTitle>Show my username in the link</FieldTitle>
              <FieldDescription>
                Off for an anonymous, unlisted link instead
              </FieldDescription>
            </FieldContent>
            <Controller
              name="showUsername"
              control={control}
              render={({ field }) => (
                <Switch
                  id="show-username"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  disabled={!watchShareNote}
                />
              )}
            />
          </Field>
        </FieldLabel>

        <FieldLabel
          htmlFor="allow-copy"
          className={cn(
            "mt-2 cursor-pointer border-none duration-200",
            !watchShareNote && "pointer-events-none opacity-50",
          )}
        >
          <Field orientation="horizontal" className="py-3!">
            <FieldContent>
              <FieldTitle>Allow saving a copy</FieldTitle>
              <FieldDescription>
                Let others save this note to their own account
              </FieldDescription>
            </FieldContent>
            <Controller
              name="allowCopy"
              control={control}
              render={({ field }) => (
                <Switch
                  id="allow-copy"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  disabled={!watchShareNote}
                />
              )}
            />
          </Field>
        </FieldLabel>
      </div>

      {isMobile ? (
        <DrawerFooter className="grid grid-cols-2 px-2!">
          <DrawerClose asChild={true}>
            <Button
              type="reset"
              form="share-options-form"
              variant="secondary"
              className="h-11!"
            >
              Cancel
            </Button>
          </DrawerClose>
          <Button type="submit" form="share-options-form" className="h-11!">
            {isSubmitting ? <Spinner /> : "Share"}
          </Button>
        </DrawerFooter>
      ) : (
        <DialogFooter className="grid grid-cols-2 px-2! py-4">
          <DialogClose
            render={
              <Button
                type="reset"
                form="share-options-form"
                variant="secondary"
                className="h-11!"
              />
            }
          >
            Cancel
          </DialogClose>
          <Button type="submit" form="share-options-form" className="h-11!">
            {isSubmitting ? <Spinner /> : "Share"}
          </Button>
        </DialogFooter>
      )}
    </form>
  );
};

const ShareNoteDrawer = ({
  note,
  setNote,
  preview,
  open,
  onOpenChange,
}: {
  note: NoteData;
  setNote: Dispatch<SetStateAction<NoteData>>;
  preview: string;
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) => {
  const { active, open: overlayOpen, close } = useOverlay();
  const owner = `share-note:${note.id}`;

  const prefix = `${process.env.NEXT_PUBLIC_APP_URL}/s`;
  const { data: session } = authClient.useSession();
  const username = session?.user.username;
  const shareLink = !note.shareable
    ? "https://"
    : note.shareLinkType === "USERNAME"
      ? `${prefix}/${username}/${note.id}`
      : `${prefix}/${note.shareToken}`;

  useEffect(() => {
    if (open) {
      overlayOpen(owner);
    } else if (active === owner) {
      close();
    }
  }, [open]);

  const isMobile = useIsMobile();
  if (isMobile)
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="">
          <DrawerHeader>
            <DrawerTitle>
              <div className="line-clamp-1 py-1 font-semibold">
                {note.title || "Untitled note"}
              </div>
            </DrawerTitle>

            <DrawerDescription className="line-clamp-2">
              {preview}
            </DrawerDescription>
          </DrawerHeader>

          <ShareNoteBody note={note} setNote={setNote} shareLink={shareLink} />
        </DrawerContent>
      </Drawer>
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-3.5!">
        <DialogHeader>
          <DialogTitle>Note details</DialogTitle>
          <div className="line-clamp-1 py-1 font-semibold">
            {note.title || "Untitled note"}
          </div>
          <DialogDescription className="line-clamp-2">
            {preview}
          </DialogDescription>
        </DialogHeader>

        <ShareNoteBody note={note} setNote={setNote} shareLink={shareLink} />
      </DialogContent>
    </Dialog>
  );
};

export { ShareNoteDrawer };
