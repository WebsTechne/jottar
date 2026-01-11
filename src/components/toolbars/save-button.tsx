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
      variant="outline"
      size="sm"
      onClick={onSave}
      disabled={!onSave || isSaving}
      className="not-sm:aspect-square! not-sm:p-0! not-sm:px-0! not-sm:py-0!"
    >
      <HugeiconsIcon icon={FloppyDiskIcon} size={16} strokeWidth={2} />{" "}
      <span className="hidden sm:inline">
        {isSaving ? "Saving..." : "Save"}
      </span>
    </Button>
  );
};

export { SaveButton };
