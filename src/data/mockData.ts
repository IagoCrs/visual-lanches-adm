// src/data/mockData.ts
import { Categoria, Produto, LojaStatus } from '@/types/cardapio';
import { Pedido, DashboardMetrics } from '@/types/pedido';
import { UsuarioPainel } from '@/types/painel';

// 1. Categorias
export const mockCategorias: Categoria[] = [
    { id: 'lanches', nome: 'Lanches', icone: '🍔' },
    { id: 'porcoes', nome: 'Porções', icone: '🍟' },
    { id: 'bebidas', nome: 'Bebidas', icone: '🥤' },
    { id: 'sobremesas', nome: 'Sobremesas', icone: '🍦' },
];

// 2. Grupos de adicionais reutilizáveis
const grupoPontoCarne = {
    id: 'grp-ponto',
    nome: 'Ponto da Carne',
    minimo: 1,
    maximo: 1,
    obrigatorio: true,
    itens: [
        { id: 'pt-1', nome: 'Ao Ponto', precoCentavos: 0 },
        { id: 'pt-2', nome: 'Bem Passado', precoCentavos: 0 },
        { id: 'pt-3', nome: 'Ao Ponto para Mal', precoCentavos: 0 },
    ],
};

const grupoExtrasLanche = {
    id: 'grp-extras',
    nome: 'Adicionais Extras',
    minimo: 0,
    maximo: 3,
    obrigatorio: false,
    itens: [
        { id: 'ext-bacon', nome: 'Bacon Crocante Extra', precoCentavos: 450 },
        { id: 'ext-queijo', nome: 'Cheddar Cremoso Extra', precoCentavos: 350 },
        { id: 'ext-cebola', nome: 'Cebola Caramelizada', precoCentavos: 300 },
        { id: 'ext-molho', nome: 'Molho Especial da Casa', precoCentavos: 250 },
    ],
};

// 3. 10 Produtos com casos especiais
export const mockProdutos: Produto[] = [
    {
        id: 'prod-1',
        nome: 'Visual Smash Burger',
        descricao: 'Pão brioche selado na manteiga, 2x smash burgers de 90g, queijo cheddar derretido e maionese especial.',
        categoriaId: 'lanches',
        precoCentavos: 2690,
        esgotado: false,
        canaisVenda: ['site', 'ifood'],
        gruposAdicionais: [grupoPontoCarne, grupoExtrasLanche],
    },
    {
        id: 'prod-2',
        nome: 'Visual Bacon Supremo',
        descricao: 'Pão australiano, hambúrguer artesanal de 160g, fatias generosas de bacon crocante, cheddar e barbecue artesanal.',
        categoriaId: 'lanches',
        precoCentavos: 3290,
        esgotado: false,
        canaisVenda: ['site', 'ifood'],
        gruposAdicionais: [grupoPontoCarne, grupoExtrasLanche],
    },
    {
        id: 'prod-3',
        nome: 'Visual Salad Clássico',
        descricao: 'Pão brioche, burger 150g, queijo prato, alface americana fresca, tomate italiano e molho verde.',
        categoriaId: 'lanches',
        precoCentavos: 2490,
        esgotado: false,
        canaisVenda: ['site'],
        gruposAdicionais: [grupoPontoCarne, grupoExtrasLanche],
    },
    {
        id: 'prod-4',
        nome: 'Visual Picanha Burger',
        descricao: 'Hambúrguer de picanha 180g, queijo provolone empanado, maionese defumada e rúcula.',
        categoriaId: 'lanches',
        precoCentavos: 3790,
        esgotado: true, // CASO ESPECIAL: Produto Esgotado!
        canaisVenda: ['site', 'ifood'],
        gruposAdicionais: [grupoPontoCarne, grupoExtrasLanche],
    },
    {
        id: 'prod-5',
        nome: 'Visual Frango Crispy',
        descricao: 'Sobrecoxa desossada empanada e ultracrocante, salada coleslaw e maionese de páprica.',
        categoriaId: 'lanches',
        precoCentavos: 2590,
        esgotado: false,
        canaisVenda: ['site', 'ifood'],
    },
    {
        id: 'prod-6',
        nome: 'Batata Rústica com Alecrim',
        descricao: 'Porção individual de batatas rústicas douradas temperadas com alecrim fresco e sal grosso.',
        categoriaId: 'porcoes',
        precoCentavos: 1890,
        esgotado: false,
        canaisVenda: ['site', 'ifood'],
    },
    {
        id: 'prod-7',
        nome: 'Batata Frita Suprema',
        descricao: 'Batata frita sequinha coberta com queijo cheddar cremoso e farofa de bacon crocante. Serve 2 pessoas.',
        categoriaId: 'porcoes',
        precoCentavos: 3190,
        esgotado: false,
        canaisVenda: ['site', 'ifood'],
    },
    {
        id: 'prod-8',
        nome: 'Coca-Cola Original 350ml',
        descricao: 'Lata de 350ml bem gelada.',
        categoriaId: 'bebidas',
        precoCentavos: 650,
        esgotado: false,
        canaisVenda: ['site', 'ifood'],
    },
    {
        id: 'prod-9',
        nome: 'Suco Natural de Laranja 500ml',
        descricao: 'Feito na hora, sem adição de açúcar.',
        categoriaId: 'bebidas',
        precoCentavos: 990,
        esgotado: false,
        canaisVenda: ['site'],
    },
    {
        id: 'prod-10',
        nome: 'Pudim de Leite Condensado',
        descricao: 'Fatia individual de pudim artesanal com calda de caramelo dourada.',
        categoriaId: 'sobremesas',
        precoCentavos: 1200,
        esgotado: false,
        canaisVenda: ['ifood'], // Exclusivo iFood
    },
];

