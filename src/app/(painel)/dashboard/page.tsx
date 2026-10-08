import type { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/ComingSoon';
import { PageHeader } from '@/components/layout/PageHeader';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="Faturamento e movimento da loja" />
      <ComingSoon task="ADM-07 · ADM-08">
        Aqui vão ficar os números de faturamento, pedidos e ticket médio, com os gráficos do site e
        do iFood.
      </ComingSoon>
    </>
  );
}
