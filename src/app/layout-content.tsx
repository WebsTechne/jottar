import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export default function LayoutContent({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            toast: "rounded-4xl! corner-squircle relative",
            actionButton: "rounded-lg!",
            closeButton:
              "absolute right-0! top-0! size-6! rounded-full text-gray-500",
          },
          closeButton: true,
          duration: 2000,
        }}
      />
    </ThemeProvider>
  );
}
