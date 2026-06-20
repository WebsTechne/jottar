"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { QuillWrite01Icon } from "@hugeicons/core-free-icons";

const FloatingButton = ({ folderSlug }: { folderSlug?: string }) => {
  return (
    <Link
      href={folderSlug ? `/new?folder=${folderSlug}` : "/new"}
      className={cn(
        buttonVariants({ size: "icon-xl" }),
        "fixed right-4 bottom-4 z-1000 shadow-lg",
      )}
    >
      <HugeiconsIcon
        icon={QuillWrite01Icon}
        strokeWidth={2}
        className="size-6!"
      />
    </Link>
  );
};

export { FloatingButton };
