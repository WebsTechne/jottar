import { HugeiconsIcon } from "@hugeicons/react";
import { buttonVariants } from "../ui/button";
import { QuillWrite01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

const EmptyNote = () => (
  <div className="text-card-foreground bg-card corner-squircle flex w-full flex-col items-center justify-between gap-1 rounded-4xl border border-dashed p-3">
    You do not have any notes yet.
    <Link href="/new" className={buttonVariants({ size: "sm" })}>
      <HugeiconsIcon icon={QuillWrite01Icon} strokeWidth={2} />
      Create Note
    </Link>
  </div>
);

export { EmptyNote };
