import { OverlayProvider } from "@/context/overlay-context";
import { ReactNode } from "react";

export default function FolderPagesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <OverlayProvider>{children}</OverlayProvider>;
}
