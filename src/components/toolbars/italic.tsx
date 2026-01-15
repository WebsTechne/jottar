"use client";

import React from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { type Editor } from "@tiptap/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { TextItalicIcon } from "@hugeicons/core-free-icons";

type ItalicToolbarProps = {
  editor: Editor | null;
} & React.ComponentPropsWithoutRef<typeof Button>;

const ItalicToolbar = React.forwardRef<
  React.ElementRef<typeof Button>,
  ItalicToolbarProps
>(({ className, editor, onClick, children, ...props }, ref) => {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              editor?.isActive("italic") && "bg-accent! active",
              className,
            )}
            onClick={(e) => {
              editor?.chain().focus().toggleItalic().run();
              onClick?.(e);
            }}
            disabled={!editor?.can().chain().focus().toggleItalic().run()}
            ref={ref}
            {...props}
          />
        }
      >
        {children || (
          <HugeiconsIcon icon={TextItalicIcon} size={16} strokeWidth={2} />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <span>Italic</span>
        <span className="text-gray-11 ml-1 text-xs">(cmd + i)</span>
      </TooltipContent>
    </Tooltip>
  );
});

ItalicToolbar.displayName = "ItalicToolbar";

export { ItalicToolbar };
