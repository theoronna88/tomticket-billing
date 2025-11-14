# Faturamento TomTicket / TomTicket Billing

[🇧🇷 Português](#português) | [🇺🇸 English](#english)

---

## Português

### 📋 Sobre o Projeto

Sistema de faturamento automatizado que integra com a API do TomTicket para gerar faturas detalhadas de chamados técnicos. O sistema busca tickets por período e cliente, calcula horas trabalhadas e valores, e gera um documento pronto para impressão.

**Versão Atual**: Customizado para Kast Soluções  
**Versão Futura**: Planejada versão multi-empresa

### ✨ Funcionalidades

- 🔍 Busca automática de chamados via API TomTicket
- 📊 Cálculo automático de horas trabalhadas (formato decimal)
- 💰 Diferenciação de valores entre visitas presenciais e remotas
- 📄 Geração de fatura formatada para impressão
- 🎯 Filtros por cliente e período
- ⚡ Processamento em lote (rate limiting respeitado)
- 🖨️ Layout otimizado para impressão em A4

### 🛠️ Tecnologias

- **Framework**: Next.js 14+ (App Router)
- **Linguagem**: TypeScript / JavaScript
- **Estilização**: Tailwind CSS
- **API**: TomTicket REST API v2.0
- **Autenticação**: Bearer Token

### 📦 Estrutura do Projeto

```
faturamento-tomticket/
├── app/
│   ├── _actions/          # Server Actions (gerarFatura, buscarClientes)
│   ├── _components/       # Componentes React
│   │   ├── billing-template/  # Template de impressão da fatura
│   │   └── ui/            # Componentes UI reutilizáveis
│   ├── api/               # Utilitários de API (chamadas ao TomTicket)
│   ├── app/
│   │   └── billing/       # Página principal de faturamento
│   └── types.ts           # Definições TypeScript
├── public/
│   └── assets/            # Logo e imagens
└── prisma/
    └── schema.prisma      # Schema do banco de dados
```

### 🚀 Instalação

1. **Clone o repositório**

```bash
git clone <repository-url>
cd faturamento-tomticket
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```env
TOMTICKET_API_URL=https://api.tomticket.com/v2.0
TOMTICKET_API_KEY=sua_chave_api_aqui
```

4. **Execute o projeto**

```bash
npm run dev
```

Acesse: `http://localhost:3000/app/billing`

### 📝 Como Usar

1. **Selecione o Cliente**: Escolha o cliente na lista (carregada automaticamente da API)
2. **Defina o Período**: Selecione data inicial e final para o faturamento
3. **Gere a Fatura**: Clique em "Gerar Fatura"
4. **Visualize**: A fatura será exibida na tela com todos os chamados do período
5. **Imprima**: Use o botão "Imprimir Fatura" ou Ctrl+P

### 🔧 Configuração da API

O sistema busca os seguintes campos customizados dos tickets:

- **Data** (ID: `e8a8fa442be9cec32c5f27c9a83d20df`)
- **Hora Início** (ID: `12d6257be6e2149050615a12beee4fdb`)
- **Hora Finalizada** (ID: `0768e43a4cb163143531fbea62ba7d6e`)
- **Utilizou Material** (ID: `312b613faf3f2540014239952d6e923b`)
- **Serviço Executado** (ID: `288aa4cb102bfa5ea571867de3ecd004`)

### 💡 Funcionalidades Técnicas

#### Cálculo de Horas

- Converte horários (HH:MM) para formato decimal
- Exemplo: 1:30 → 1.50 horas

#### Valores de Visita

- **Visita Presencial**: Aplicado quando `ticket_type === "Externo"`
- **Visita Remota**: Aplicado para outros tipos
- Valores configurados nos custom_fields do cliente

#### Rate Limiting

- Máximo de 3 requisições simultâneas
- Delay de 1 segundo entre lotes

### 🖨️ Impressão

O sistema utiliza CSS `@media print` para:

- Ocultar elementos de navegação e formulários
- Exibir apenas o template da fatura
- Otimizar layout para página A4
- Preservar cores e estruturas da tabela

### 📄 Build e Deploy

```bash
# Build de produção
npm run build

# Iniciar em produção
npm start
```

### 🔐 Segurança

- Variáveis de ambiente **não** utilizam prefixo `NEXT_PUBLIC_`
- API key mantida server-side apenas
- Server Actions para comunicação cliente-servidor

---

## English

### 📋 About the Project

Automated billing system that integrates with TomTicket API to generate detailed invoices for technical support tickets. The system fetches tickets by period and customer, calculates worked hours and values, and generates a print-ready document.

**Current Version**: Customized for Kast Soluções  
**Future Version**: Multi-company version planned

### ✨ Features

- 🔍 Automatic ticket fetching via TomTicket API
- 📊 Automatic calculation of worked hours (decimal format)
- 💰 Differentiation between on-site and remote visit rates
- 📄 Formatted invoice generation for printing
- 🎯 Filters by customer and date range
- ⚡ Batch processing (respecting rate limits)
- 🖨️ A4-optimized print layout

### 🛠️ Technologies

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript / JavaScript
- **Styling**: Tailwind CSS
- **API**: TomTicket REST API v2.0
- **Authentication**: Bearer Token

### 📦 Project Structure

```
faturamento-tomticket/
├── app/
│   ├── _actions/          # Server Actions (gerarFatura, buscarClientes)
│   ├── _components/       # React Components
│   │   ├── billing-template/  # Invoice print template
│   │   └── ui/            # Reusable UI components
│   ├── api/               # API utilities (TomTicket calls)
│   ├── app/
│   │   └── billing/       # Main billing page
│   └── types.ts           # TypeScript definitions
├── public/
│   └── assets/            # Logo and images
└── prisma/
    └── schema.prisma      # Database schema
```

### 🚀 Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd faturamento-tomticket
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file in the project root:

```env
TOMTICKET_API_URL=https://api.tomticket.com/v2.0
TOMTICKET_API_KEY=your_api_key_here
```

4. **Run the project**

```bash
npm run dev
```

Access: `http://localhost:3000/app/billing`

### 📝 How to Use

1. **Select Customer**: Choose the customer from the list (automatically loaded from API)
2. **Set Period**: Select start and end dates for billing
3. **Generate Invoice**: Click "Gerar Fatura" (Generate Invoice)
4. **Review**: The invoice will be displayed with all tickets from the period
5. **Print**: Use "Imprimir Fatura" button or Ctrl+P

### 🔧 API Configuration

The system fetches the following custom ticket fields:

- **Date** (ID: `e8a8fa442be9cec32c5f27c9a83d20df`)
- **Start Time** (ID: `12d6257be6e2149050615a12beee4fdb`)
- **End Time** (ID: `0768e43a4cb163143531fbea62ba7d6e`)
- **Material Used** (ID: `312b613faf3f2540014239952d6e923b`)
- **Service Performed** (ID: `288aa4cb102bfa5ea571867de3ecd004`)

### 💡 Technical Features

#### Hours Calculation

- Converts time (HH:MM) to decimal format
- Example: 1:30 → 1.50 hours

#### Visit Rates

- **On-site Visit**: Applied when `ticket_type === "Externo"`
- **Remote Visit**: Applied for other types
- Values configured in customer's custom_fields

#### Rate Limiting

- Maximum 3 simultaneous requests
- 1-second delay between batches

### 🖨️ Printing

The system uses CSS `@media print` to:

- Hide navigation elements and forms
- Display only the invoice template
- Optimize layout for A4 pages
- Preserve colors and table structures

### 📄 Build and Deploy

```bash
# Production build
npm run build

# Start in production
npm start
```

### 🔐 Security

- Environment variables **do not** use `NEXT_PUBLIC_` prefix
- API key kept server-side only
- Server Actions for client-server communication

---

## 📞 Contact / Contato

**Kast Soluções**  
📧 Email: willian@kastsolucoes.com.br  
🌐 Website: kastsolucoes.com.br  
📞 Phone: (61) 4102-9696

---

## 📄 License / Licença

Este projeto é proprietário da Kast Soluções.  
This project is proprietary to Kast Soluções.

---

**Desenvolvido com ❤️ por Kast Soluções**  
**Developed with ❤️ by Kast Soluções**
