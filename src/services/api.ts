/**
 * Função central de API do painel (task VS-03).
 *
 * Toda tela busca e envia dados SÓ por aqui. A variável NEXT_PUBLIC_API_MODE
 * decide de onde os dados vêm:
 *   - "mock":     dados de exemplo com simulação de delay (~1s)
 *   - "database": o projeto do Supabase configurado no .env.local
 *
 * As telas nunca sabem qual dos dois está ligado.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  mockCategorias as initialCategorias,
  mockProdutos as initialProdutos,
  mockPedidosPainel as initialPedidos,
  mockLojaStatus as initialLojaStatus,
  mockAgendados as initialAgendados,
  mockDashboard,
} from '@/data/mockData';
import { mockMenuCounters, mockStoreStatus, mockUser } from '@/data/painelMock';
import { getSupabase } from '@/services/supabase';
import type { ApiResult, MenuCounters, StaffUser, StoreStatus } from '@/types/painel';
import type { ApiResponse } from '@/types/cliente';

type ApiMode = 'mock' | 'database';

const API_MODE: ApiMode = process.env.NEXT_PUBLIC_API_MODE === 'database' ? 'database' : 'mock';
const MOCK_ERROR = process.env.NEXT_PUBLIC_MOCK_ERROR === 'true';
const MOCK_DELAY_MS = 1000;

// Estrutura de dados em memória para o mock
let mockProdutos = [...initialProdutos];
let mockCategorias = [...initialCategorias];
let mockPedidos: any[] = [...initialPedidos];
let mockAgendados = [...initialAgendados];
let mockLojaStatus = { ...initialLojaStatus };

// Estado do mock em memória específico do painel legado
const memory = {
  store: { ...mockStoreStatus },
  counters: { ...mockMenuCounters },
  user: { ...mockUser },
};

const wait = (ms: number = MOCK_DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper de resposta padrão (ApiResponse)
function successResponse<T>(data: T): ApiResponse<T> {
  return { success: true, data, error: null };
}

function errorResponse<T>(message: string): ApiResponse<T> {
  return { success: false, data: null, error: message };
}

interface Handlers<T> {
  mock: () => T | Promise<T>;
  database?: (db: SupabaseClient) => Promise<T>;
}

/**
 * Resolver central unificado (VS-03)
 */
async function resolver<T>(operacao: string, handlers: Handlers<T>): Promise<ApiResponse<T>> {
  try {
    if (API_MODE === 'database') {
      const db = getSupabase();
      if (!db) {
        return errorResponse('Banco ainda não configurado');
      }
      if (!handlers.database) {
        return errorResponse(`Banco ainda não configurado para ${operacao}`);
      }
      return successResponse(await handlers.database(db));
    }

    // Modo MOCK
    await wait();

    if (MOCK_ERROR) {
      return errorResponse(`Erro simulado ao ${operacao}.`);
    }

    return successResponse(await handlers.mock());
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Erro inesperado.');
  }
}

/** Responde como o mock: espera, e devolve erro se NEXT_PUBLIC_MOCK_ERROR=true (ApiResult) */
async function fromMock<T>(getData: () => T, errorMessage: string): Promise<ApiResult<T>> {
  await wait();
  if (MOCK_ERROR) return { ok: false, error: errorMessage };
  return { ok: true, data: structuredClone(getData()) };
}

/** Modo database: roda a consulta no Supabase (ApiResult) */
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
// Funções do Painel (Compatibilidade com PainelShell / Context)
// ---------------------------------------------------------------------------

export function getStoreStatus(): Promise<ApiResult<StoreStatus>> {
  const error = 'Não foi possível carregar o status da loja.';
  if (API_MODE === 'mock') return fromMock(() => memory.store, error);
  return fromDatabase<StoreStatus>(error);
}

