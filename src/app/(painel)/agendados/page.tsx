import type { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/ComingSoon';
import { PageHeader } from '@/components/layout/PageHeader';

export const metadata: Metadata = { title: 'Agendados' };

export default function AgendadosPage() {
  return (
    <>
      <PageHeader title="Agendados" description="Pedidos marcados para mais tarde" />
      <ComingSoon task="ADM-06">
        Aqui vai ficar a lista de pedidos agendados por dia, com a linha do tempo da noite e o botão
        para mandar à cozinha.
      </ComingSoon>
    </>
  );
}
