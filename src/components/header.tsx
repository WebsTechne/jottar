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
    <header className="bg-background/90 sticky top-0 z-1000 flex h-12 items-center justify-between border-b px-4 backdrop-blur-lg">
      <Link
        href="/"
        className="flex items-center gap-0.5 text-lg font-semibold"
      >
        <HugeiconsIcon
          icon={QuillWrite01Icon}
          strokeWidth={2}
          className="size-6!"
        />
        Jottar
      </Link>

      <section className="flex items-center gap-3">
        {/*<Link href="/new" className={buttonVariants({ size: "sm" })}>
          New note
        </Link>*/}

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => toast("Nothing here yet...")}
          // className="p-0! px-0! py-0!"
        >
          <HugeiconsIcon icon={Search01Icon} className="size-6!" />
        </Button>

        <AccountButton session={session} returnTo={returnTo} />
      </section>
    </header>
  );
};

export { Header };
