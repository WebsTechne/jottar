"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function BackgroundBalls() {
  const ball1 = useRef<HTMLSpanElement>(null);
  const ball2 = useRef<HTMLSpanElement>(null);

  // useGSAP is the modern way to use GSAP in React, it handles cleanup automatically.
  useGSAP(() => {
    // --- Tweakable Values ---
    x;
    // // MOVEMENT_STRENGTH: Higher value means a larger range of movement.
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

      // Use window dimensions for calculations, making the component self-contained
      const xOffset = clientX / window.innerWidth - 0.5;
      const yOffset = clientY / window.innerHeight - 0.5;

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

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }); // No scope needed as we use refs directly

  return (
    <>
      <span
        ref={ball1}
        className="bg-foreground/90 dark:bg-foreground/70 absolute top-1/2 left-6/10 z-1 size-80 rounded-full blur-[90px] duration-200 md:size-125"
      ></span>
      <span
        ref={ball2}
        className="bg-chart-2/80 absolute top-14/20 left-83/100 z-1 size-80 rounded-full blur-[90px] duration-200 md:size-125"
      ></span>
    </>
  );
}
