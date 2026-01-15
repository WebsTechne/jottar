import { QuillWrite01FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function Loading() {
  return (
    <div className="flex-center">
      <HugeiconsIcon
        icon={QuillWrite01FreeIcons}
        size={60}
        color="currentColor"
        strokeWidth={3}
      />
    </div>
  );
}