// 4. Status da Loja
export const mockLojaStatus: LojaStatus = {
    aberta: true,
    horarioAbertura: '18:00',
    tempoEntrega: '35-50 min',
    taxaMinimaCentavos: 500, // R$ 5,00
    pedidoMinimoCentavos: 2000, // R$ 20,00
    mensagem: 'Aceitando pedidos agora',
};

// 5. Pedidos no Painel (inclui casos especiais)
// Os horários são relativos a MOMENTO_DO_MOCK: a api.ts move tudo para que
// esse momento vire "agora", assim o tempo de cada pedido faz sentido na tela.
export const MOMENTO_DO_MOCK = '2026-10-12T22:05:00Z'; // 19:05 em Brasília

export const mockPedidosPainel: Pedido[] = [
    {
        id: 'ped-109',
        numeroPedido: 109,
        origem: 'site',
        cliente: { nome: 'Paulo Henrique', telefone: '(48) 99123-4567', endereco: 'Rua Seis de Janeiro, 410', bairro: 'Centro' },
        itens: [
            { produtoId: 'prod-5', nome: 'Visual Frango Crispy', quantidade: 2, precoUnitarioCentavos: 2590 },
            { produtoId: 'prod-8', nome: 'Coca-Cola Original 350ml', quantidade: 2, precoUnitarioCentavos: 650 },
        ],
        status: 'pendente',
        formaPagamento: 'dinheiro',
        pago: false,
        trocoParaCentavos: 10000, // Troco para R$ 100,00
        tipoEntrega: 'entrega',
        totalCentavos: 6980,
        criadoEm: '2026-10-12T22:04:00Z', // há 1 min: normal
        statusAtualizadoEm: '2026-10-12T22:04:00Z',
        agendado: false,
    },
    {
        id: 'ped-101',
        numeroPedido: 101,
        origem: 'site',
        cliente: { nome: 'Lucas Ribeiro', telefone: '(48) 98765-4321', endereco: 'Rua das Flores, 120 - Apto 32', bairro: 'Próspera' },
        itens: [{ produtoId: 'prod-1', nome: 'Visual Smash Burger', quantidade: 2, precoUnitarioCentavos: 2690, adicionaisEscolhidos: ['Ponto: Bem Passado', 'Bacon Crocante Extra'] }],
        status: 'pendente',
        observacaoGeral: 'Tirar o picles e caprichar no guardanapo, por favor!', // CASO ESPECIAL: Com observação
        formaPagamento: 'pix',
        pago: true,
        tipoEntrega: 'entrega',
        totalCentavos: 6280,
        criadoEm: '2026-10-12T22:00:00Z', // há 5 min: atenção
        statusAtualizadoEm: '2026-10-12T22:00:00Z',
        agendado: false,
    },
    {
        id: 'ped-102',
        numeroPedido: 102,
        origem: 'ifood',
        cliente: { nome: 'Mariana Souza', telefone: '(48) 97777-8888', endereco: 'Av. Centenário, 1500', bairro: 'Santa Bárbara' },
        itens: [{ produtoId: 'prod-2', nome: 'Visual Bacon Supremo', quantidade: 1, precoUnitarioCentavos: 3290 }],
        status: 'pendente', // CASO ESPECIAL: esperando aceite há 10 min = atrasado
        formaPagamento: 'cartao_credito',
        pago: true,
        tipoEntrega: 'entrega',
        totalCentavos: 3790,
        criadoEm: '2026-10-12T21:55:00Z',
        statusAtualizadoEm: '2026-10-12T21:55:00Z',
        agendado: false,
    },
    {
        id: 'ped-103',
        numeroPedido: 103,
        origem: 'site',
        cliente: { nome: 'Carlos Eduardo', telefone: '(48) 96543-2109', endereco: 'Rua Coronel Pedro Benedet, 89', bairro: 'Centro' },
        itens: [
            { produtoId: 'prod-1', nome: 'Visual Smash Burger', quantidade: 1, precoUnitarioCentavos: 2690, observacao: 'Sem cebola' },
            { produtoId: 'prod-8', nome: 'Coca-Cola Original 350ml', quantidade: 1, precoUnitarioCentavos: 650 },
        ],
        status: 'em_preparo',
        formaPagamento: 'dinheiro',
        pago: false,
        trocoParaCentavos: 5000, // CASO ESPECIAL: Dinheiro com troco para R$ 50,00!
        tipoEntrega: 'entrega',
        totalCentavos: 3840,
        criadoEm: '2026-10-12T21:45:00Z',
        statusAtualizadoEm: '2026-10-12T21:48:00Z', // em preparo há 17 min: normal
        agendado: false,
    },
    {
        id: 'ped-110',
        numeroPedido: 110,
        origem: 'ifood',
        cliente: { nome: 'Sônia Alves', telefone: '(48) 99876-5432', endereco: 'Rua Henrique Lage, 77', bairro: 'Michel' },
        itens: [
            { produtoId: 'prod-7', nome: 'Batata Frita Suprema', quantidade: 1, precoUnitarioCentavos: 3190 },
            { produtoId: 'prod-2', nome: 'Visual Bacon Supremo', quantidade: 2, precoUnitarioCentavos: 3290, adicionaisEscolhidos: ['Ponto: Ao Ponto'] },
        ],
        status: 'em_preparo',
        formaPagamento: 'cartao_credito',
        pago: true,
        tipoEntrega: 'entrega',
        totalCentavos: 10270,
        criadoEm: '2026-10-12T21:38:00Z',
        statusAtualizadoEm: '2026-10-12T21:41:00Z', // em preparo há 24 min: atenção
        agendado: false,
    },
    {
        id: 'ped-104',
        numeroPedido: 104,
        origem: 'site',
        cliente: { nome: 'Beatriz Lima', telefone: '(48) 91234-5678' },
        itens: [{ produtoId: 'prod-7', nome: 'Batata Frita Suprema', quantidade: 1, precoUnitarioCentavos: 3190 }],
        status: 'pronto',
        formaPagamento: 'pix',
        pago: true,
        tipoEntrega: 'retirada', // CASO ESPECIAL: retirada no balcão
        totalCentavos: 3190,
        criadoEm: '2026-10-12T21:35:00Z',
        statusAtualizadoEm: '2026-10-12T21:58:00Z',
        agendado: false,
    },
    {
        id: 'ped-105',
        numeroPedido: 105,
        origem: 'ifood',
        cliente: { nome: 'Rafael Mendes', telefone: '(48) 93333-2222', endereco: 'Rua Marechal Deodoro, 1020', bairro: 'Pinheirinho' },
        itens: [{ produtoId: 'prod-3', nome: 'Visual Salad Clássico', quantidade: 2, precoUnitarioCentavos: 2490 }],
        status: 'saiu_para_entrega',
        formaPagamento: 'cartao_debito',
        pago: true,
        tipoEntrega: 'entrega',
        totalCentavos: 5480,
        criadoEm: '2026-10-12T21:20:00Z',
        statusAtualizadoEm: '2026-10-12T21:50:00Z',
        agendado: false,
    },
    {
        id: 'ped-106',
        numeroPedido: 106,
        origem: 'site',
        cliente: { nome: 'Fernanda Rocha', telefone: '(48) 94444-1111', endereco: 'Rua Haddock Lobo, 305', bairro: 'Centro' },
        itens: [{ produtoId: 'prod-2', nome: 'Visual Bacon Supremo', quantidade: 1, precoUnitarioCentavos: 3290 }],
        status: 'entregue',
        formaPagamento: 'pix',
        pago: true,
        tipoEntrega: 'entrega',
        totalCentavos: 3790,
        criadoEm: '2026-10-12T20:40:00Z',
        agendado: false,
    },
    {
        id: 'ped-107',
        numeroPedido: 107,
        origem: 'ifood',
        cliente: { nome: 'Thiago Neves', telefone: '(48) 95555-9999', endereco: 'Rua Oscar Freire, 55', bairro: 'Comerciário' },
        itens: [{ produtoId: 'prod-5', nome: 'Visual Frango Crispy', quantidade: 1, precoUnitarioCentavos: 2590 }],
        status: 'entregue',
        formaPagamento: 'cartao_credito',
        pago: true,
        tipoEntrega: 'entrega',
        totalCentavos: 3090,
        criadoEm: '2026-10-12T20:30:00Z',
        agendado: false,
    },
    {
        id: 'ped-108',
        numeroPedido: 108,
        origem: 'site',
        cliente: { nome: 'Juliana Costa', telefone: '(48) 98888-7777', endereco: 'Rua da Consolação, 200', bairro: 'Centro' },
        itens: [{ produtoId: 'prod-1', nome: 'Visual Smash Burger', quantidade: 1, precoUnitarioCentavos: 2690 }],
        status: 'cancelado',
        motivoRecusa: 'fora_da_area',
        formaPagamento: 'pix',
        pago: true,
        tipoEntrega: 'entrega',
        totalCentavos: 3190,
        criadoEm: '2026-10-12T20:15:00Z',
        agendado: false,
    },
];

