export default function ScrollTest() {
  const sections = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-4xl space-y-24 px-6 py-16">
        {sections.map((num) => (
          <section
            key={num}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 shadow-lg"
          >
            <h2 className="mb-4 text-2xl font-semibold">Section {num}</h2>

            <p className="mb-4 leading-relaxed text-neutral-300">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi,
              necessitatibus, eligendi voluptatem tempora possimus facere
              adipisci reprehenderit magni accusantium.
            </p>

            <p className="mb-4 leading-relaxed text-neutral-400">
              Doloremque inventore hic, rerum nihil dignissimos porro voluptates
              laborum quaerat officia recusandae, maxime aspernatur fugiat at.
              Nulla, vero?
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="h-32 rounded-xl bg-neutral-800" />
              <div className="h-48 rounded-xl bg-neutral-800" />
              <div className="h-40 rounded-xl bg-neutral-800" />
              <div className="h-56 rounded-xl bg-neutral-800" />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
