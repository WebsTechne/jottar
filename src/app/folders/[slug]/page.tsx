import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  getFolderWithNotes,
  getFoldersForDropdown,
} from "@/lib/fetch/get-folders";
import FolderPageClient from "./page.client";
import { FloatingButton } from "@/components/floating-button";
import Link from "next/link";

interface FolderPageProps {
  params: {
    slug: string;
  };
}

export default async function FolderPage({ params }: FolderPageProps) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session)
    return (
      <p className="p-4 font-mono">
        You need to be signed in to view this page.{" "}
        <a href="/auth/sign-in" className="underline">
          Sign in
        </a>{" "}
      </p>
    );

  const [folder, folders] = await Promise.all([
    getFolderWithNotes({ folderSlug: slug }),
    getFoldersForDropdown(),
  ]);

  if (!folder)
    return (
      <p className="p-4 font-mono">
        This folder was not found.{" "}
        <Link href="/folders" className="underline">
          All folders.
        </Link>
      </p>
    );

  return (
    <>
      <FolderPageClient folder={folder} session={session} folders={folders} />

      <FloatingButton folderSlug={folder.slug} />
    </>
  );
}
