import { redirect } from 'next/navigation';

/** A tela inicial do painel é a de pedidos. */
export default function Home() {
  redirect('/pedidos');
}
