"use client";
import React, { createContext, useContext, useState } from "react";
import Overlay from "@/components/overlay";

type OverlayContextType = {
  active: string | null;
  open: (owner: string) => void;
  close: () => void;
};

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <OverlayContext.Provider
      value={{ active, open: setActive, close: () => setActive(null) }}
    >
      {children}
      {/* render overlay at the root so it covers everything */}
      <Overlay open={active !== null} />
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("useOverlay must be used inside OverlayProvider");
  return ctx;
}
