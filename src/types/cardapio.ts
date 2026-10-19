export interface ItemAdicional {
    id: string;
    nome: string;
    precoCentavos: number;
}

export interface GrupoAdicional {
    id: string;
    nome: string;
    minimo: number;
    maximo: number;
    obrigatorio: boolean;
    itens: ItemAdicional[];
}

export interface Produto {
    id: string;
    nome: string;
    descricao: string;
    categoriaId: string;
    precoCentavos: number;
    imagemUrl?: string;
    esgotado: boolean;
    canaisVenda: ('site' | 'ifood')[];
    gruposAdicionais?: GrupoAdicional[];
}

export interface Categoria {
    id: string;
    nome: string;
    icone?: string;
}

export interface LojaStatus {
    aberta: boolean;
    horarioAbertura: string;
    tempoEntrega: string;
    taxaMinimaCentavos: number;
    pedidoMinimoCentavos: number;
    mensagem: string;
}