export function setStoreOpen(isOpen: boolean): Promise<ApiResult<StoreStatus>> {
  const error = isOpen ? 'Não foi possível abrir a loja.' : 'Não foi possível pausar a loja.';
  if (API_MODE === 'mock') {
    return fromMock(() => {
      memory.store.isOpen = isOpen;
      return memory.store;
    }, error);
  }
  return fromDatabase<StoreStatus>(error);
}

export function getMenuCounters(): Promise<ApiResult<MenuCounters>> {
  const error = 'Não foi possível carregar os contadores.';
  if (API_MODE === 'mock') return fromMock(() => memory.counters, error);
  return fromDatabase<MenuCounters>(error);
}

export function getCurrentUser(): Promise<ApiResult<StaffUser>> {
  const error = 'Não foi possível carregar o usuário.';
  if (API_MODE === 'mock') return fromMock(() => memory.user, error);
  return fromDatabase<StaffUser>(error);
}

// ---------------------------------------------------------------------------
// API Unificada do Sistema (Objeto api consumido pelas telas)
// ---------------------------------------------------------------------------

export const api = {
  // Buscar Categorias
  async buscarCategorias(): Promise<ApiResponse<any[]>> {
    return resolver('Carregar Categorias', {
      mock: () => mockCategorias,
    });
  },

  // Buscar Produtos
  async buscarProdutos(): Promise<ApiResponse<any[]>> {
    return resolver('Carregar Produtos', {
      mock: () => mockProdutos,
    });
  },

  // Atualizar Produto
  async atualizarProduto(id: string, novosDados: any): Promise<ApiResponse<any>> {
    return resolver('Atualizar Produto', {
      mock: () => {
        mockProdutos = mockProdutos.map((item) =>
          item.id === id ? { ...item, ...novosDados } : item
        );
        return { id, ...novosDados };
      },
    });
  },

  // Buscar Status da Loja
  async buscarStatusLoja(): Promise<ApiResponse<any>> {
    return resolver('Buscar Status da Loja', {
      mock: () => mockLojaStatus,
    });
  },

  // Criar Pedido
  async criarPedido(dadosPedido: any): Promise<ApiResponse<any>> {
    return resolver('Criar Pedido', {
      mock: () => {
        const novoPedido = {
          id: String(Date.now()),
          criadoEm: new Date().toISOString(),
          status: 'pendente',
          ...dadosPedido,
        };
        mockPedidos.unshift(novoPedido);
        return novoPedido;
      },
    });
  },

  // Buscar Pedido
  async buscarPedido(id: string): Promise<ApiResponse<any>> {
    return resolver('Buscar Pedido', {
      mock: () => {
        const pedido = mockPedidos.find((item) => item.id === id);
        if (!pedido) {
          throw new Error('Pedido não encontrado.');
        }
        return pedido;
      },
    });
  },

  // Buscar Pedidos do Painel
  async buscarPedidosPainel(): Promise<ApiResponse<any[]>> {
    return resolver('Buscar Pedidos do Painel', {
      mock: () => mockPedidos,
    });
  },

  // Mudar Status do Pedido
  async mudarStatusPedido(id: string, novoStatus: string): Promise<ApiResponse<any>> {
    return resolver('Mudar Status do Pedido', {
      mock: () => {
        let pedidoAtualizado = null;
        mockPedidos = mockPedidos.map((pedido) => {
          if (pedido.id === id) {
            pedidoAtualizado = { ...pedido, status: novoStatus };
            return pedidoAtualizado;
          }
          return pedido;
        });

        if (!pedidoAtualizado) {
          throw new Error('Pedido não encontrado.');
        }
        return pedidoAtualizado;
      },
    });
  },

  // Buscar Agendados
  async buscarAgendados(): Promise<ApiResponse<any[]>> {
    return resolver('Buscar Agendados', {
      mock: () => mockAgendados,
    });
  },

  // Buscar Dados do Dashboard
  async buscarDadosDashboard(): Promise<ApiResponse<any>> {
    return resolver('Buscar Dados do Dashboard', {
      mock: () => mockDashboard,
    });
  },
};