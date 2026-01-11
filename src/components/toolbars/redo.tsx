"use client";

import React, { useEffect, useState } from "react";

import { Button, ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { type Editor } from "@tiptap/react";
import { ArrowMoveUpRightIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type RedoToolbarProps = ButtonProps & {
  editor: Editor | null;
};

const computeCanRedo = (editor: Editor | null) => {
  if (!editor) return false;
  try {
    // prefer explicit API if available
    if (
      typeof editor.can === "function" &&
      typeof editor.can().redo === "function"
    ) {
      return Boolean(editor.can().redo());
    }
    // fallback
    return Boolean(editor.can().chain().focus().redo().run());
  } catch {
    return false;
  }
};

const RedoToolbar = React.forwardRef<
  React.ElementRef<typeof Button>,
  RedoToolbarProps
>(({ className, editor, onClick, children, ...props }, ref) => {
  const [canRedo, setCanRedo] = useState<boolean>(() => computeCanRedo(editor));

  useEffect(() => {
    if (!editor) {
      // defer to next tick to avoid sync setState in effect
      Promise.resolve().then(() => setCanRedo(false));
      return;
    }

    const check = () => {
      setCanRedo(computeCanRedo(editor));
    };

    // defer the first setState to avoid "sync setState in effect" warning
    Promise.resolve().then(check);

    editor.on("update", check);
    editor.on("transaction", check);

    return () => {
      editor.off("update", check);
      editor.off("transaction", check);
    };
  }, [editor]);

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", className)}
            onClick={(e) => {
              editor?.chain().focus().redo().run();
              onClick?.(e);
            }}
            disabled={!canRedo}
            ref={ref}
            {...props}
          />
        }
      >
        {children || (
          <HugeiconsIcon
            icon={ArrowMoveUpRightIcon}
            size={16}
            strokeWidth={2}
            color="currentColor"
          />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <span>Redo</span>
      </TooltipContent>
    </Tooltip>
  );
});

RedoToolbar.displayName = "RedoToolbar";

export { RedoToolbar };
