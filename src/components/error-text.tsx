import type { ReactNode } from "react";

export function ErrorText({ children }: { children: ReactNode }) {
  return (
    <p className="corner-squircle w-full rounded-4xl border border-red-500/50 bg-red-400/50 p-2 text-[15px] text-red-500 dark:bg-red-500/25!">
      {children}
    </p>
  );
}
