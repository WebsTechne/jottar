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
import type { ServerSession } from "@/app/layout";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ComputerIcon,
  Archive03Icon,
  StarIcon,
  LogoutSquare01Icon,
  Moon01Icon,
  Sun03Icon,
  Folder02Icon,
  Note01Icon,
  TagsIcon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { Spinner } from "./ui/spinner";
import { MenuLink } from "./menu-links";
import { buttonVariants } from "./ui/button";
import { useOverlay } from "@/context/overlay-context";

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

function UserAvatar({
  name,
  image,
  initials,
}: {
  name: string;
  image?: string | null;
  initials: string;
}) {
  return (
    <Avatar className="ring-accent dark:ring-accent/50 size-6.5 duration-300 hover:ring-4">
      <AvatarImage src={image || ""} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}

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

  const { active, open, close } = useOverlay();
  const isOpen = active === "menu";

  if (!user)
    return (
      <span
        className="bg-muted size-6.5 rounded-full"
        aria-label="Loading account"
        role="status"
      >
        <Spinner className="size-4" />
      </span>
    );

  const { name, image } = user;
  const { initials } = getInitials(name);

  return (
    <>
      <DropdownMenu
        open={isOpen}
        onOpenChange={(v) => (v ? open("menu") : close())}
      >
        <DropdownMenuTrigger
          nativeButton={false}
          aria-label="Open account menu"
          render={
            <span
              className={cn(
                buttonVariants({ size: "icon-lg", variant: "ghost" }),
                "flex-center inline-flex size-9! rounded-full",
              )}
            >
              <span className={cn("menu", isOpen && "active")}>
                <span className="bar" />
                <span className="bar" />
              </span>
            </span>
          }
        />
        <DropdownMenuContent className="z-1002! min-w-50" sideOffset={10}>
          <DropdownMenuGroup>
            <MenuLink
              href="/account"
              // icon={Settings02Icon}
              icon={
                <UserAvatar initials={initials} name={name} image={image} />
              }
              label="Account"
              ariaLabel="Go to account"
            />

            <DropdownMenuSeparator />

            <MenuLink
              href="/notes"
              icon={<HugeiconsIcon icon={Note01Icon} strokeWidth={1.7} />}
              label="Notes"
              ariaLabel="View all notes"
            />

            <MenuLink
              href="/folders"
              icon={<HugeiconsIcon icon={Folder02Icon} strokeWidth={1.7} />}
              label="Folders"
              ariaLabel="View all folders"
            />

            <MenuLink
              href="/tags"
              icon={<HugeiconsIcon icon={TagsIcon} strokeWidth={1.7} />}
              label="Tags"
              ariaLabel="View all tags"
            />

            <DropdownMenuSeparator />

            <MenuLink
              href="/favorites"
              icon={<HugeiconsIcon icon={StarIcon} strokeWidth={1.7} />}
              label="Favorites"
              ariaLabel="View favorite notes"
            />

            <MenuLink
              href="/archive"
              icon={<HugeiconsIcon icon={Archive03Icon} strokeWidth={1.7} />}
              label="Archived notes"
              ariaLabel="View archived notes"
            />

            <MenuLink
              href="/trash"
              icon={<HugeiconsIcon icon={Delete02Icon} strokeWidth={1.7} />}
              label="Trashed notes"
              ariaLabel="View trashed notes"
            />
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Theme */}
          <DropdownMenuGroup className="text-muted-foreground flex flex-row! items-center justify-between gap-2 p-1">
            Theme
            <span className="flex items-center rounded-full bg-black/7 p-0.5 dark:bg-black/25">
              <DropdownMenuItem
                nativeButton={false}
                aria-label="Switch to light theme"
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
                aria-label="Switch to dark theme"
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
                aria-label="Use system theme"
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
              aria-label="Sign out of your account"
              onClick={() => signOutAndRedirect({ returnTo, push })}
              className="text-base!"
            >
              <HugeiconsIcon icon={LogoutSquare01Icon} strokeWidth={1.7} />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export { AccountButton, signOutAndRedirect };
