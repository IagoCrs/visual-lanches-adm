import { Construction } from 'lucide-react';
import { Card } from '@/components/ui/Card';

/** Espaço reservado para uma tela que ainda vai ser feita em outra task. */
export function ComingSoon({ task, children }: { task: string; children: string }) {
  return (
    <Card className="flex flex-col items-start gap-3">
      <span className="flex size-12 items-center justify-center rounded-full bg-amber-50 text-amber-500">
        <Construction aria-hidden="true" className="size-6" strokeWidth={2.2} />
      </span>
      <p className="text-lg font-semibold">Tela em construção</p>
      <p className="max-w-prose text-[15px] text-gray-600">{children}</p>
      <span className="rounded-full bg-brand-black px-3 py-1 text-xs font-bold text-white">
        {task}
      </span>
    </Card>
  );
}
