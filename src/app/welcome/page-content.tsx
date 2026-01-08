"use client";

import ScrollTest from "@/components/scroll-test";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ReactLenis } from "lenis/react";

export default function PageContent() {
  const ball1 = useRef<HTMLSpanElement>(null);
  const ball2 = useRef<HTMLSpanElement>(null);
  const container = useRef<HTMLElement>(null);

  // useGSAP is the modern way to use GSAP in React, it handles cleanup automatically.
  useGSAP(
    () => {
      // --- Start of Tweakable Values ---

      // MOVEMENT_STRENGTH: Higher value means a larger range of movement.
      // A value of 100 means the ball can move 50px in either direction from its center.
      const MOVEMENT_STRENGTH_1 = 80;
      const MOVEMENT_STRENGTH_2 = 120;

      // DURATION: Higher value makes the movement smoother and more "laggy" or "loose".
      // Lower value makes it more responsive and direct.
      const DURATION = 0.8;

      // EASE: The easing function for the animation.
      // "power2.out" is a good starting point. You can find more at https://gsap.com/docs/v3/Eases/
      const EASE = "power2.out";

      // --- End of Tweakable Values ---

      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        // Use the container's dimensions for more accurate calculations
        const { offsetWidth, offsetHeight } = container.current!;

        // Calculate the movement based on cursor position relative to the center of the container.
        // Renamed to avoid confusion with GSAP's own xPercent/yPercent properties.
        const xOffset = clientX / offsetWidth - 0.5;
        const yOffset = clientY / offsetHeight - 0.5;

        // Animate ball 1
        gsap.to(ball1.current, {
          x: xOffset * MOVEMENT_STRENGTH_1,
          y: yOffset * MOVEMENT_STRENGTH_1,
          xPercent: -50, // This keeps the element centered on its top/left position
          yPercent: -50, // This keeps the element centered on its top/left position
          duration: DURATION,
          ease: EASE,
        });

        // Animate ball 2 with slightly different strength for a parallax effect
        gsap.to(ball2.current, {
          x: xOffset * MOVEMENT_STRENGTH_2,
          y: yOffset * MOVEMENT_STRENGTH_2,
          xPercent: -50, // This keeps the element centered on its top/left position
          yPercent: -50, // This keeps the element centered on its top/left position
          duration: DURATION,
          ease: EASE,
        });
      };

      window.addEventListener("mousemove", handleMouseMove);

      // The return function from useGSAP's effect is used for cleanup.
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    },
    { scope: container },
  ); // scope is important for targeting elements inside the container

  const lenisRef = useRef<any>();

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />

      <section
        ref={container}
        className="flex-center relative min-h-screen w-full max-w-screen overflow-clip"
      >
        <span
          ref={ball1}
          className="bg-foreground/70 absolute top-1/2 left-6/10 z-1 size-125 rounded-full blur-[90px] duration-200"
        ></span>
        <span
          ref={ball2}
          className="bg-chart-2/80 absolute top-14/20 left-83/100 z-1 size-125 rounded-full blur-[90px] duration-200"
        ></span>

        <div className="bg-background/60 flex-center z-10 h-screen w-full bg-[url('/images/noise.png')] bg-blend-overlay">
          <div className="">
            <h1 className="text-6xl font-black tracking-wide uppercase">
              Jot down
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
