# Painel Administrativo - Smash Burger & Co.

Painel de controle administrativo para gerenciamento de pedidos recebidos, alteração de status da cozinha (Em Preparação, Saiu para Entrega, Pronto), atualização do cardápio digital, controle de horário da loja e métricas de vendas.

---

## Repositório Relacionado

- **Interface Visual do Cliente (Pedidos)**: [visual-lanches-pedidos](https://github.com/IagoCrs/visual-lanches-pedidos)

---

## Arquitetura e Padronização de Pastas

Este projeto utiliza **Next.js 16 (App Router)** com **TypeScript** e **Tailwind CSS**. A estrutura de pastas segue o padrão unificado entre os dois repositórios:

` 	ext
visual-lanches-adm/
+-- src/
¦   +-- app/              # Rotas e páginas administrativas (dashboard, pedidos, cardapio)
¦   +-- components/       # Componentes do painel (OrderCard, StatusSwitch, Metrics)
¦   +-- context/          # Estados globais de autenticação e comanda (AuthContext.tsx)
¦   +-- data/             # Mocks de pedidos e métricas para testes
¦   +-- services/         # APIs e WebSockets para recepção de pedidos
¦   +-- types/            # Interfaces TypeScript compartilhadas (diner.ts)
+-- .eslintrc.json        # Regras de qualidade e linting de código
+-- .prettierrc           # Padrão de formatação automática de código
+-- package.json          # Dependências do projeto
+-- README.md             # Guia de instalação e execução
` `n
---

## Como Instalar e Rodar o Projeto (Do Zero)

### Pré-requisitos
- **Node.js** >= 18.x
- **npm** ou **pnpm**

### Passo a Passo

1. **Clonar o repositório**:
   `ash
   git clone https://github.com/IagoCrs/visual-lanches-adm.git
   cd visual-lanches-adm
   ``n
2. **Instalar as dependências**:
   `ash
   npm install
   ``n
3. **Executar o servidor de desenvolvimento**:
   `ash
   npm run dev
   ``n
4. **Acessar no navegador**:
   Abra [http://localhost:3001](http://localhost:3001) no seu navegador.

---

## Tecnologias Utilizadas

- **Next.js 16 (App Router)**
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (Ícones)
