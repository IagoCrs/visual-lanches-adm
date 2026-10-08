/**
 * Função central de API do painel (task VS-03).
 *
 * Toda tela busca e envia dados SÓ por aqui. A variável NEXT_PUBLIC_API_MODE
 * decide de onde os dados vêm:
 *   - "mock":     dados de exemplo de src/data, com ~1 s de espera
 *   - "database": o projeto do Supabase configurado no .env.local
 *     (a conexão já existe; as consultas entram no FUT-02, depois que as
 *     tabelas forem decididas)
 *
 * As telas nunca sabem qual dos dois está ligado.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { mockMenuCounters, mockStoreStatus, mockUser } from '@/data/painelMock';
import { getSupabase } from '@/services/supabase';
import type { ApiResult, MenuCounters, StaffUser, StoreStatus } from '@/types/painel';

type ApiMode = 'mock' | 'database';

const API_MODE: ApiMode = process.env.NEXT_PUBLIC_API_MODE === 'database' ? 'database' : 'mock';
const MOCK_ERROR = process.env.NEXT_PUBLIC_MOCK_ERROR === 'true';
const MOCK_DELAY_MS = 1000;

// Estado do mock em memória: alterações valem enquanto a página estiver aberta.
const memory = {
  store: { ...mockStoreStatus },
  counters: { ...mockMenuCounters },
  user: { ...mockUser },
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Responde como o mock: espera, e devolve erro se NEXT_PUBLIC_MOCK_ERROR=true. */
async function fromMock<T>(getData: () => T, errorMessage: string): Promise<ApiResult<T>> {
  await wait(MOCK_DELAY_MS);
  if (MOCK_ERROR) return { ok: false, error: errorMessage };
  // Cópia para a tela não alterar o "banco" sem querer
  return { ok: true, data: structuredClone(getData()) };
}

/**
 * Modo database: roda a consulta no Supabase.
 * Enquanto uma função não tiver consulta (sem `query`), ela avisa que ainda
 * não foi ligada ao banco. As consultas entram no FUT-02.
 */
async function fromDatabase<T>(
  errorMessage: string,
  query?: (db: SupabaseClient) => Promise<ApiResult<T>>
): Promise<ApiResult<T>> {
  const db = getSupabase();
  if (!db) return { ok: false, error: 'Banco ainda não configurado.' };
  if (!query) return { ok: false, error: 'Esta parte ainda não foi ligada ao banco.' };
  try {
    return await query(db);
  } catch {
    return { ok: false, error: errorMessage };
  }
}

// ---------------------------------------------------------------------------
// Loja
// ---------------------------------------------------------------------------

export function getStoreStatus(): Promise<ApiResult<StoreStatus>> {
  const error = 'Não foi possível carregar o status da loja.';
  if (API_MODE === 'mock') return fromMock(() => memory.store, error);
  // FUT-02: ler o status na tabela da loja
  return fromDatabase<StoreStatus>(error);
}

/** Abre ou pausa o recebimento de pedidos no site e no iFood. */
export function setStoreOpen(isOpen: boolean): Promise<ApiResult<StoreStatus>> {
  const error = isOpen ? 'Não foi possível abrir a loja.' : 'Não foi possível pausar a loja.';
  if (API_MODE === 'mock') {
    return fromMock(() => {
      memory.store.isOpen = isOpen;
      return memory.store;
    }, error);
  }
  // FUT-02: gravar aberta/pausada na tabela da loja
  return fromDatabase<StoreStatus>(error);
}

// ---------------------------------------------------------------------------
// Menu do painel
// ---------------------------------------------------------------------------

export function getMenuCounters(): Promise<ApiResult<MenuCounters>> {
  const error = 'Não foi possível carregar os contadores.';
  if (API_MODE === 'mock') return fromMock(() => memory.counters, error);
  // FUT-02: contar pedidos novos e agendados de hoje
  return fromDatabase<MenuCounters>(error);
}

// ---------------------------------------------------------------------------
// Usuário
// ---------------------------------------------------------------------------

export function getCurrentUser(): Promise<ApiResult<StaffUser>> {
  const error = 'Não foi possível carregar o usuário.';
  if (API_MODE === 'mock') return fromMock(() => memory.user, error);
  // FUT-03: usuário logado (Supabase Auth)
  return fromDatabase<StaffUser>(error);
}
