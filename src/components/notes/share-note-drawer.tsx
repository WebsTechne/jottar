import { NoteData } from "@/lib/fetch/get-notes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dispatch, SetStateAction } from "react";

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
  const isMobile = useIsMobile();
  if (isMobile)
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="">
          <DrawerHeader>
            <DrawerTitle>
              <div className="bg-muted text-muted-foreground line-clamp-1 rounded-md px-2 py-1 text-sm font-semibold">
                {note.title || "Untitled note"}
              </div>
            </DrawerTitle>

            <DrawerDescription className="line-clamp-2">
              {preview}
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );

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
      </DialogContent>
    </Dialog>
  );
};

export { ShareNoteDrawer };
