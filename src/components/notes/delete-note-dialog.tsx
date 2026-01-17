import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
          <div className="bg-muted text-muted-foreground line-clamp-1 rounded-md px-2 py-1 text-sm font-semibold">
            {title}
          </div>
          <AlertDialogDescription>
            This note will be moved to Trash and kept for 30 days. You can
            restore it before it’s permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row!">
          <AlertDialogCancel className="not-sm:flex-1">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {}}
            className="not-sm:flex-1"
          >
            Trash note
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { DeleteNoteDialog };
