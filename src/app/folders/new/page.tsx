import { auth } from "@/lib/auth";
import { NewFolderClient } from "./page.client";
import { headers } from "next/headers";

export default async function NewFolderPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id ?? "";

  return (
    <>
      {/*<section className="section">
        <h1 className="heading">New folder</h1>
      </section>*/}

      <NewFolderClient userId={userId} />
    </>
  );
}
