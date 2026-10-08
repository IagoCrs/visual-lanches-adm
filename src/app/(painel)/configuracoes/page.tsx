import type { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/ComingSoon';
import { PageHeader } from '@/components/layout/PageHeader';

export const metadata: Metadata = { title: 'Configurações' };

export default function ConfiguracoesPage() {
  return (
    <>
      <PageHeader title="Configurações" description="Regras da loja e usuários" />
      <ComingSoon task="ADM-11">
        Aqui vão ficar o horário de funcionamento, taxas de entrega, regras de agendamento e os
        usuários do painel.
      </ComingSoon>
    </>
  );
}
