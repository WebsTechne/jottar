"use client";

import React from "react";

import { Button, ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToolbar } from "@/components/toolbars/toolbar-provider";
import { HugeiconsIcon } from "@hugeicons/react";
import { LeftToRightBlockQuoteIcon } from "@hugeicons/core-free-icons";

const BlockquoteToolbar = React.forwardRef<
  React.ElementRef<typeof Button>,
  ButtonProps
>(({ className, onClick, children, ...props }, ref) => {
  const { editor } = useToolbar();
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              editor?.isActive("blockquote") && "bg-accent",
              className,
            )}
            onClick={(e) => {
              editor?.chain().focus().toggleBlockquote().run();
              onClick?.(e);
            }}
            disabled={!editor?.can().chain().focus().toggleBlockquote().run()}
            ref={ref}
            {...props}
          />
        }
      >
        {children || (
          <HugeiconsIcon icon={LeftToRightBlockQuoteIcon} size={16} strokeWidth={2} />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <span>Blockquote</span>
      </TooltipContent>
    </Tooltip>
  );
});

BlockquoteToolbar.displayName = "BlockquoteToolbar";

export { BlockquoteToolbar };
