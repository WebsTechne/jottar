import { Note } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import capitalize from "@/lib/helpers/capitalize";

const NoteDetails = ({
  note,
  preview,
  folder,
  open,
  onOpenChange,
}: {
  note: Note;
  preview: string;
  folder: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-3.5!">
        <DialogHeader>
          <DialogTitle>Note details</DialogTitle>
          <div className="bg-muted text-muted-foreground line-clamp-1 rounded-md px-2 py-1 text-sm font-semibold">
            {note.title || "Untitled note"}
          </div>
          <DialogDescription className="line-clamp-2">
            {preview}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
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
            <span>Created: </span>
            <span className="font-mono">{note.createdAt.toLocaleString()}</span>
          </p>
          <p className="flex items-center gap-1">
            <span>Updated: </span>
            <span className="font-mono">{note.updatedAt.toLocaleString()}</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { NoteDetails };
