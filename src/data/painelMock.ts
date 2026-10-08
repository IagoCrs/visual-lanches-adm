import type { MenuCounters, StaffUser, StoreStatus } from '@/types/painel';

/** Dados de exemplo usados quando NEXT_PUBLIC_API_MODE=mock. */

export const mockStoreStatus: StoreStatus = {
  isOpen: true,
  closesAt: '23:30',
};

export const mockMenuCounters: MenuCounters = {
  newOrders: 3,
  scheduledToday: 5,
};

export const mockUser: StaffUser = {
  name: 'Gabriel',
  role: 'admin',
};
