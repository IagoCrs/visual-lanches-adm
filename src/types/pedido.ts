export type StatusPedido = 'pendente' | 'em_preparo' | 'pronto' | 'saiu_para_entrega' | 'entregue' | 'cancelado' | 'atrasado';

export type MetodoPagamento = 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro';

export type TipoEntrega = 'entrega' | 'retirada';

export type MotivoRecusa = 'falta_ingrediente' | 'fora_da_area' | 'cozinha_lotada' | 'outro';

export interface ItemPedido {
    produtoId: string;
    nome: string;
    quantidade: number;
    precoUnitarioCentavos: number;
    adicionaisEscolhidos?: string[];
    observacao?: string;
}

export interface Pedido {
    id: string;
    numeroPedido: number;
    origem: 'site' | 'ifood';
    cliente: {
        nome: string;
        telefone: string;
        endereco?: string;
        bairro?: string;
    };
    itens: ItemPedido[];
    status: StatusPedido;
    observacaoGeral?: string;
    formaPagamento: MetodoPagamento;
    trocoParaCentavos?: number;
    totalCentavos: number;
    criadoEm: string;
    agendado: boolean;
    agendadoPara?: string;
    /** Entrega no endereço ou retirada no balcão. Sem valor = entrega. */
    tipoEntrega?: TipoEntrega;
    /** true = já pago (Pix/cartão online ou iFood); false = receber na entrega */
    pago?: boolean;
    /** Quando o pedido entrou no status atual (o tempo no painel conta daqui) */
    statusAtualizadoEm?: string;
    /** Preenchido quando o pedido é recusado */
    motivoRecusa?: MotivoRecusa;
    motivoRecusaDetalhe?: string;
}

export interface DashboardMetrics {
    hoje: {
        totalPedidos: number;
        faturamentoCentavos: number;
        ticketMedioCentavos: number;
    };
    ultimos7Dias: {
        totalPedidos: number;
        faturamentoCentavos: number;
        ticketMedioCentavos: number;
    };
    ultimos30Dias: {
        totalPedidos: number;
        faturamentoCentavos: number;
        ticketMedioCentavos: number;
    };
}
