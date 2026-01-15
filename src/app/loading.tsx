import { QuillWrite01FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function Loading() {
  return (
    <div className="flex-center fixed top-1/2 left-1/2 -translate-1/2">
      <HugeiconsIcon
        icon={QuillWrite01FreeIcons}
        size={60}
        color="currentColor"
        strokeWidth={2}
      />
    </div>
  );
}
