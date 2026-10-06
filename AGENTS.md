# AGENTS.md — Site do Sítio Água Fria

Instruções para **qualquer agente de IA (de qualquer modelo) ou pessoa** que trabalhe neste repositório. Leia este arquivo inteiro antes de mudar qualquer coisa.

## O projeto

- Landing page do **Laticínio Sítio Água Fria** (Pirambóia/SP): queijos de leite A2A2, inspeção SISP 1774.
- Dono e aprovador: **Gustavo Puelker** (`gpuelker-spec`). Ele não programa: explique tudo em português, de forma simples.
- Publicado com **GitHub Pages** a partir da branch `main`, pasta raiz.
- Site no ar: https://gpuelker-spec.github.io/sitio-agua-fria/
- **Fazer merge na `main` = fazer deploy.** O site atualiza sozinho 1–2 minutos depois.

## Regra principal: toda tarefa vira Issue, toda mudança entra por PR

```
Pedido do Gustavo → Issue → branch → commits → Pull Request (cita a Issue) → OK do Gustavo → merge = deploy → Issue fechada
```

### 1. Issue antes de qualquer trabalho
- Toda tarefa ganha uma Issue **antes** de começar, mesmo as pequenas.
- Antes de criar, procure se já existe Issue aberta para o mesmo assunto. Se existir, use a existente.
- Use exatamente **um** destes tipos (label):

| Label | Quando usar | Prefixo da branch |
|---|---|---|
| `correção` | Algo quebrado ou errado (texto, link, imagem, layout) | `fix/` |
| `melhoria` | Ajuste ou aprimoramento de algo que já existe | `melhoria/` |
| `nova função` | Seção ou funcionalidade que ainda não existe | `feat/` |

- Label extra `aguardando informação` quando a tarefa depende de dado ou material do Gustavo (fotos, textos, links, endereços). Liste na Issue exatamente o que falta.
- Corpo da Issue: **Objetivo/Contexto** + checklist de **critérios de aceite**.
- Escreva título e corpo em português.

### 2. Branch
- Nunca faça commit direto na `main`.
- Nome: `<prefixo>/<número-da-issue>-<descrição-curta>`. Ex.: `feat/3-depoimentos`, `fix/2-posicao-mapa`.
- Uma branch e um PR por Issue.

### Commits (Conventional Commits, verificado pelo Commitlint)
- Formato: `<tipo>: <descrição em português>`, até 100 caracteres. Ex.: `feat: adiciona seção de depoimentos (#3)`.
- Tipos: `feat` (nova função), `fix` (correção), `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- Cite a Issue no fim da mensagem quando fizer sentido: `(#N)`.

### 3. Pull Request
- Título claro em português.
- Descrição **obrigatoriamente** menciona a Issue com palavra de fechamento: `Closes #N` (ou `Fixes #N`). Isso fecha a Issue automaticamente no merge.
- Use o template em `.github/pull_request_template.md`: o que mudou, como foi testado, prints antes/depois quando houver mudança visual.
- Se a mudança afeta o site, teste antes de abrir o PR: a página carrega, sem erro no console, em largura de computador (~1280px) **e** de celular (~390px).

- O PR só pode entrar com o **CI verde** (GitHub Actions). Se falhar, corrija na mesma branch.

### 4. Merge = deploy
- PR que **muda o site** só entra na `main` com OK explícito do Gustavo.
- PR que só muda documentação ou arquivos fora do site (`AGENTS.md`, `CLAUDE.md`, `.github/`) pode entrar quando o pedido do Gustavo já cobria aquela mudança.
- Prefira **squash merge**.
- Depois do merge: confirme que o site atualizou, que a Issue fechou e avise o Gustavo com o link.
- Para desfazer um deploy: abra uma Issue `correção` e um PR revertendo o commit. Não reescreva o histórico da `main`.

## Estrutura dos arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | A página inteira. Template "dc" vindo do Claude Design: HTML normal dentro de `<x-dc>`, com estilos inline e variáveis CSS `--color-*` |
| `support.js` | Motor que renderiza o template. **Não editar** (gerado) |
| `react*.production.min.js` | React 18.3.1 hospedado localmente (o `window.__resources` no `<head>` aponta para eles). Não trocar por CDN |
| `ds-styles.css`, `ds-bundle.js` | Design system base (fontes, botões `.btn`). Evitar editar |
| `*.jpg`, `*.png` | Fotos e selos usados na página |
| `package.json`, `biome.json`, `knip.json`, `commitlint.config.mjs` | Ferramentas de qualidade (não fazem parte do site publicado) |
| `src/sentry.js` → `sentry.min.js` | Monitoramento de erros (Sentry). Ver seção "Observabilidade" |
| `.nojekyll` | Impede o GitHub Pages de processar o site com Jekyll. Não remover |

### Cuidados ao editar `index.html`
- Mantenha o padrão visual: fundo escuro, `var(--color-*)`, cantos arredondados (36px/56px), `font-family: var(--font-heading)` nos títulos, rótulos em caixa alta pequenos acima dos títulos.
- Não use `{{ }}` em texto: é sintaxe do template.
- Seções com `data-secao="Nome"` disparam a animação de "corte de queijo". Só adicione o atributo se quiser essa transição.
- Links de WhatsApp usam a mensagem pronta: `https://wa.me/5514981715427?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20quero%20fazer%20um%20pedido.`

## Qualidade e testes (rodam sozinhos em todo PR)
| Comando | O que faz |
|---|---|
| `npm ci` | Instala as ferramentas (só na primeira vez) |
| `npm run lint` | Biome: lint + formatação de `motion.*`, testes e configs (arquivos gerados ficam de fora) |
| `npm run format` | Biome corrige formatação automaticamente |
| `npm run knip` | Knip: dependências e arquivos não usados |
| `npm run commitlint` | Confere as mensagens de commit da branch |
| `npx playwright install chromium` | Baixa o navegador de teste (só na primeira vez) |
| `npm test` | Playwright: testes end-to-end no computador (1280px) e no celular (Pixel 7) |

Configuração: `biome.json`, `commitlint.config.mjs`, `knip.json`, `playwright.config.js`, `.github/workflows/`.

**Toda mudança no site precisa de teste em `tests/e2e/`** cobrindo o novo comportamento (seção nova, link novo, animação nova). Os testes não podem depender de sites externos (Google Maps, Google Fonts).

## Observabilidade (Sentry)
- Erros de JavaScript dos visitantes vão para o Sentry (plano gratuito Developer). Código em `src/sentry.js`; o navegador carrega `sentry.min.js`, gerado por `npm run build:sentry`. **Nunca edite `sentry.min.js` à mão.** O CI falha se ele estiver desatualizado.
- Só ativa no site publicado (`*.github.io` ou o domínio próprio). Em `localhost` e nos testes nada é enviado.
- LGPD: `sendDefaultPii: false`, sem Session Replay e sem medição de desempenho.
- Teste manual: abra o site publicado com `#teste-sentry` no fim do endereço e confira o erro no painel do Sentry.
- Ao adicionar um domínio próprio, inclua-o na regex `PRODUCAO` de `src/sentry.js`.

## Nunca coloque neste repositório (ele é público)
- Planilhas de preços, fichas técnicas, custos ou dados de clientes.
- Senhas, tokens ou chaves de API.
- Fotos de pessoas sem autorização.

## Fonte da verdade
A versão oficial do site é a deste repositório. O editor visual antigo do Claude Design **está desatualizado**: não publique a partir dele.
