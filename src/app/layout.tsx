import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/nunito';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
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
  themeColor: '#0b0b0a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
