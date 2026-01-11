"use client";

import { Separator } from "@/components/ui/separator";
import { BlockquoteToolbar } from "@/components/toolbars/blockquote";
import { BoldToolbar } from "@/components/toolbars/bold";
import { BulletListToolbar } from "@/components/toolbars/bullet-list";
import { CodeToolbar } from "@/components/toolbars/code";
import { CodeBlockToolbar } from "@/components/toolbars/code-block";
import { HardBreakToolbar } from "@/components/toolbars/hard-break";
import { HorizontalRuleToolbar } from "@/components/toolbars/horizontal-rule";
import { ItalicToolbar } from "@/components/toolbars/italic";
import { OrderedListToolbar } from "@/components/toolbars/ordered-list";
import { RedoToolbar } from "@/components/toolbars/redo";
import { StrikeThroughToolbar } from "@/components/toolbars/strikethrough";
import { UndoToolbar } from "@/components/toolbars/undo";
import { EditorContent, type Editor as EditorType } from "@tiptap/react";
import { ScrollArea } from "./ui/scroll-area";

interface EditorProps {
  editor: EditorType | null;
}

const Editor = ({ editor }: EditorProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden rounded-b-2xl pb-3">
      <div className="bg-background sticky top-0 left-0 z-20 flex w-full items-center justify-between overflow-clip rounded-b-2xl border border-t-0 px-2 py-2">
        <ScrollArea className="w-full">
          <div className="flex items-center gap-2">
            <UndoToolbar editor={editor} />
            <RedoToolbar editor={editor} />
            <Separator orientation="vertical" className="h-7" />
            <BoldToolbar editor={editor} />
            <ItalicToolbar editor={editor} />
            <StrikeThroughToolbar editor={editor} />
            <BulletListToolbar editor={editor} />
            <OrderedListToolbar editor={editor} />
            <CodeToolbar editor={editor} />
            <CodeBlockToolbar editor={editor} />
            <HorizontalRuleToolbar editor={editor} />
            <BlockquoteToolbar editor={editor} />
            <HardBreakToolbar editor={editor} />
          </div>
        </ScrollArea>
      </div>
      <div
        onClick={() => {
          editor?.chain().focus().run();
        }}
        className="bg-background min-h-72 cursor-text"
      >
        <EditorContent className="outline-none" editor={editor} />
      </div>
    </div>
  );
};

export { Editor };
