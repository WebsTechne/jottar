"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEditor, type Extension, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { toast } from "sonner";

import { ThemeToggle } from "@/components/theme-toggle";
import { updateNote } from "@/lib/actions/note-actions";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { type FolderWithNotes } from "@/lib/fetch/get-folders";
import { type TagWithNoteTags } from "@/lib/fetch/get-tags";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { NoteDetails } from "@/components/toolbars/note-details";
import { NoteWithNoteTags } from "./page";

const Editor = dynamic(
  () => import("@/components/editor").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => <div className="bg-background min-h-72 cursor-text" />,
  },
);

const extensions = [
  StarterKit.configure({
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal",
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: "list-disc",
      },
    },
    code: {
      HTMLAttributes: {
        class: "bg-accent rounded-md p-1",
      },
    },
    horizontalRule: {
      HTMLAttributes: {
        class: "my-2",
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class:
          "bg-primary/80 text-primary-foreground p-2 text-sm rounded-md p-1",
      },
    },
    heading: {
      levels: [1, 2, 3, 4],
      HTMLAttributes: {
        class: "tiptap-heading",
      },
    },
  }),
];

interface NotePageClientProps {
  note: NoteWithNoteTags;
  folders: FolderWithNotes[];
  tags: TagWithNoteTags[];
}

const NotePageClient = ({ note, folders, tags }: NotePageClientProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const router = useRouter();

  const editor = useEditor({
    extensions: extensions as Extension[],
    content: "", // Initial content is set in useEffect
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    let initialContent: JSONContent | string = "";
    let unsaved = false;

    const localDraftRaw = localStorage.getItem(`draft:note:${note.id}`);
    if (localDraftRaw) {
      try {
        const localDraft = JSON.parse(localDraftRaw);
        const dbUpdatedAt = new Date(note.updatedAt);
        const localLastModified = localDraft.lastModified
          ? new Date(localDraft.lastModified)
          : null;

        if (localLastModified && localLastModified > dbUpdatedAt) {
          unsaved = true;
          initialContent = localDraft.content;
        }
      } catch (e) {
        // ignore
      }
    }

    if (!initialContent) {
      try {
        initialContent = JSON.parse(note.content);
      } catch (e) {
        initialContent = note.content;
      }
    }

    editor.commands.setContent(initialContent, { emitUpdate: false });
    setHasUnsavedChanges(unsaved);
  }, [editor, note]);

  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick((tick) => tick + 1), []);

  useEffect(() => {
    if (!editor) return;
    editor.on("selectionUpdate", forceUpdate);

    return () => {
      editor.off("selectionUpdate", forceUpdate);
    };
  }, [editor, forceUpdate]);

  useEffect(() => {
    if (editor) {
      const saveContent = () => {
        const localDraftRaw = localStorage.getItem(`draft:note:${note.id}`);
        const localDraft = localDraftRaw ? JSON.parse(localDraftRaw) : {};

        const newDraft = {
          ...localDraft,
          content: editor.getJSON(),
          lastModified: new Date().toISOString(),
        };

        localStorage.setItem(`draft:note:${note.id}`, JSON.stringify(newDraft));
        setHasUnsavedChanges(true);
      };
      editor.on("update", saveContent);
      return () => {
        editor.off("update", saveContent);
      };
    }
  }, [editor, note.id]);

  const handleSave = async () => {
    if (!editor) return;

    setIsSaving(true);
    try {
      const content = editor.getJSON();
      const result = await updateNote(note.id, JSON.stringify(content));

      if (result.error) {
        toast.error(result.error);
      } else if (result.data) {
        const localDraftRaw = localStorage.getItem(`draft:note:${note.id}`);
        const localDraft = localDraftRaw ? JSON.parse(localDraftRaw) : {};
        const newDraft = {
          ...localDraft,
          content,
          updatedAt: result.data.updatedAt,
        };
        delete newDraft.lastModified;
        localStorage.setItem(`draft:note:${note.id}`, JSON.stringify(newDraft));
        setHasUnsavedChanges(false);
        toast.success("Note updated!");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <header className="bg-background sticky top-0 z-1000 flex h-12 items-center justify-between gap-1 border px-2 py-2">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <HugeiconsIcon
            icon={ArrowLeft02Icon}
            size={24}
            strokeWidth={2}
            className="size-6!"
          />
        </Button>

        <NoteDetails note={note} folders={folders} tags={tags}>
          <div className="bg-muted text-muted-foreground! flex h-full max-w-100 flex-1 cursor-pointer items-center justify-center rounded-full">
            <span className="relative line-clamp-1 max-w-50">
              {note.title || "Untitled Note "}
            </span>
          </div>
        </NoteDetails>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
        </div>
      </header>
      <Editor
        editor={editor}
        onSave={handleSave}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
      />
    </>
  );
};

export default NotePageClient;
