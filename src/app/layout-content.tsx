import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";

export default function LayoutContent({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
