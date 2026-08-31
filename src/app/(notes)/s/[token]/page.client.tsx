"use client";

import { Extension, useEditor } from "@tiptap/react";
import { extensions } from "../../notes/[id]/page.client";
import { type SharedNote } from "./page";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  Download01FreeIcons,
  InfoFreeIcons,
  LockKeyholeFreeIcons,
} from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Editor } from "@/components/editor";

function SharedNoteClient({ note }: { note: SharedNote }) {
  const router = useRouter();

  // const Editor = dynamic(
  //   () => import("@/components/editor").then((mod) => mod.Editor),
  //   {
  //     ssr: false,
  //     loading: () => <div className="bg-background min-h-72 cursor-text" />,
  //   },
  // );

  const editor = useEditor({
    extensions: extensions as Extension[],
    content: JSON.parse(note.content), // Initial content is set in useEffect
    immediatelyRender: true,
  });

  const user = note.user;
  const initials = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <>
      <header className="bg-background sticky top-0 z-1000 flex h-12 items-center justify-between gap-1 border px-2 py-2">
        <section className="flex-between gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
            <HugeiconsIcon
              icon={ArrowLeft02Icon}
              size={24}
              strokeWidth={2}
              className="size-6!"
            />
          </Button>
          <span className="inline-block w-max max-w-[20ch] text-lg font-semibold">
            {note.title}
          </span>
          {!note.allowCopy && (
            <Badge variant="secondary" className="px-3">
              <HugeiconsIcon icon={LockKeyholeFreeIcons} strokeWidth={2} />
              Read-only
            </Badge>
          )}
        </section>

        <section className="flex-between gap-2">
          <Avatar className="size-6">
            {user.image && (
              <AvatarImage src={user.image} alt={user.name ?? ""} />
            )}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm not-md:hidden">
            Shared by <b>{note.user.displayUsername}</b>
          </span>

          <Button
            variant="outline"
            size="sm"
            className="rounded-md not-md:hidden"
            disabled
          >
            <HugeiconsIcon icon={Download01FreeIcons} /> Save to my notes
          </Button>

          <Button variant="ghost" size="icon-lg">
            <HugeiconsIcon icon={InfoFreeIcons} className="size-5!" />
          </Button>
        </section>
      </header>

      <Editor editor={editor} />
    </>
  );
}

export { SharedNoteClient };
