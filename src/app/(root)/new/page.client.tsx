"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEditor, type Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { toast } from "sonner";

import { SaveButton } from "@/components/toolbars/save-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { createNote } from "@/lib/actions/note-actions";

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
    } catch (e) {
      return savedContent;
    }
  }

  return "";
}

const NewNotePage = () => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: extensions as Extension[],
    content: getInitialContent(),
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor) {
      const saveContent = () => {
        localStorage.setItem("draft:new", JSON.stringify(editor.getJSON()));
      };
      editor.on("update", saveContent);
      return () => {
        editor.off("update", saveContent);
      };
    }
  }, [editor]);

  const handleSave = async () => {
    if (!editor) return;

    setIsSaving(true);

    try {
      const content = editor.getJSON();
      const result = await createNote(content);

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
      <header className="bg-background flex h-12 items-center justify-between border px-2 py-2">
        <span>New note • Jottar</span>
        <div className="flex items-center gap-2 sm:gap-3">
          <SaveButton onSave={handleSave} isSaving={isSaving} />
          <ThemeToggle />
        </div>
      </header>
      <Editor editor={editor} />
    </>
  );
};

export default NewNotePage;
