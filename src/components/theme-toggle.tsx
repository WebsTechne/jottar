"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { MoonIcon, Sun03Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

const ThemeToggle = ({
  className,
  variant = "ghost",
  size = "icon",
}: {
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "icon" | "sm" | "lg" | "default";
}) => {
  const { resolvedTheme: theme, setTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      type="button"
      className={cn("transition-none", className)}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <span className="group">
          <HugeiconsIcon
            icon={Sun03Icon}
            size={24}
            strokeWidth={2}
            className="size-6!"
          />
        </span>
      ) : (
        <span className="group">
          <HugeiconsIcon
            icon={MoonIcon}
            size={24}
            strokeWidth={2}
            className="size-6!"
          />
        </span>
      )}
    </Button>
  );
};

export { ThemeToggle };
