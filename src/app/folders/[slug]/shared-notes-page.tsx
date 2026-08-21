import { ServerSession } from "@/app/layout";
import { FolderHeader } from "../folder-header";
import { getFoldersForDropdown, getSharedNotes } from "@/lib/fetch/get-folders";
import { NoteCard } from "@/components/notes/note-card";

export default async function SharedNotesPage({
  session,
}: {
  session: ServerSession;
}) {
  const sharedNotes = await getSharedNotes();
  const folders = await getFoldersForDropdown();

  return (
    <main className="mx-auto w-full max-w-400">
      <FolderHeader session={session} back={true}></FolderHeader>

      <section className="section">
        <div className="flex items-center justify-between gap-1">
          <h1 className="heading">Shared Notes</h1>
        </div>
        <p className="description">
          The notes you&apos;ve made available to others will be displayed here.
          This is a virtual folder, the notes displayed here do not belong to an
          actual folder called &#34;Shared Notes&#34; and can be put in any
          actual folder that you created.
        </p>

        {sharedNotes === null || sharedNotes.length < 1 ? (
          <section></section>
        ) : (
          <section className="wrap">
            {sharedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                view="folder"
                folders={folders}
              />
            ))}
          </section>
        )}
      </section>
    </main>
  );
}