// 6. 10 Pedidos Agendados (Hoje, Amanhã e Semana)
export const mockAgendados: Pedido[] = [
    // Hoje
    {
        id: 'ag-1',
        numeroPedido: 201,
        origem: 'site',
        cliente: { nome: 'Ana Paula', telefone: '(11) 91111-2222', endereco: 'Rua Pamplona, 700' },
        itens: [{ produtoId: 'prod-1', nome: 'Visual Smash Burger', quantidade: 3, precoUnitarioCentavos: 2690 }],
        status: 'pendente',
        formaPagamento: 'pix',
        totalCentavos: 8570,
        criadoEm: '2026-10-12T14:00:00Z',
        agendado: true,
        agendadoPara: '2026-10-12T21:30:00Z',
    },
    {
        id: 'ag-2',
        numeroPedido: 202,
        origem: 'ifood',
        cliente: { nome: 'Marcelo Dias', telefone: '(11) 92222-3333', endereco: 'Av. Rebouças, 1200' },
        itens: [{ produtoId: 'prod-7', nome: 'Batata Frita Suprema', quantidade: 2, precoUnitarioCentavos: 3190 }],
        status: 'pendente',
        formaPagamento: 'cartao_credito',
        totalCentavos: 6880,
        criadoEm: '2026-10-12T15:00:00Z',
        agendado: true,
        agendadoPara: '2026-10-12T22:00:00Z',
    },
    {
        id: 'ag-3',
        numeroPedido: 203,
        origem: 'site',
        cliente: { nome: 'Camila Torres', telefone: '(11) 93333-4444', endereco: 'Rua Frei Caneca, 90' },
        itens: [{ produtoId: 'prod-2', nome: 'Visual Bacon Supremo', quantidade: 1, precoUnitarioCentavos: 3290 }],
        status: 'pendente',
        formaPagamento: 'pix',
        totalCentavos: 3790,
        criadoEm: '2026-10-12T16:00:00Z',
        agendado: true,
        agendadoPara: '2026-10-12T22:30:00Z',
    },
    // Amanhã
    {
        id: 'ag-4',
        numeroPedido: 204,
        origem: 'site',
        cliente: { nome: 'Guilherme Silva', telefone: '(11) 94444-5555', endereco: 'Rua Bela Cintra, 600' },
        itens: [{ produtoId: 'prod-1', nome: 'Visual Smash Burger', quantidade: 4, precoUnitarioCentavos: 2690 }],
        status: 'pendente',
        formaPagamento: 'pix',
        totalCentavos: 11260,
        criadoEm: '2026-10-12T17:00:00Z',
        agendado: true,
        agendadoPara: '2026-10-13T19:00:00Z',
    },
    {
        id: 'ag-5',
        numeroPedido: 205,
        origem: 'ifood',
        cliente: { nome: 'Vanessa Prado', telefone: '(11) 95555-6666', endereco: 'Rua Itapeva, 40' },
        itens: [{ produtoId: 'prod-5', nome: 'Visual Frango Crispy', quantidade: 2, precoUnitarioCentavos: 2590 }],
        status: 'pendente',
        formaPagamento: 'cartao_credito',
        totalCentavos: 5680,
        criadoEm: '2026-10-12T18:00:00Z',
        agendado: true,
        agendadoPara: '2026-10-13T20:00:00Z',
    },
    {
        id: 'ag-6',
        numeroPedido: 206,
        origem: 'site',
        cliente: { nome: 'Diego Martins', telefone: '(11) 96666-7777', endereco: 'Rua Peixoto Gomide, 150' },
        itens: [{ produtoId: 'prod-2', nome: 'Visual Bacon Supremo', quantidade: 2, precoUnitarioCentavos: 3290 }],
        status: 'pendente',
        formaPagamento: 'pix',
        totalCentavos: 7080,
        criadoEm: '2026-10-12T18:30:00Z',
        agendado: true,
        agendadoPara: '2026-10-13T21:00:00Z',
    },
    // Na Semana
    {
        id: 'ag-7',
        numeroPedido: 207,
        origem: 'site',
        cliente: { nome: 'Empresa Tech Ltda', telefone: '(11) 97777-1111', endereco: 'Av. Faria Lima, 3500' },
        itens: [
            { produtoId: 'prod-1', nome: 'Visual Smash Burger', quantidade: 10, precoUnitarioCentavos: 2690 },
            { produtoId: 'prod-7', nome: 'Batata Frita Suprema', quantidade: 5, precoUnitarioCentavos: 3190 },
        ],
        status: 'pendente',
        observacaoGeral: 'Pedido para confraternização da equipe.',
        formaPagamento: 'pix',
        totalCentavos: 42850,
        criadoEm: '2026-10-12T10:00:00Z',
        agendado: true,
        agendadoPara: '2026-10-15T18:00:00Z',
    },
    {
        id: 'ag-8',
        numeroPedido: 208,
        origem: 'ifood',
        cliente: { nome: 'Patricia Ramos', telefone: '(11) 98888-2222', endereco: 'Rua Pamplona, 900' },
        itens: [{ produtoId: 'prod-3', nome: 'Visual Salad Clássico', quantidade: 1, precoUnitarioCentavos: 2490 }],
        status: 'pendente',
        formaPagamento: 'cartao_credito',
        totalCentavos: 2990,
        criadoEm: '2026-10-12T11:00:00Z',
        agendado: true,
        agendadoPara: '2026-10-16T20:00:00Z',
    },
    {
        id: 'ag-9',
        numeroPedido: 209,
        origem: 'site',
        cliente: { nome: 'Rodrigo Faro', telefone: '(11) 99999-3333', endereco: 'Rua Estados Unidos, 120' },
        itens: [{ produtoId: 'prod-2', nome: 'Visual Bacon Supremo', quantidade: 3, precoUnitarioCentavos: 3290 }],
        status: 'pendente',
        formaPagamento: 'pix',
        totalCentavos: 10370,
        criadoEm: '2026-10-12T12:00:00Z',
        agendado: true,
        agendadoPara: '2026-10-17T19:30:00Z',
    },
    {
        id: 'ag-10',
        numeroPedido: 210,
        origem: 'site',
        cliente: { nome: 'Sabrina Sato', telefone: '(11) 91234-9876', endereco: 'Rua Oscar Freire, 800' },
        itens: [
            { produtoId: 'prod-5', nome: 'Visual Frango Crispy', quantidade: 2, precoUnitarioCentavos: 2590 },
            { produtoId: 'prod-8', nome: 'Coca-Cola Original 350ml', quantidade: 2, precoUnitarioCentavos: 650 },
        ],
        status: 'pendente',
        formaPagamento: 'pix',
        totalCentavos: 6980,
        criadoEm: '2026-10-12T13:00:00Z',
        agendado: true,
        agendadoPara: '2026-10-18T20:30:00Z',
    },
];

// 7. Métricas do Dashboard (Hoje, 7 dias e 30 dias)
export const mockDashboard: DashboardMetrics = {
    hoje: {
        totalPedidos: 18,
        faturamentoCentavos: 94500, // R$ 945,00
        ticketMedioCentavos: 5250,  // R$ 52,50
    },
    ultimos7Dias: {
        totalPedidos: 142,
        faturamentoCentavos: 765000, // R$ 7.650,00
        ticketMedioCentavos: 5387,   // R$ 53,87
    },
    ultimos30Dias: {
        totalPedidos: 620,
        faturamentoCentavos: 3348000, // R$ 33.480,00
        ticketMedioCentavos: 5400,    // R$ 54,00
    },
};

// 8. Usuário do painel (antes de entrar pela tela de login)
export const mockUsuarioPainel: UsuarioPainel = {
    nome: 'Gabriel',
    email: 'gabriel@visuallanches.com.br',
    perfil: 'admin',
};
