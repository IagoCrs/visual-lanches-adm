import type { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/ComingSoon';
import { PageHeader } from '@/components/layout/PageHeader';

export const metadata: Metadata = { title: 'Pedidos' };

export default function PedidosPage() {
  return (
    <>
      <PageHeader title="Pedidos" description="Pedidos de hoje, do site e do iFood" />
      <ComingSoon task="ADM-03 · ADM-04">
        Aqui vão ficar as colunas Novos, Em preparo e Saiu / pronto, com os botões para aceitar e
        avançar cada pedido.
      </ComingSoon>
    </>
  );
}
