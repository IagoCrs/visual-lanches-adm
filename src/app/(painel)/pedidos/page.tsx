import type { Metadata } from 'next';
import { QuadroPedidos } from '@/components/pedidos/QuadroPedidos';

export const metadata: Metadata = { title: 'Pedidos' };

export default function PedidosPage() {
  return <QuadroPedidos />;
}
