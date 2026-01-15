"use client";

import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { FloppyDiskIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  onSave?: () => void;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
}

const SaveButton = ({
  onSave,
  isSaving,
  hasUnsavedChanges,
}: SaveButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "relative size-8",
        hasUnsavedChanges &&
          "after:absolute after:top-1 after:right-1 after:inline-block after:size-2 after:rounded-full after:bg-yellow-500",
      )}
      onClick={onSave}
      disabled={!onSave || isSaving}
    >
      <HugeiconsIcon icon={FloppyDiskIcon} size={18} strokeWidth={2} />
    </Button>
  );
};

export { SaveButton };
