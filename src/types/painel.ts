/** Resposta padrão de toda função de API: os dados ou uma mensagem de erro amigável. */
export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

export type StoreStatus = {
  /** true = recebendo pedidos no site e no iFood */
  isOpen: boolean;
  /** Horário de fechamento de hoje, ex.: "23:30" */
  closesAt: string;
};

export type MenuCounters = {
  /** Pedidos esperando aceite */
  newOrders: number;
  /** Pedidos agendados para hoje que ainda não foram para a cozinha */
  scheduledToday: number;
};

export type StaffRole = 'admin' | 'atendente';

export type StaffUser = {
  name: string;
  role: StaffRole;
};
