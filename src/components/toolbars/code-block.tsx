"use client";

import React from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToolbar } from "@/components/toolbars/toolbar-provider";
import { HugeiconsIcon } from "@hugeicons/react";
import { SourceCodeIcon } from "@hugeicons/core-free-icons";

const CodeBlockToolbar = React.forwardRef<
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
              editor?.isActive("codeBlock") && "bg-accent",
              className,
            )}
            onClick={(e) => {
              editor?.chain().focus().toggleCodeBlock().run();
              onClick?.(e);
            }}
            disabled={!editor?.can().chain().focus().toggleCodeBlock().run()}
            ref={ref}
            {...props}
          />
        }
      >
        {children || <HugeiconsIcon icon={SourceCodeIcon} size={16} strokeWidth={2} />}
      </TooltipTrigger>
      <TooltipContent>
        <span>Code Block</span>
      </TooltipContent>
    </Tooltip>
  );
});

CodeBlockToolbar.displayName = "CodeBlockToolbar";

export { CodeBlockToolbar };
