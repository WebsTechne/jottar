import { HugeiconsIcon } from "@hugeicons/react";
import { buttonVariants } from "../ui/button";
import { QuillWrite01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

const EmptyNotes = () => (
  <div className="text-card-foreground bg-card supports-[corner-shape:squircle]:squircle-card flex h-25 w-full flex-col items-center justify-center gap-1.5 rounded-4xl border border-dashed p-3">
    You do not have any notes yet.
    <Link href="/new" className={buttonVariants({ size: "sm" })}>
      <HugeiconsIcon icon={QuillWrite01Icon} strokeWidth={2} />
      Create Note
    </Link>
  </div>
);

const EmptyFolder = () => (
  <div className="text-card-foreground bg-background supports-[corner-shape:squircle]:squircle-card flex min-h-25 w-full flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed p-3">
    <p className="text-center text-sm">
      You do not have any notes in this folder. You can add notes to this folder
      from the notes page.
    </p>
    <Link href="/notes" className={buttonVariants({ size: "sm" })}>
      Explore Notes
    </Link>
  </div>
);
const EmptyFavorites = () => (
  <div className="text-card-foreground bg-card supports-[corner-shape:squircle]:squircle-card flex h-25 w-full flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed p-3">
    You do not have any favorite notes.
    <Link href="/notes" className={buttonVariants({ size: "sm" })}>
      Go to Notes
    </Link>
  </div>
);

const EmptyArchive = () => (
  <div className="text-card-foreground bg-card supports-[corner-shape:squircle]:squircle-card flex h-25 w-full flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed p-3">
    You do not have any archived notes.
    <Link href="/notes" className={buttonVariants({ size: "sm" })}>
      Go to Notes
    </Link>
  </div>
);

const EmptyTrash = () => (
  <div className="text-card-foreground bg-card supports-[corner-shape:squircle]:squircle-card flex h-25 w-full flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed p-3">
    You do not have any notes in the trash.
    <Link href="/notes" className={buttonVariants({ size: "sm" })}>
      Go to Notes
    </Link>
  </div>
);

export { EmptyNotes, EmptyFolder, EmptyFavorites, EmptyArchive, EmptyTrash };
