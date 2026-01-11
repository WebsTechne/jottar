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
import { TextStrikethroughIcon } from "@hugeicons/core-free-icons";

type StrikeThroughToolbarProps = {
  editor: Editor | null;
} & React.ComponentPropsWithoutRef<typeof Button>;

const StrikeThroughToolbar = React.forwardRef<
  React.ElementRef<typeof Button>,
  StrikeThroughToolbarProps
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
              editor?.isActive("strike") && "bg-accent",
              className,
            )}
            onClick={(e) => {
              editor?.chain().focus().toggleStrike().run();
              onClick?.(e);
            }}
            disabled={!editor?.can().chain().focus().toggleStrike().run()}
            ref={ref}
            {...props}
          />
        }
      >
        {children || (
          <HugeiconsIcon
            icon={TextStrikethroughIcon}
            size={16}
            strokeWidth={2}
          />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <span>Strikethrough</span>
        <span className="text-gray-11 ml-1 text-xs">(cmd + shift + x)</span>
      </TooltipContent>
    </Tooltip>
  );
});

StrikeThroughToolbar.displayName = "StrikeThroughToolbar";

export { StrikeThroughToolbar };
