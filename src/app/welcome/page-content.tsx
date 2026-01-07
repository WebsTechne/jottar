"use client";

import ScrollTest from "@/components/scroll-test";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ReactLenis } from "lenis/react";

export default function PageContent() {
  // useGSAP(() => {}, []);

  const lenisRef = useRef();

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />

      <section className="flex-center relative min-h-screen w-full max-w-screen overflow-clip">
        <span className="bg-foreground/70 absolute top-1/2 left-6/10 z-1 size-125 -translate-1/2 rounded-full blur-2xl"></span>
        <span className="bg-chart-2/80 absolute top-14/20 left-83/100 z-1 size-125 -translate-1/2 rounded-full blur-2xl"></span>

        <div className="bg-background/60 flex-center z-10 h-screen w-full bg-[url('/images/noise.png')] bg-blend-overlay backdrop-blur-3xl">
          <div className="">
            <h1 className="text-5xl font-black tracking-wide uppercase">
              Welcome to Jottar
            </h1>
            <p className="text-lg">
              Start jotting down your thoughts and ideas.
            </p>
          </div>
        </div>
      </section>

      <ScrollTest />
    </>
  );
}
