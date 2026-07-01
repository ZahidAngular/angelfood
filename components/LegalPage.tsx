import { PageHeader } from "@/components/PageHeader";

export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <main>
      <PageHeader eyebrow="Legal" title={title} intro={intro} />
      <section className="bg-cream pb-24 sm:pb-32">
        <div className="mx-auto max-w-3xl space-y-5 px-5 leading-relaxed text-ink-soft sm:px-8 [&_a]:text-accent [&_a]:underline [&_h2]:mb-2 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-ink [&_li]:mt-1.5 [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
          {children}
        </div>
      </section>
    </main>
  );
}
