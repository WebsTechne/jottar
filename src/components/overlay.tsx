"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export default function Overlay({
  open,
  className,
}: {
  open: boolean;
  className?: string;
}) {
  const [mounted, setMounted] = useState(open); // controls actual DOM presence
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }

    // if we're closing, wait for animationend on the overlay element before unmounting
    if (!open && mounted && ref.current) {
      const el = ref.current;
      const onAnimEnd = (e: AnimationEvent) => {
        if (e.target === el) setMounted(false);
      };
      el.addEventListener("animationend", onAnimEnd as EventListener);
      return () =>
        el.removeEventListener("animationend", onAnimEnd as EventListener);
    }
  }, [open, mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={ref}
      data-state={open ? "open" : "closed"}
      className={cn("overlay", className)}
    />
  );
}
