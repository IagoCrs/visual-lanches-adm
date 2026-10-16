export type StatusPedido = 'pendente' | 'em_preparo' | 'pronto' | 'saiu_para_entrega' | 'entregue' | 'cancelado' | 'atrasado';

export type MetodoPagamento = 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro';

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
