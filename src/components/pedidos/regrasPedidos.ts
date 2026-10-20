/**
 * Regras da tela de pedidos (ADM-03): colunas, limites de tempo e ações.
 * Mudar um limite ou um texto aqui muda a tela inteira.
 */
import type { MetodoPagamento, MotivoRecusa, Pedido, StatusPedido } from '@/types/pedido';

export type ColunaId = 'novos' | 'preparo' | 'saida';

export interface Coluna {
  id: ColunaId;
  titulo: string;
  dica: string;
  status: StatusPedido[];
  /** Minutos na etapa para virar "atenção" e "atrasado" */
  limites: { atencao: number; atrasado: number };
}

export const COLUNAS: Coluna[] = [
  {
    id: 'novos',
    titulo: 'Novos',
    dica: 'esperando aceite',
    status: ['pendente'],
    limites: { atencao: 4, atrasado: 8 },
  },
  {
    id: 'preparo',
    titulo: 'Em preparo',
    dica: 'na cozinha',
    status: ['em_preparo'],
    limites: { atencao: 20, atrasado: 30 },
  },
  {
    id: 'saida',
    titulo: 'Saiu / pronto',
    dica: 'a caminho ou no balcão',
    status: ['saiu_para_entrega', 'pronto'],
    limites: { atencao: 30, atrasado: 45 },
  },
];

export function colunaDoPedido(pedido: Pedido): ColunaId | null {
  return COLUNAS.find((c) => c.status.includes(pedido.status))?.id ?? null;
}

// ---------------------------------------------------------------------------
// Tempo
// ---------------------------------------------------------------------------

export type NivelTempo = 'normal' | 'atencao' | 'atrasado';

/** Minutos desde que o pedido entrou na etapa atual */
export function minutosNaEtapa(pedido: Pedido, agora: number) {
  const desde = Date.parse(pedido.statusAtualizadoEm ?? pedido.criadoEm);
  return Math.max(0, Math.floor((agora - desde) / 60000));
}

export function nivelDoTempo(minutos: number, coluna: Coluna): NivelTempo {
  if (minutos >= coluna.limites.atrasado) return 'atrasado';
  if (minutos >= coluna.limites.atencao) return 'atencao';
  return 'normal';
}

/** Hora no fuso da loja, ex.: "19:05" */
export function horaDaLoja(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });
}

// ---------------------------------------------------------------------------
// Ações de cada etapa
// ---------------------------------------------------------------------------

export interface Acao {
  rotulo: string;
  proximoStatus: StatusPedido;
  /** Texto da confirmação rápida, ex.: "Pedido #101 foi para Em preparo" */
  confirmacao: (numero: number) => string;
}

export function acaoPrincipal(pedido: Pedido): Acao | null {
  const retirada = pedido.tipoEntrega === 'retirada';
  switch (pedido.status) {
    case 'pendente':
      return {
        rotulo: 'Aceitar pedido',
        proximoStatus: 'em_preparo',
        confirmacao: (n) => `Pedido #${n} aceito e enviado para a cozinha`,
      };
    case 'em_preparo':
      return retirada
        ? {
            rotulo: 'Pronto para retirada',
            proximoStatus: 'pronto',
            confirmacao: (n) => `Pedido #${n} pronto para retirada`,
          }
        : {
            rotulo: 'Saiu para entrega',
            proximoStatus: 'saiu_para_entrega',
            confirmacao: (n) => `Pedido #${n} saiu para entrega`,
          };
    case 'saiu_para_entrega':
    case 'pronto':
      return {
        rotulo: 'Marcar como entregue',
        proximoStatus: 'entregue',
        confirmacao: (n) => `Pedido #${n} entregue`,
      };
    default:
      return null;
  }
}

export const MOTIVOS_RECUSA: { valor: MotivoRecusa; rotulo: string }[] = [
  { valor: 'falta_ingrediente', rotulo: 'Falta de ingrediente' },
  { valor: 'fora_da_area', rotulo: 'Fora da área de entrega' },
  { valor: 'cozinha_lotada', rotulo: 'Cozinha lotada' },
  { valor: 'outro', rotulo: 'Outro motivo' },
];

// ---------------------------------------------------------------------------
// Textos
// ---------------------------------------------------------------------------

const NOME_PAGAMENTO: Record<MetodoPagamento, string> = {
  pix: 'Pix',
  cartao_credito: 'Crédito',
  cartao_debito: 'Débito',
  dinheiro: 'Dinheiro',
};

export function formatarReais(centavos: number) {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/** Ex.: "Pago no iFood", "Pago · Pix", "A receber · Dinheiro · troco p/ R$ 50,00" */
export function textoPagamento(pedido: Pedido) {
  const forma = NOME_PAGAMENTO[pedido.formaPagamento];
  const pago = pedido.pago ?? pedido.origem === 'ifood';
  if (pago) return { pago, texto: pedido.origem === 'ifood' ? 'Pago no iFood' : `Pago · ${forma}` };
  const troco = pedido.trocoParaCentavos
    ? ` · troco p/ ${formatarReais(pedido.trocoParaCentavos)}`
    : '';
  return { pago, texto: `A receber · ${forma}${troco}` };
}
