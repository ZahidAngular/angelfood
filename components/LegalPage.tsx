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
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div
            className="rounded-[2rem] border border-line bg-paper p-8 leading-relaxed text-ink-soft shadow-[0_1px_2px_rgba(0,0,0,0.03),0_12px_32px_-16px_rgba(0,0,0,0.08)] sm:p-12
            [&>*+*]:mt-5
            [&_a]:font-semibold [&_a]:text-green [&_a]:underline [&_a]:decoration-green/30 [&_a]:underline-offset-2 [&_a]:transition-colors [&_a]:hover:text-ink
            [&_h2]:mb-3 [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-ink
            [&_h2:first-child]:mt-0
            [&_ul]:list-none [&_ul]:space-y-2.5 [&_ul]:pl-0
            [&_li]:relative [&_li]:pl-6
            [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.6em] [&_li]:before:h-1.5 [&_li]:before:w-1.5 [&_li]:before:rounded-full [&_li]:before:bg-gold
            [&_strong]:font-semibold [&_strong]:text-ink
            [&_p:has(>strong:only-child)]:rounded-2xl [&_p:has(>strong:only-child)]:border [&_p:has(>strong:only-child)]:border-green/15 [&_p:has(>strong:only-child)]:bg-green/[0.05] [&_p:has(>strong:only-child)]:px-5 [&_p:has(>strong:only-child)]:py-4"
          >
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
