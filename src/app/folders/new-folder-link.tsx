"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

const NewFolderLink = () => {
  return (
    <Link
      href="/folders/new"
      className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "")}
    >
      <HugeiconsIcon icon={Add01Icon} className="size-6!" />
    </Link>
  );
};

export { NewFolderLink };
