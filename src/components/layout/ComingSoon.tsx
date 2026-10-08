import { Construction } from 'lucide-react';

/** Espaço reservado para uma tela que ainda vai ser feita em outra task. */
export function ComingSoon({ task, children }: { task: string; children: string }) {
  return (
    <section className="flex flex-col items-start gap-3 rounded-[var(--radius-card)] border-2 border-dashed border-line bg-surface/60 p-6 md:p-8">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-yellow-soft">
        <Construction aria-hidden="true" className="size-6" strokeWidth={2.2} />
      </span>
      <p className="text-lg font-black">Tela em construção</p>
      <p className="max-w-prose text-[15px] font-semibold text-ink-muted">{children}</p>
      <span className="rounded-full bg-brand-black px-3 py-1 text-xs font-black text-brand-yellow">
        {task}
      </span>
    </section>
  );
}
