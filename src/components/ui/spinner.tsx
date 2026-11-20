import { cn } from "cn";
import { HugeiconsIcon } from "@hugeicons/react";
import { LoaderCircleIcon, Loading03Icon } from "@hugeicons/core-free-icons";
import { ComponentProps } from "react";

type SpinnerProps = Omit<
  ComponentProps<"svg">,
  "strokeWidth"
  >;

function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <HugeiconsIcon
      icon={LoaderCircleIcon}
      strokeWidth={2}
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
