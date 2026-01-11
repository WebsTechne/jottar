"use client";

import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { FloppyDiskIcon } from "@hugeicons/core-free-icons";

interface SaveButtonProps {
  onSave?: () => void;
  isSaving?: boolean;
}

const SaveButton = ({ onSave, isSaving }: SaveButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={onSave}
      disabled={!onSave || isSaving}
    >
      <HugeiconsIcon
        icon={FloppyDiskIcon}
        size={24}
        strokeWidth={2}
        className="size-6!"
      />
    </Button>
  );
};

export { SaveButton };
