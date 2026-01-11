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
import { TrapezoidLineHorizontalIcon } from "@hugeicons/core-free-icons";

type HorizontalRuleToolbarProps = {
  editor: Editor | null;
} & React.ComponentPropsWithoutRef<typeof Button>;

const HorizontalRuleToolbar = React.forwardRef<
  React.ElementRef<typeof Button>,
  HorizontalRuleToolbarProps
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
              editor?.chain().focus().setHorizontalRule().run();
              onClick?.(e);
            }}
            ref={ref}
            {...props}
          />
        }
      >
        {children || (
          <HugeiconsIcon
            icon={TrapezoidLineHorizontalIcon}
            size={16}
            strokeWidth={2}
          />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <span>Horizontal Rule</span>
      </TooltipContent>
    </Tooltip>
  );
});

HorizontalRuleToolbar.displayName = "HorizontalRuleToolbar";

export { HorizontalRuleToolbar };
