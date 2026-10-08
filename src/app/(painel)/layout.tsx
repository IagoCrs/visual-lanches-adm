import { PainelShell } from '@/components/layout/PainelShell';
import { PainelProvider } from '@/context/PainelContext';

/** Tudo dentro de (painel) usa o menu lateral. A futura tela de login fica fora daqui. */
export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <PainelProvider>
      <PainelShell>{children}</PainelShell>
    </PainelProvider>
  );
}
