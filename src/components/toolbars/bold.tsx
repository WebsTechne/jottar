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
import { TextBoldIcon } from "@hugeicons/core-free-icons";

type BoldToolbarProps = {
  editor: Editor | null;
} & React.ComponentPropsWithoutRef<typeof Button>;

const BoldToolbar = React.forwardRef<
  React.ElementRef<typeof Button>,
  BoldToolbarProps
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
              editor?.isActive("bold") && "bg-accent",
              className,
            )}
            onClick={(e) => {
              editor?.chain().focus().toggleBold().run();
              onClick?.(e);
            }}
            disabled={!editor?.can().chain().focus().toggleBold().run()}
            ref={ref}
            {...props}
          />
        }
      >
        {children || (
          <HugeiconsIcon
            icon={TextBoldIcon}
            size={18}
            color="currentColor"
            strokeWidth={3}
          />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <span>Bold</span>
        <span className="text-gray-11 ml-1 text-xs">(cmd + b)</span>
      </TooltipContent>
    </Tooltip>
  );
});

BoldToolbar.displayName = "BoldToolbar";

export { BoldToolbar };
