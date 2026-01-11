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
import { TextWrapIcon } from "@hugeicons/core-free-icons";

type HardBreakToolbarProps = {
  editor: Editor | null;
} & React.ComponentPropsWithoutRef<typeof Button>;

const HardBreakToolbar = React.forwardRef<
  React.ElementRef<typeof Button>,
  HardBreakToolbarProps
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
              editor?.chain().focus().setHardBreak().run();
              onClick?.(e);
            }}
            ref={ref}
            {...props}
          />
        }
      >
        {children || (
          <HugeiconsIcon icon={TextWrapIcon} size={16} strokeWidth={2} />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <span>Hard break</span>
      </TooltipContent>
    </Tooltip>
  );
});

HardBreakToolbar.displayName = "HardBreakToolbar";

export { HardBreakToolbar };
