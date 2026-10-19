import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/fredoka';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Painel · Visual Lanches',
    template: '%s · Visual Lanches',
  },
  description: 'Painel do restaurante Visual Lanches: pedidos, agendados, cardápio e métricas.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#ffb800',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
