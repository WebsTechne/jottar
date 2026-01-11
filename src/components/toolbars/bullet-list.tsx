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
import { LeftToRightListBulletIcon } from "@hugeicons/core-free-icons";

type BulletListToolbarProps = {
  editor: Editor | null;
} & React.ComponentPropsWithoutRef<typeof Button>;

const BulletListToolbar = React.forwardRef<
  React.ElementRef<typeof Button>,
  BulletListToolbarProps
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
              editor?.isActive("bulletList") && "bg-accent",
              className,
            )}
            onClick={(e) => {
              editor?.chain().focus().toggleBulletList().run();
              onClick?.(e);
            }}
            disabled={!editor?.can().chain().focus().toggleBulletList().run()}
            ref={ref}
            {...props}
          />
        }
      >
        {children || (
          <HugeiconsIcon
            icon={LeftToRightListBulletIcon}
            size={16}
            strokeWidth={2}
          />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <span>Bullet list</span>
      </TooltipContent>
    </Tooltip>
  );
});

BulletListToolbar.displayName = "BulletListToolbar";

export { BulletListToolbar };
