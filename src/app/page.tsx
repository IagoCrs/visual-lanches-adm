import { redirect } from 'next/navigation';

/** A entrada do painel é a tela de login. */
export default function Home() {
  redirect('/login');
}
