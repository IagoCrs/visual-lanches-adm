import type { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/ComingSoon';
import { PageHeader } from '@/components/layout/PageHeader';

export const metadata: Metadata = { title: 'Cardápio e iFood' };

export default function CardapioPage() {
  return (
    <>
      <PageHeader title="Cardápio e iFood" description="O que se vende no site e no iFood" />
      <ComingSoon task="ADM-09 · ADM-10">
        Aqui vai ficar a lista de produtos com as chaves de venda no site e no iFood, o esgotar hoje
        e o cadastro de produtos.
      </ComingSoon>
    </>
  );
}
