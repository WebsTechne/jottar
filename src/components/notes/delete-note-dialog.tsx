import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cloneElement, ReactNode } from "react";

const DeleteNoteDialog = ({
  id,
  title,
  open,
  onOpenChange,
}: {
  id: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Move note to trash?</AlertDialogTitle>
          <AlertDialogDescription>
            This note will be moved to Trash and kept for 30 days. You can
            restore it anytime from the Trash before it’s permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => {}}>
            Trash note
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { DeleteNoteDialog };
