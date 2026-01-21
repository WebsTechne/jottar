"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEditor, type Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { toast } from "sonner";

import { ThemeToggle } from "@/components/theme-toggle";
import { createNote } from "@/lib/actions/note-actions";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";

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

function getInitialContent() {
  if (typeof window === "undefined") {
    return "";
  }

  const savedContent = localStorage.getItem("draft:new");

  if (savedContent) {
    try {
      return JSON.parse(savedContent);
    } catch (err) {
      return savedContent;
    }
  }

  return "";
}

const NewNotePage = () => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(
    () => !!getInitialContent(),
  );

  const editor = useEditor({
    extensions: extensions as Extension[],
    content: getInitialContent(),
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor) {
      const saveContent = () => {
        localStorage.setItem("draft:new", JSON.stringify(editor.getJSON()));
        setHasUnsavedChanges(true);
      };
      editor.on("update", saveContent);
      return () => {
        editor.off("update", saveContent);
      };
    }
  }, [editor]);

  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick((tick) => tick + 1), []);

  useEffect(() => {
    if (editor) {
      editor.on("selectionUpdate", forceUpdate);
      return () => {
        editor.off("selectionUpdate", forceUpdate);
      };
    }
  }, [editor, forceUpdate]);

  const handleSave = async () => {
    if (!editor) return;

    setIsSaving(true);

    try {
      const content = editor.getJSON();
      const result = await createNote(JSON.stringify(content));

      if (result.error) {
        toast.error(result.error);
      } else if (result.data) {
        const newNoteId = result.data.id;
        const newDraft = {
          content,
          updatedAt: result.data.updatedAt,
        };
        localStorage.setItem(
          `draft:note:${newNoteId}`,
          JSON.stringify(newDraft),
        );
        localStorage.removeItem("draft:new");
        toast.success("Note saved!");
        router.replace(`/notes/${newNoteId}`);
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
        <span>New note • Jottar</span>
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

export default NewNotePage;
