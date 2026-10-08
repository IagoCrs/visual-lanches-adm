import { CalendarClock, ChartColumn, ReceiptText, Settings, UtensilsCrossed } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { MenuCounters } from '@/types/painel';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Qual contador aparece ao lado do item */
  counter?: keyof MenuCounters;
  /** Texto lido pelo leitor de tela junto do número, ex.: "3 novos" */
  counterLabel?: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    title: 'Operação',
    items: [
      {
        href: '/pedidos',
        label: 'Pedidos',
        icon: ReceiptText,
        counter: 'newOrders',
        counterLabel: 'novos',
      },
      {
        href: '/agendados',
        label: 'Agendados',
        icon: CalendarClock,
        counter: 'scheduledToday',
        counterLabel: 'hoje',
      },
    ],
  },
  {
    title: 'Gestão',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: ChartColumn },
      { href: '/cardapio', label: 'Cardápio e iFood', icon: UtensilsCrossed },
      { href: '/configuracoes', label: 'Configurações', icon: Settings },
    ],
  },
];

/** Item ativo: a rota atual ou qualquer subpágina dela (ex.: /pedidos/123). */
export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
