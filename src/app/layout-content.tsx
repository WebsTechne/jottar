import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export default function LayoutContent({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{ classNames: { toast: "rounded-4xl! corner-squircle" } }}
      />
    </ThemeProvider>
  );
}
