# SimulaFácil

Simuladores financeiros gratuitos, rápidos e sem cadastro.

## Sobre o projeto

O **SimulaFácil** é uma Single Page Application (SPA) que reúne ferramentas de simulação
financeira para ajudar pessoas a tomar decisões sobre investimentos e financiamentos. Todos os
cálculos são feitos no navegador, sem necessidade de backend.

O projeto está sendo desenvolvido na disciplina de Integração Contínua (IC18SW — UTFPR) e será
evoluído ao longo do semestre.

## Problema que o serviço pretende resolver

Muitas pessoas contratam financiamentos ou escolhem onde investir sem conseguir visualizar o
efeito dos juros a longo prazo. As calculadoras disponíveis costumam ser confusas, exigir
cadastro ou estar ligadas à venda de um produto específico. O SimulaFácil oferece simulações
claras, comparativas e acessíveis para qualquer pessoa.

## Público-alvo

- Pessoas que estão começando a investir e querem entender juros compostos.
- Quem está planejando comprar um imóvel ou veículo financiado.
- Estudantes e interessados em educação financeira.

## Funcionalidades

- **Simulador de juros compostos:** valor inicial, aportes mensais, taxa anual e prazo, com
  gráfico da evolução do patrimônio e tabela ano a ano.
- **Simulador de financiamento:** compara as tabelas **SAC** e **Price**, mostrando primeira e
  última parcela, total de juros, economia entre os sistemas e a tabela mês a mês.
- **Comparador de investimentos:** ranking de poupança, Tesouro Selic, CDB e LCI pelo
  rendimento líquido, aplicando a tabela regressiva do imposto de renda. Os produtos e taxas de
  referência ficam em um arquivo JSON (`src/data/investimentos.json`).
- Navegação entre páginas sem recarregamento (React Router).
- Espaços reservados para publicidade e oferta patrocinada.
- Layout responsivo para celular e desktop.

## Tecnologias utilizadas

- [React](https://react.dev/) — interface
- [Vite](https://vite.dev/) — servidor de desenvolvimento e build
- [React Router](https://reactrouter.com/) — navegação da SPA
- [ESLint](https://eslint.org/) — análise estática do código
- JSON estático como fonte de dados
- Git e GitHub para versionamento
- GitHub Actions para integração contínua

## Possibilidades de monetização

- **Anúncios display** nos espaços reservados das páginas de simulação (ex.: Google AdSense).
- **Ofertas patrocinadas** de bancos e corretoras no comparador de investimentos.
- **Marketing de afiliados:** comissão por abertura de conta ou contratação de produto indicado.
- **Versão premium** futura com exportação de relatórios em PDF e simulações salvas.

A monetização ainda não está implementada; as áreas de anúncio estão apenas demarcadas.

## Como executar o projeto localmente

Pré-requisitos: [Node.js](https://nodejs.org/) 20 ou superior.

```bash
git clone https://github.com/ramosnvy/simulafacil.git
cd simulafacil
npm install
npm run dev
```

Acesse `http://localhost:5173` no navegador.

Outros comandos:

| Comando           | Descrição                                   |
| ----------------- | ------------------------------------------- |
| `npm run build`   | Gera a versão de produção na pasta `dist/`   |
| `npm run preview` | Serve localmente a versão gerada pelo build |
| `npm run lint`    | Executa a análise do código com ESLint      |

## Integração Contínua

[![CI](https://github.com/ramosnvy/simulafacil/actions/workflows/ci.yml/badge.svg)](https://github.com/ramosnvy/simulafacil/actions/workflows/ci.yml)

### Ferramenta utilizada

**GitHub Actions**. O pipeline está definido em
[`.github/workflows/ci.yml`](.github/workflows/ci.yml) e roda em uma máquina virtual Ubuntu com
Node.js 22.

### Quando o pipeline é executado

- A cada **push** na branch `main`;
- A cada **pull request** aberto ou atualizado para a branch `main`;
- Manualmente, pelo botão *Run workflow* na aba Actions (`workflow_dispatch`).

Assim, toda alteração enviada ao repositório é validada automaticamente, sem depender de
alguém executar o build na própria máquina.

### Etapas do pipeline

```
Push / Pull request
        ↓
Checkout do código        (actions/checkout)
        ↓
Configurar Node.js        (actions/setup-node, com cache do npm)
        ↓
Instalar dependências     (npm ci)
        ↓
Lint                      (npm run lint)
        ↓
Build                     (npm run build)
        ├── sucesso → ✓ alteração validada
        └── falha   → ✕ GitHub marca o commit como quebrado
```

1. **Checkout:** baixa o código do commit que disparou a execução.
2. **Configurar Node.js:** instala o Node.js 22 e reaproveita o cache de pacotes do npm.
3. **Instalar dependências:** `npm ci` instala exatamente as versões do `package-lock.json`.
4. **Lint:** o ESLint verifica erros e más práticas no código.
5. **Build:** o Vite gera a versão de produção. Se qualquer etapa falhar, o pipeline é
   interrompido e marcado como falho.

### Como verificar uma execução

1. Acesse a aba **[Actions](https://github.com/ramosnvy/simulafacil/actions)** do repositório.
2. Selecione o workflow **CI** e clique na execução desejada (cada uma mostra o commit que a
   disparou).
3. Abra o job **Build da SPA** para ver o log de cada etapa.

O resultado também aparece ao lado de cada commit (✓ verde ou ✕ vermelho) e no selo no topo
desta seção.

Para validar o funcionamento, foi enviado um commit com uma **falha proposital** (importação de
um arquivo inexistente). O pipeline falhou na etapa *Build*, mostrando o erro no log. O
commit seguinte reverteu a alteração e o pipeline voltou a passar:

```
Commit → Pipeline → Build ✓   (ci: pipeline de integração contínua com GitHub Actions)
Commit → Pipeline → Build ✕   (test: falha proposital no build para validar o pipeline)
Commit → Pipeline → Build ✓   (fix: reverte a falha proposital e restaura o build)
```

## Estrutura do projeto

```
simulafacil/
├── .github/workflows/   # pipeline de CI (GitHub Actions)
├── public/              # arquivos estáticos (ícone)
├── src/
│   ├── components/      # cabeçalho, rodapé, espaço de anúncio, campos
│   ├── data/            # dados estáticos em JSON
│   ├── lib/             # funções de cálculo financeiro e formatação
│   ├── pages/           # páginas da SPA
│   ├── App.jsx          # rotas
│   └── main.jsx         # ponto de entrada
├── index.html
├── package.json
└── README.md
```
