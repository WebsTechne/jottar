"use client";

import React from "react";

import { Button, ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { type Editor } from "@tiptap/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowMoveUpLeftIcon } from "@hugeicons/core-free-icons";

type UndoToolbarProps = {
  editor: Editor | null;
} & React.ComponentPropsWithoutRef<typeof Button>;

const UndoToolbar = React.forwardRef<
  React.ElementRef<typeof Button>,
  UndoToolbarProps
>(({ className, editor, onClick, children, ...props }, ref) => {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", className)}
            onClick={(e) => {
              editor?.chain().focus().undo().run();
              onClick?.(e);
            }}
            disabled={!editor?.can().chain().focus().undo().run()}
            ref={ref}
            {...props}
          />
        }
      >
        {children || (
          <HugeiconsIcon
            icon={ArrowMoveUpLeftIcon}
            size={16}
            strokeWidth={2}
            color="currentColor"
          />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <span>Undo</span>
      </TooltipContent>
    </Tooltip>
  );
});

UndoToolbar.displayName = "UndoToolbar";

export { UndoToolbar };
