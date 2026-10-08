import type { ReactNode } from 'react';

/** Título e descrição no topo de cada tela do painel. */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="font-display text-4xl leading-none font-extrabold uppercase md:text-[42px]">
          {title}
        </h1>
        {description && <p className="text-sm font-bold text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="ml-auto flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
