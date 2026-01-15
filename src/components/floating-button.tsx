"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { QuillWrite01Icon } from "@hugeicons/core-free-icons";

const FloatingButton = () => {
  return (
    <Link
      href="/new"
      className={cn(
        buttonVariants({ size: "icon-xl" }),
        "fixed right-4 bottom-4 shadow-lg",
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
