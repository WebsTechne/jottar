"use client";

import ScrollTest from "@/components/scroll-test";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ReactLenis } from "lenis/react";
import BackgroundBalls from "@/components/background-balls";
import { SplitText } from "gsap/all";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { QuillWrite01Icon } from "@hugeicons/core-free-icons";

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
      <section className="fixed top-0 right-0 left-0 z-1000 flex h-12 items-center gap-0.5 px-4 text-lg font-semibold">
        <HugeiconsIcon
          icon={QuillWrite01Icon}
          strokeWidth={2}
          className="size-6!"
        />
        Jottar
      </section>

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
            Jot things down as they come. Jottar keeps your thoughts organized, searchable, and easy to return to.
            </p>
            <div className="mt-5">
              <Link
                className={buttonVariants({ variant: "default", size: "lg" })}
                href={`/auth/sign-in?returnTo=${encodeURIComponent("/")}`}
              >
                <HugeiconsIcon
                  icon={QuillWrite01Icon}
                  size={24}
                  strokeWidth={2}
                  className="size-6!"
                />
                Start jotting
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/*<ScrollTest />*/}

      <footer className="text-muted-foreground p-4 text-sm">
        <ul>
          <li>
            <Link
              href="/legal/privacy"
              className="hover:text-foreground transition-200 hover:font-bold"
            >
              Privacy
            </Link>
          </li>
          <li>
            <Link
              href="/legal/terms"
              className="hover:text-foreground transition-200 hover:font-bold"
            >
              Terms and Conditions
            </Link>
          </li>
        </ul>
      </footer>
    </>
  );
}
