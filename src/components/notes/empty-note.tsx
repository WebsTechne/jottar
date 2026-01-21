import { HugeiconsIcon } from "@hugeicons/react";
import { buttonVariants } from "../ui/button";
import { QuillWrite01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

const EmptyNotes = () => (
  <div className="text-card-foreground bg-card corner-squircle flex h-25 w-full flex-col items-center justify-center gap-1.5 rounded-4xl border border-dashed p-3">
    You do not have any notes yet.
    <Link href="/new" className={buttonVariants({ size: "sm" })}>
      <HugeiconsIcon icon={QuillWrite01Icon} strokeWidth={2} />
      Create Note
    </Link>
  </div>
);

const EmptyFavorites = () => (
  <div className="text-card-foreground bg-card corner-squircle flex h-25 w-full flex-col items-center justify-center gap-1.5 rounded-4xl border border-dashed p-3">
    You do not have any favorite notes.
    <Link href="/notes" className={buttonVariants({ size: "sm" })}>
      Go to Notes
    </Link>
  </div>
);

const EmptyArchive = () => (
  <div className="text-card-foreground bg-card corner-squircle flex h-25 w-full flex-col items-center justify-center gap-1.5 rounded-4xl border border-dashed p-3">
    You do not have any archived notes.
    <Link href="/notes" className={buttonVariants({ size: "sm" })}>
      Go to Notes
    </Link>
  </div>
);

const EmptyTrash = () => (
  <div className="text-card-foreground bg-card corner-squircle flex h-25 w-full flex-col items-center justify-center gap-1.5 rounded-4xl border border-dashed p-3">
    You do not have any notes in the trash.
    <Link href="/notes" className={buttonVariants({ size: "sm" })}>
      Go to Notes
    </Link>
  </div>
);

export { EmptyNotes, EmptyFavorites, EmptyArchive, EmptyTrash };
