"use client";

import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import getInitials from "@/lib/helpers/initials";
import Link from "next/link";
import type { ServerSession } from "@/app/layout";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ComputerIcon,
  LogoutSquare01Icon,
  Moon01Icon,
  Settings02Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons";

const signOutAndRedirect = async ({
  returnTo,
  push,
}: {
  returnTo: string;
  push: (href: string) => void;
}) => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        push(`/auth/sign-in?returnTo=${encodeURIComponent(returnTo)}`);
      },
      onError: () => {
        toast.error("Couldn't sign-out. Please try again.");
      },
    },
  });
};

function AccountButton({
  returnTo,
  session,
}: {
  returnTo: string;
  session: ServerSession;
}) {
  const { push } = useRouter();
  const { theme = "system", setTheme } = useTheme();
  const user = session?.user;

  if (!user) return <span className="bg-muted size-9 rounded-full">null</span>;

  const { name, image } = user;
  const { initials } = getInitials(name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        nativeButton={false}
        render={
          <span className="flex-center inline-flex size-9 rounded-full">
            <Avatar className="ring-accent dark:ring-accent/50 size-6.5 duration-300 hover:ring-[6px]">
              <AvatarImage src={image || ""} alt={name}></AvatarImage>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </span>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-40">
        <DropdownMenuGroup>
          {/* Settings */}
          <DropdownMenuItem
            nativeButton={false}
            render={
              <Link href="/settings">
                <HugeiconsIcon icon={Settings02Icon} strokeWidth={1.7} />{" "}
                Settings
              </Link>
            }
          ></DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Theme */}
        <DropdownMenuGroup className="text-muted-foreground flex flex-row! items-center justify-between gap-2 p-1">
          Theme
          <span className="flex items-center rounded-full bg-black/7 p-0.5 dark:bg-black/25">
            <DropdownMenuItem
              nativeButton={false}
              className={cn(
                theme === "light" && "bg-muted!",
                "grid size-6.5! place-items-center rounded-full p-0!",
              )}
              onClick={() => setTheme("light")}
            >
              <HugeiconsIcon icon={Sun03Icon} />
            </DropdownMenuItem>
            <DropdownMenuItem
              nativeButton={false}
              className={cn(
                theme === "dark" && "bg-muted!",
                "grid size-6.5! place-items-center rounded-full p-0!",
              )}
              onClick={() => setTheme("dark")}
            >
              <HugeiconsIcon icon={Moon01Icon} />
            </DropdownMenuItem>
            <DropdownMenuItem
              nativeButton={false}
              className={cn(
                theme === "system" && "bg-muted!",
                "grid size-6.5! place-items-center rounded-full p-0!",
              )}
              onClick={() => setTheme("system")}
            >
              <HugeiconsIcon icon={ComputerIcon} />
            </DropdownMenuItem>
          </span>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            nativeButton={false}
            variant="destructive"
            onClick={() => signOutAndRedirect({ returnTo, push })}
          >
            <HugeiconsIcon icon={LogoutSquare01Icon} strokeWidth={1.7} />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { AccountButton, signOutAndRedirect };
