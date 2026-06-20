import type { ReactNode } from "react";

export function ErrorText({ children }: { children: ReactNode }) {
  return (
    <p className="supports-[corner-shape:squircle]:squircle-card w-full rounded-2xl border border-red-500/50 bg-red-300/50 p-2 text-[15px] font-semibold text-red-500 dark:bg-red-500/25!">
      {children}
    </p>
  );
}
