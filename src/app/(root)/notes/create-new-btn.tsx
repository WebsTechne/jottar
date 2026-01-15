"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { QuillWrite01Icon } from "@hugeicons/core-free-icons";

export function CreateNewBtn() {
  return (
    <Link
      href="/new"
      className={cn(buttonVariants(), "button w-full font-bold")}
    >
      <HugeiconsIcon
        icon={QuillWrite01Icon}
        strokeWidth={2}
        className="size-6!"
      />
      Create New Note
    </Link>
  );
}
