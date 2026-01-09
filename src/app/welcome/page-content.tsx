"use client";

import ScrollTest from "@/components/scroll-test";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ReactLenis } from "lenis/react";
import BackgroundBalls from "@/components/background-balls";
import { SplitText } from "gsap/all";

gsap.registerPlugin(SplitText);

export default function PageContent() {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  const main = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const words = ["stories", "ideas", "thoughts", "dreams", "plans"];
      let currentIndex = 0;
      const wordElement = document.getElementById("words");
      if (!wordElement) return;

      const cycleWords = () => {
        const currentSplit = new SplitText(wordElement, { type: "chars" });

        gsap.to(currentSplit.chars, {
          yPercent: -100,
          stagger: 0.02,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            currentSplit.revert();

            currentIndex = (currentIndex + 1) % words.length;
            wordElement.textContent = words[currentIndex];

            const newSplit = new SplitText(wordElement, { type: "chars" });
            gsap.from(newSplit.chars, {
              yPercent: 100,
              stagger: 0.02,
              duration: 0.3,
              ease: "power2.out",
              onComplete: () => {
                newSplit.revert();
                gsap.delayedCall(1.5, cycleWords);
              },
            });
          },
        });
      };

      wordElement.textContent = words[currentIndex];
      const initialSplit = new SplitText(wordElement, { type: "chars" });
      gsap.from(initialSplit.chars, {
        yPercent: 100,
        stagger: 0.02,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          initialSplit.revert();
          gsap.delayedCall(1.5, cycleWords);
        },
      });
    },
    { scope: main },
  );

  return (
    <>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />

      <section
        ref={main}
        className="flex-center relative min-h-screen w-full max-w-screen overflow-clip"
      >
        <BackgroundBalls />

        <div className="bg-background/60 flex-center z-10 h-screen w-full bg-[url('/images/noise.png')] px-4 bg-blend-overlay">
          <div className="w-full md:max-w-160">
            <h1 className="w-max text-2xl leading-none font-black tracking-tight uppercase transition-[width] duration-300 sm:text-3xl md:text-6xl">
              Jot down{" "}
              <span
                id="words"
                className="inline-block overflow-y-clip text-2xl leading-none font-black tracking-tight uppercase sm:text-3xl md:h-15.5 md:text-6xl"
              ></span>
            </h1>
            <p className="text-sm sm:text-lg">
              Start jotting down your thoughts and ideas.
            </p>
          </div>
        </div>
      </section>

      <ScrollTest />
    </>
  );
}
