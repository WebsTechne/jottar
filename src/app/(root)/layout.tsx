import Link from "next/link";
import { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { FloatingButton } from "@/components/floating-button";
import { Header } from "@/components/header";
import { OverlayProvider } from "@/context/overlay-context";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/welcome");
  }

  return (
    <OverlayProvider>
      <Header className="mx-auto w-full max-w-300" session={session} />

      <main className="mx-auto w-full max-w-300">{children}</main>

      <FloatingButton />

      <footer className="text-muted-foreground mx-auto w-full max-w-300 p-4 text-sm">
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
    </OverlayProvider>
  );
}
