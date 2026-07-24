import { type NoteData } from "@/lib/fetch/get-notes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import capitalize from "@/lib/helpers/capitalize";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";

const NoteDetailsBody = ({
  note,
  folder,
}: {
  note: NoteData;
  folder: string;
}) => {
  return (
    <div className="flex flex-col gap-4 px-2">
      <p className="flex items-center gap-1">
        <span>Favorite: </span>
        <span className="font-mono">{note.favorite ? "Yes" : "No"}</span>
      </p>
      <p className="flex items-center gap-1">
        <span>Shareable: </span>
        <span className="font-mono">{note.shareable ? "Yes" : "No"}</span>
      </p>
      <p className="flex items-center gap-1">
        <span>Folder: </span>
        <span className="font-mono">
          {folder.length > 0 ? capitalize(folder) : "None"}
        </span>
      </p>
      <p className="flex items-center gap-1">
        <span>Tags: </span>
        <span className="font-mono">
          {note.noteTags.length > 0
            ? note.noteTags.map((tag) => (
                <Link
                  key={tag.tag.name}
                  href={`/notes?tag=${encodeURIComponent(tag.tag.name)}`}
                  className="mr-1 rounded-full bg-purple-600/20 px-2 py-1 text-purple-800 dark:bg-purple-500/10! dark:text-purple-600!"
                >
                  {tag.tag.name}
                </Link>
              ))
            : "None"}
        </span>
      </p>
      <p className="flex items-center gap-1">
        <span>Created: </span>
        <span className="font-mono">{note.createdAt.toLocaleString()}</span>
      </p>
      <p className="flex items-center gap-1">
        <span>Updated: </span>
        <span className="font-mono">{note.updatedAt.toLocaleString()}</span>
      </p>
    </div>
  );
};

const NoteDetails = ({
  note,
  preview,
  folder,
  open,
  onOpenChange,
}: {
  note: NoteData;
  preview: string;
  folder: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="">
          <DrawerHeader>
            <DrawerTitle>
              <div className="line-clamp-1 px-2 py-1 font-semibold">
                {note.title || "Untitled note"}
              </div>
            </DrawerTitle>

            <DrawerDescription className="line-clamp-2">
              {preview}
            </DrawerDescription>
          </DrawerHeader>

          <NoteDetailsBody note={note} folder={folder} />
        </DrawerContent>
      </Drawer>
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-3.5!">
        <DialogHeader>
          <DialogTitle>Note details</DialogTitle>
          <div className="line-clamp-1 px-2 py-1 font-semibold">
            {note.title || "Untitled note"}
          </div>
          <DialogDescription className="line-clamp-2">
            {preview}
          </DialogDescription>
        </DialogHeader>

        <NoteDetailsBody note={note} folder={folder} />
      </DialogContent>
    </Dialog>
  );
};

export { NoteDetails };
