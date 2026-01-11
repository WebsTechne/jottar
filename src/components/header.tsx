"use client";

import { ServerSession } from "@/app/layout";
import { AccountButton } from "./account-button";
import { usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { QuillWrite01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";

const Header = ({ session }: { session: ServerSession }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnTo =
    pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

  return (
    <header className="flex h-12 items-center justify-between border-b px-4">
      <section className=""></section>

      <section className="flex items-center gap-3">
        <Link href="/new" className={buttonVariants({ size: "sm" })}>
          <HugeiconsIcon icon={QuillWrite01Icon} />
          New note
        </Link>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() =>
            toast.info("Nothing here yet...", { closeButton: true })
          }
        >
          <HugeiconsIcon icon={Search01Icon} className="size-6!" />
        </Button>

        <AccountButton session={session} returnTo={returnTo} />
      </section>
    </header>
  );
};

export { Header };
