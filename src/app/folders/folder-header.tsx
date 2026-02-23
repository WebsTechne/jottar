"use client";

import { ReactNode } from "react";
import { ServerSession } from "@/app/layout";
import { MenuButton } from "@/components/menu-button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft02Icon,
  QuillWrite01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FolderHeader({
  noLeft,
  back,
  children,
  session,
}: {
  noLeft?: boolean;
  back?: boolean;
  children?: ReactNode;
  session: ServerSession;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnTo =
    pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

  return (
    <header className="bg-background/90 sticky top-0 z-1000 flex h-12 items-center justify-between overflow-y-visible border-b px-4 backdrop-blur-lg">
      {!noLeft && back ? (
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <HugeiconsIcon
            icon={ArrowLeft02Icon}
            size={24}
            strokeWidth={2}
            className="size-6!"
          />
        </Button>
      ) : (
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
      )}

      <section className="flex items-center gap-3">
        {children ? (
          children
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => toast("This feature isn't available yet")}
              // className="p-0! px-0! py-0!"
            >
              <HugeiconsIcon icon={Search01Icon} className="size-6!" />
            </Button>

            <MenuButton session={session} returnTo={returnTo} />
          </>
        )}
      </section>
    </header>
  );
}
