/**
 * Função central de API do painel (task VS-03).
 *
 * Toda tela busca e envia dados SÓ pelo objeto `api` deste arquivo.
 * Cada função descreve o que fazer em cada fonte de dados (os "handlers"),
 * e o `resolver` escolhe qual usar pela flag NEXT_PUBLIC_API_MODE:
 *   - "mock":     dados de src/data/mockData.ts, com ~1 s de espera
 *   - "database": o projeto do Supabase configurado no .env.local
 *
 * As telas nunca sabem qual dos dois está ligado.
 * Mesmo padrão do src/services/api.ts do app do cliente.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { ENV } from '@/config/env';
import {
  mockAgendados,
  mockCategorias,
  mockDashboard,
  mockLojaStatus,
  mockPedidosPainel,
  mockProdutos,
  mockUsuarioPainel,
} from '@/data/mockData';
import { getSupabase } from '@/services/supabase';
import type { Categoria, LojaStatus, Produto } from '@/types/cardapio';
import type { ApiResponse } from '@/types/cliente';
import type { ContadoresMenu, CredenciaisLogin, UsuarioPainel } from '@/types/painel';
import type { DashboardMetrics, Pedido, StatusPedido } from '@/types/pedido';

const MOCK_DELAY_MS = 1000;
const FUSO_LOJA = 'America/Sao_Paulo';

// ---------------------------------------------------------------------------
// Resolver: escolhe entre mock e banco
// ---------------------------------------------------------------------------

interface Handlers<T> {
  /** O que fazer no modo mock (dados em memória) */
  mock: () => T | Promise<T>;
  /** O que fazer no modo database. Enquanto não existir, a função avisa que falta ligar. */
  database?: (db: SupabaseClient) => Promise<T>;
}

