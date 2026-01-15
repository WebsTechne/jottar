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
import { LeftToRightListNumberIcon } from "@hugeicons/core-free-icons";

type OrderedListToolbarProps = {
  editor: Editor | null;
} & React.ComponentPropsWithoutRef<typeof Button>;

const OrderedListToolbar = React.forwardRef<
  React.ElementRef<typeof Button>,
  OrderedListToolbarProps
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
              editor?.isActive("orderedList") && "bg-accent! active",
              className,
            )}
            onClick={(e) => {
              editor?.chain().focus().toggleOrderedList().run();
              onClick?.(e);
            }}
            disabled={!editor?.can().chain().focus().toggleOrderedList().run()}
            ref={ref}
            {...props}
          />
        }
      >
        {children || (
          <HugeiconsIcon
            icon={LeftToRightListNumberIcon}
            size={16}
            strokeWidth={2}
          />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <span>Ordered list</span>
      </TooltipContent>
    </Tooltip>
  );
});

OrderedListToolbar.displayName = "OrderedListToolbar";

export { OrderedListToolbar };