const delay = (ms: number = MOCK_DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

function successResponse<T>(data: T): ApiResponse<T> {
  return { success: true, data, error: null };
}

function errorResponse<T>(message: string): ApiResponse<T> {
  return { success: false, data: null, error: message };
}

/**
 * @param operacao  frase curta usada nas mensagens de erro, ex.: "carregar produtos"
 */
async function resolver<T>(operacao: string, handlers: Handlers<T>): Promise<ApiResponse<T>> {
  try {
    if (ENV.dataSource === 'database') {
      const db = getSupabase();
      if (!db) return errorResponse('Banco ainda não configurado.');
      if (!handlers.database) {
        return errorResponse(`Não foi possível ${operacao}: essa parte ainda não usa o banco.`);
      }
      return successResponse(await handlers.database(db));
    }

    // Modo mock: espera para o carregamento aparecer, como no mundo real
    await delay();
    if (ENV.simulateMockError) return errorResponse(`Erro simulado ao ${operacao}.`);

    // Cópia, para a tela não alterar os dados do mock sem querer
    return successResponse(structuredClone(await handlers.mock()));
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Erro inesperado.');
  }
}

// ---------------------------------------------------------------------------
// Dados do mock em memória (alterações valem enquanto a página estiver aberta)
// ---------------------------------------------------------------------------

/** Data no fuso da loja, no formato AAAA-MM-DD */
function diaNaLoja(data: Date) {
  return data.toLocaleDateString('en-CA', { timeZone: FUSO_LOJA });
}

/**
 * Os agendados do mock têm datas fixas. Aqui eles são movidos para que o
 * primeiro dia do mock caia hoje, mantendo "hoje, amanhã e a semana".
 */
function agendadosAPartirDeHoje(pedidos: Pedido[]): Pedido[] {
  const primeiro = pedidos.find((p) => p.agendadoPara)?.agendadoPara;
  if (!primeiro) return pedidos;
  const UM_DIA = 24 * 60 * 60 * 1000;
  const diferenca =
    Date.parse(`${diaNaLoja(new Date())}T00:00:00Z`) -
    Date.parse(`${diaNaLoja(new Date(primeiro))}T00:00:00Z`);
  const mover = (iso?: string) =>
    iso ? new Date(Date.parse(iso) + Math.round(diferenca / UM_DIA) * UM_DIA).toISOString() : iso;
  return pedidos.map((p) => ({
    ...p,
    criadoEm: mover(p.criadoEm) ?? p.criadoEm,
    agendadoPara: mover(p.agendadoPara),
  }));
}

/** No mock, o usuário que entrou fica salvo na aba do navegador. */
const CHAVE_USUARIO = 'visual-adm:usuario-mock';

function lerUsuarioSalvo(): UsuarioPainel | null {
  try {
    const salvo = window.sessionStorage.getItem(CHAVE_USUARIO);
    return salvo ? (JSON.parse(salvo) as UsuarioPainel) : null;
  } catch {
    return null;
  }
}

function salvarUsuario(usuario: UsuarioPainel | null) {
  try {
    if (usuario) window.sessionStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
    else window.sessionStorage.removeItem(CHAVE_USUARIO);
  } catch {
    // Sem sessionStorage (aba anônima, por exemplo): fica só na memória
  }
}

const memoria = {
  categorias: structuredClone(mockCategorias),
  produtos: structuredClone(mockProdutos),
  pedidos: structuredClone(mockPedidosPainel),
  agendados: agendadosAPartirDeHoje(structuredClone(mockAgendados)),
  loja: structuredClone(mockLojaStatus),
  usuario: null as UsuarioPainel | null,
};

function usuarioAtualMock(): UsuarioPainel {
  memoria.usuario ??= lerUsuarioSalvo() ?? structuredClone(mockUsuarioPainel);
  return memoria.usuario;
}

/** "maria.souza@..." → "Maria Souza" */
function nomePeloEmail(email: string) {
  return email
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((parte) => parte[0].toUpperCase() + parte.slice(1))
    .join(' ');
}

function encontrarPedido(id: string): Pedido {
  const pedido = [...memoria.pedidos, ...memoria.agendados].find((p) => p.id === id);
  if (!pedido) throw new Error('Pedido não encontrado.');
  return pedido;
}

export type NovoPedido = Omit<Pedido, 'id' | 'numeroPedido' | 'status' | 'criadoEm'>;

// ---------------------------------------------------------------------------
// Funções que as telas usam
// ---------------------------------------------------------------------------

export const api = {
  // ----- Login (ADM-02). O login de verdade entra no FUT-03. -----

  /** No mock, qualquer e-mail e senha entram, com o perfil escolhido. */
  entrar(credenciais: CredenciaisLogin): Promise<ApiResponse<UsuarioPainel>> {
    return resolver('entrar', {
      mock: () => {
        const email = credenciais.email.trim();
        if (!email || !credenciais.senha) throw new Error('Informe e-mail e senha.');
        const usuario: UsuarioPainel = {
          nome: nomePeloEmail(email) || 'Usuário',
          email,
          perfil: credenciais.perfil,
        };
        memoria.usuario = usuario;
        salvarUsuario(usuario);
        return usuario;
      },
    });
  },

  sair(): Promise<ApiResponse<true>> {
    return resolver('sair', {
      mock: () => {
        memoria.usuario = null;
        salvarUsuario(null);
        return true as const;
      },
    });
  },

  buscarUsuarioAtual(): Promise<ApiResponse<UsuarioPainel>> {
    return resolver('carregar o usuário', {
      mock: usuarioAtualMock,
    });
  },

  // ----- Loja e menu do painel -----

  buscarStatusLoja(): Promise<ApiResponse<LojaStatus>> {
    return resolver('carregar o status da loja', {
      mock: () => memoria.loja,
    });
  },

  /** Abre ou pausa o recebimento de pedidos no site e no iFood. */
  alterarLojaAberta(aberta: boolean): Promise<ApiResponse<LojaStatus>> {
    return resolver(aberta ? 'abrir a loja' : 'pausar a loja', {
      mock: () => {
        memoria.loja = { ...memoria.loja, aberta };
        return memoria.loja;
      },
    });
  },

  buscarContadoresMenu(): Promise<ApiResponse<ContadoresMenu>> {
    return resolver('carregar os contadores', {
      mock: () => {
        const hoje = diaNaLoja(new Date());
        return {
          pedidosNovos: memoria.pedidos.filter((p) => p.status === 'pendente').length,
          agendadosHoje: memoria.agendados.filter(
            (p) => p.agendadoPara && diaNaLoja(new Date(p.agendadoPara)) === hoje
          ).length,
        };
      },
    });
  },

  // ----- Cardápio -----

  buscarCategorias(): Promise<ApiResponse<Categoria[]>> {
    return resolver('carregar as categorias', {
      mock: () => memoria.categorias,
    });
  },

  buscarProdutos(): Promise<ApiResponse<Produto[]>> {
    return resolver('carregar os produtos', {
      mock: () => memoria.produtos,
    });
  },

  atualizarProduto(id: string, novosDados: Partial<Produto>): Promise<ApiResponse<Produto>> {
    return resolver('atualizar o produto', {
      mock: () => {
        const atual = memoria.produtos.find((p) => p.id === id);
        if (!atual) throw new Error('Produto não encontrado.');
        const atualizado = { ...atual, ...novosDados, id };
        memoria.produtos = memoria.produtos.map((p) => (p.id === id ? atualizado : p));
        return atualizado;
      },
    });
  },

  // ----- Pedidos -----

  criarPedido(dados: NovoPedido): Promise<ApiResponse<Pedido>> {
    return resolver('criar o pedido', {
      mock: () => {
        const todos = [...memoria.pedidos, ...memoria.agendados];
        const novo: Pedido = {
          ...dados,
          id: `ped-${Date.now()}`,
          numeroPedido: Math.max(0, ...todos.map((p) => p.numeroPedido)) + 1,
          status: 'pendente',
          criadoEm: new Date().toISOString(),
        };
        if (novo.agendado) memoria.agendados.push(novo);
        else memoria.pedidos.unshift(novo);
        return novo;
      },
    });
  },

  buscarPedido(id: string): Promise<ApiResponse<Pedido>> {
    return resolver('carregar o pedido', {
      mock: () => encontrarPedido(id),
    });
  },

  buscarPedidosPainel(): Promise<ApiResponse<Pedido[]>> {
    return resolver('carregar os pedidos', {
      mock: () => memoria.pedidos,
    });
  },

  mudarStatusPedido(id: string, novoStatus: StatusPedido): Promise<ApiResponse<Pedido>> {
    return resolver('mudar o status do pedido', {
      mock: () => {
        const pedido = encontrarPedido(id);
        pedido.status = novoStatus;
        return pedido;
      },
    });
  },

  buscarAgendados(): Promise<ApiResponse<Pedido[]>> {
    return resolver('carregar os agendados', {
      mock: () => memoria.agendados,
    });
  },

  // ----- Dashboard -----

  buscarDadosDashboard(): Promise<ApiResponse<DashboardMetrics>> {
    return resolver('carregar o dashboard', {
      mock: () => mockDashboard,
    });
  },
};
