# AGENTS.md — Site do Sítio Água Fria

Instruções para **qualquer agente de IA (de qualquer modelo) ou pessoa** que trabalhe neste repositório. Leia este arquivo inteiro antes de mudar qualquer coisa.

## O projeto

- Site de uma página do **Laticínio Sítio Água Fria** (Pirambóia/SP): queijos de leite A2A2, inspeção SISP 1774.
- Dono e aprovador: **Gustavo Puelker** (`gpuelker-spec`). Ele é da área comercial e não programa: explique tudo em português simples, curto e com prints. Quando houver uma decisão, dê 2 ou 3 opções e diga qual você recomenda.
- Publicado com **GitHub Pages** a partir da branch `main`, pasta raiz. Site estático, sem servidor, custo zero.
- Site no ar: https://gpuelker-spec.github.io/sitio-agua-fria/
- **Fazer merge na `main` = fazer deploy.** O site atualiza sozinho 1–2 minutos depois.

## Como o site é montado (leia isto primeiro)

O conteúdo fica separado do visual. **Ninguém edita o `index.html` à mão**: ele é gerado.

```
conteudo/  (textos, produtos, fotos, perguntas)  ┐
modelo/    (estrutura HTML de cada seção)         ├─►  npm run montar  ─►  index.html, sitemap.xml,
estilo/    (visual em CSS)                        ┘                        robots.txt, PENDENCIAS.md
```

| Quero mudar... | Mexo em... |
|---|---|
| Um texto, telefone, link, título | `conteudo/site.json` |
| Um produto (nome, tipo, tamanho, cor, foto, "Novo") | `conteudo/produtos.json` |
| Uma foto ou o texto alternativo dela | `conteudo/fotos.json` + `npm run fotos` |
| Uma pergunta em aberto para o Gustavo | `conteudo/pendencias.json` |
| Cores, fontes, espaços | `estilo/1-tokens.css` (e o `DESIGN.md`) |
| A aparência de uma peça ou seção | `estilo/3-componentes.css`, `estilo/4-secoes.css` |
| A estrutura de uma seção, ou uma seção nova | `modelo/secoes.mjs` e `modelo/pagina.mjs` |
| O menu do celular e o botão flutuante | `site.js` |

Depois de qualquer mudança: **`npm run montar`** e faça commit do resultado junto. O CI recusa o PR se o `index.html` estiver diferente do que o comando gera.

### Estrutura dos arquivos

| Caminho | O que é |
|---|---|
| `conteudo/site.json` | Todos os textos do site, contatos, endereço, SEO e menu |
| `conteudo/produtos.json` | Queijos e outros produtos, na ordem em que aparecem |
| `conteudo/fotos.json` | Lista das fotos: arquivo original, texto alternativo, tamanhos, recorte |
| `conteudo/pendencias.json` | Perguntas em aberto para o Gustavo (gera o `PENDENCIAS.md`) |
| `modelo/pagina.mjs` | A página: `<head>`, SEO, dados estruturados e a ordem das seções |
| `modelo/secoes.mjs` | Uma função por seção, que devolve o HTML dela |
| `modelo/util.mjs` | Peças pequenas: foto, link de WhatsApp, ondas, disco |
| `estilo/1-tokens.css` … `5-movimento.css` | O visual. Entram na ordem do número e vão dentro do `index.html` |
| `scripts/montar.mjs` | Monta o site (`npm run montar`) |
| `scripts/fotos.mjs` | Gera as fotos leves em `img/` (`npm run fotos`) |
| `scripts/og.mjs` | Gera a imagem de prévia `og-image.jpg` (`npm run og`) |
| `scripts/prints.mjs` | Tira prints de cada seção (`npm run prints`) |
| `scripts/servir.mjs` | Servidor local (`npm run serve`) |
| `site.js` | Menu do celular, botão flutuante e carregamento do Sentry |
| `img/` | Fotos já convertidas (AVIF e WebP). `img/medidas.json` é gerado |
| `marca/` | Logos e selos oficiais (`.png` é o original, `.webp` é o que o site usa) e o ícone |
| `fontes/` | Fraunces e Figtree, hospedadas no próprio site, com as licenças |
| `src/sentry.js` → `sentry.min.js` | Monitoramento de erros. Ver "Observabilidade" |
| `index.html`, `sitemap.xml`, `robots.txt`, `PENDENCIAS.md` | **Gerados.** Não editar à mão |
| `DESIGN.md` | **Fonte da verdade do visual.** Leia antes de mudar qualquer coisa visual |
| `.nojekyll` | Impede o GitHub Pages de processar o site com Jekyll. Não remover |

## Receitas

### Trocar um texto
1. Ache o texto em `conteudo/site.json` (está organizado por seção: `topo`, `sobre`, `rebanho`, `queijos`...).
2. Troque. Para destacar um trecho de um título em itálico turquesa, ponha entre asteriscos: `"Onde *comprar*"`.
3. `npm run montar`, `npm test`, commit.

Os textos de `sobre` e do `topo` foram revisados pela família: **não reescreva sem perguntar ao Gustavo**.

### Adicionar, tirar ou mudar um produto
1. Em `conteudo/produtos.json`, copie um bloco parecido dentro de `queijos` ou de `outros` e ajuste. A ordem do arquivo é a ordem no site.
2. `cor` é a cor Pantone do rótulo, em hexadecimal. `foto` é o nome de uma foto de `conteudo/fotos.json`, ou `null` (aí aparece o disco na cor do rótulo).
3. Em `outros`, `"novo": true` mostra a etiqueta "Novo".
4. `npm run montar`, `npm test`, commit. Não precisa mexer em HTML nem em teste: o teste lê a lista de produtos do próprio arquivo.

### Adicionar ou trocar uma foto
1. Só **foto real do sítio**. Nada de banco de imagens nem de imagem gerada por IA. Sem rosto de pessoa sem autorização e sem preço à vista.
2. Em `conteudo/fotos.json`, crie uma entrada: `origem` (nome do arquivo original, ou um pedaço único do nome), `alt` (descrição em português do que aparece) e `larguras`. `recorte` e `foco` são opcionais.
3. Rode `npm run fotos -- "C:\caminho\da\pasta\com\as\originais" nome-da-foto`. Sai `img/nome-da-foto-<largura>.avif` e `.webp`.
4. Use o nome da foto no campo `foto` do produto ou da seção. `npm run montar`, `npm test`, commit.

As fotos originais (pesadas) **não entram no repositório**. O Gustavo guarda o banco de fotos no computador dele.

### Responder uma pendência
Quando o Gustavo responder a pergunta nº N do `PENDENCIAS.md`:
1. O próprio `PENDENCIAS.md` diz, em "Onde muda no site", quais campos dependem dela.
2. Nesses campos, troque `{ "valor": ..., "pendente": N }` pelo valor final, sem as chaves. Exemplo: `"cor": { "valor": "#EABD29", "pendente": 5 }` vira `"cor": "#73CEE1"`.
3. Apague o bloco da pergunta N em `conteudo/pendencias.json`.
4. `npm run montar` (o `PENDENCIAS.md` se atualiza sozinho), `npm test`, commit.

### Registrar uma dúvida nova (em vez de travar ou inventar)
1. **Nunca invente** informação e nunca pare o trabalho por causa dela.
2. Use a opção mais segura no campo, no formato `{ "valor": <opção segura>, "pendente": N }`. Se o seguro é não mostrar, use `"valor": null`.
3. Acrescente a pergunta em `conteudo/pendencias.json` com o número de `proximo_numero` (e aumente esse número). Escreva `titulo`, `pergunta`, `opcoes` e `enquanto_isso`.
4. O repositório é público: escreva de forma neutra, sem dado sensível.
5. `npm run montar` e liste as pendências novas no PR.

### Criar uma seção nova
1. Textos em um bloco novo de `conteudo/site.json`.
2. Função nova em `modelo/secoes.mjs` (copie uma parecida) e a chamada dela em `modelo/pagina.mjs`, na ordem certa.
3. Estilo no fim de `estilo/4-secoes.css`, usando os tokens e os componentes que já existem (veja o `DESIGN.md`).
4. Dê um `id` à seção, ponha o `id` na lista `SECOES` de `tests/e2e/conteudo.js` e, se for para o menu, em `menu` no `site.json`.
5. Escreva um teste em `tests/e2e/` para o comportamento novo.

## Regras de conteúdo (há teste automático para as quatro primeiras)

- **Sem preços.** Eles mudam com frequência e o pedido é feito pelo WhatsApp.
- **A2A2 sem alegação de saúde.** Nada de digestão, intolerância, digestibilidade, saúde. A2A2 **não** é "sem lactose".
- **Nada pendente à mostra.** `[A CONFIRMAR]`, campo vazio ou informação não confirmada nunca aparece para o visitante.
- **Na história, o endereço é só "Pirambóia/SP"** (sem rodovia nem km). O endereço completo fica em Onde comprar, no mapa e no rodapé.
- **SISP:** o site cita a inspeção SISP 1774 do laticínio. Não diga que a linha inteira é inspecionada e não ponha selo por produto sem o OK do Gustavo.
- **Sem entrega na cidade.** A linha de Piracicaba fica como está.
- **Fundação: 2017.** Não escreva sobre a história pessoal dos fundadores além do que já está no texto aprovado. Em caso de dúvida, pergunte ao Gustavo.
- **Não invente** prêmios, números de produção, depoimentos, descrições de sabor nem nomes de parceiros.
- **Visitas** só com agendamento. Não cite estrutura de visita que o Gustavo não confirmou.

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
- Use o template em `.github/pull_request_template.md`: o que mudou, como foi testado, prints antes/depois quando houver mudança visual (`npm run prints`).
- Liste no PR as pendências novas ou resolvidas.
- O PR só pode entrar com o **CI verde** (GitHub Actions). Se falhar, corrija na mesma branch.

### 4. Merge = deploy
- PR que **muda o site** só entra na `main` com OK explícito do Gustavo.
- PR que só muda documentação ou arquivos fora do site (`AGENTS.md`, `CLAUDE.md`, `.github/`) pode entrar quando o pedido do Gustavo já cobria aquela mudança.
- Prefira **squash merge**.
- Depois do merge: confirme que o site atualizou, que a Issue fechou e avise o Gustavo com o link.
- Para desfazer um deploy: abra uma Issue `correção` e um PR revertendo o commit. Não reescreva o histórico da `main`.

## Qualidade e testes (rodam sozinhos em todo PR)

| Comando | O que faz |
|---|---|
| `npm ci` | Instala as ferramentas (só na primeira vez) |
| `npm run montar` | Gera `index.html`, `sitemap.xml`, `robots.txt` e `PENDENCIAS.md` |
| `npm run montar:conferir` | Confere se os arquivos gerados estão em dia (os testes rodam este, em `tests/e2e/montagem.spec.js`) |
| `npm run serve` | Abre o site em http://localhost:4173 |
| `npm run lint` | Biome: lint e formatação de JS, CSS e JSON |
| `npm run format` | Biome corrige a formatação sozinho |
| `npm run knip` | Knip: dependências e arquivos não usados |
| `npm run commitlint` | Confere as mensagens de commit da branch |
| `npx playwright install chromium` | Baixa o navegador de teste (só na primeira vez) |
| `npm test` | Playwright: testes no computador (1280px) e no celular (Pixel 7) |
| `npm run prints` | Prints de cada seção em 1440px e 390px, na pasta `prints/` |
| `npm run og` | Refaz a imagem de prévia de compartilhamento |
| `npm run fotos -- "pasta"` | Gera as fotos leves a partir das originais |

Tudo roda só com Node. **Não dependa de Docker, WSL nem Python**: o Gustavo usa Windows sem eles.

**Toda mudança no site precisa de teste em `tests/e2e/`** cobrindo o novo comportamento. Os testes não podem depender de sites externos (o mapa do Google é bloqueado neles).

**Meta de velocidade:** Lighthouse ≥ 90 em desempenho e em acessibilidade no celular. Se mexer em foto do topo, fonte ou JavaScript, meça de novo.

## Movimento

- **Nunca bloqueie a rolagem.** Não capture `wheel`, `touchmove` nem teclas. Isso já quebrou o site uma vez (Issue #17) e há teste para garantir.
- O movimento é só CSS (`estilo/5-movimento.css`): bloco com a classe `revela` aparece de leve ao entrar na tela, onde o navegador suporta.
- Tudo fica dentro de `prefers-reduced-motion: no-preference`.
- **O conteúdo nunca depende de animação nem de JavaScript para aparecer** (há teste com JavaScript desligado).
- Anime só `opacity`, `translate` e `scale`. Nada de animação em loop.

## Acessibilidade

- Contraste AA: veja a regra das cores no `DESIGN.md` (turquesa claro nunca é texto em fundo claro).
- Toda imagem tem `alt` em português (em `conteudo/fotos.json`). Enfeite leva `aria-hidden`.
- Tudo funciona pelo teclado; o foco é sempre visível. Alvo de toque de no mínimo 44px.
- O menu do celular usa `popover` nativo do navegador.

## Observabilidade (Sentry)

- Erros de JavaScript dos visitantes vão para o Sentry (plano gratuito). Código em `src/sentry.js`; o navegador carrega `sentry.min.js`, gerado por `npm run build:sentry`. **Nunca edite `sentry.min.js` à mão.** O CI falha se ele estiver desatualizado.
- O `site.js` carrega o Sentry só depois que a página terminou de carregar, para não atrasar a foto do topo.
- Só ativa no site publicado (`*.github.io` ou o domínio próprio). Em `localhost` e nos testes nada é enviado.
- LGPD: `sendDefaultPii: false`, sem gravação de sessão e sem medição de desempenho.
- Teste manual: abra o site publicado com `#teste-sentry` no fim do endereço e confira o erro no painel do Sentry.

## SEO e compartilhamento

- O `<head>` sai de `conteudo/site.json` (bloco `seo`) por `modelo/pagina.mjs`: título, descrição, `canonical`, Open Graph e dados estruturados `LocalBusiness` com a lista de produtos.
- Imagem de prévia: `og-image.jpg` (1200×630), gerada por `npm run og`.
- Atualize o campo `atualizado` de `site.json` quando o conteúdo mudar (vira o `lastmod` do sitemap).
- Telefone, endereço e Instagram vêm de um lugar só (`site.json`), então batem entre texto, links e dados estruturados.

### Domínio próprio (ainda NÃO configurado)
O domínio `sitioaguafria.com.br` ainda não foi registrado. **Não mexa em DNS nem crie arquivo `CNAME` até o Gustavo avisar.** Quando ele avisar:
1. Troque `url` em `conteudo/site.json`.
2. Inclua o domínio na regex `PRODUCAO` de `src/sentry.js` e rode `npm run build:sentry`.
3. Ajuste o endereço simulado no teste do Sentry em `tests/e2e/site.spec.js`.
4. `npm run montar`, `npm test`.

## Nunca coloque neste repositório (ele é público)

- Planilhas de preços, fichas técnicas, custos ou dados de clientes.
- CPF, CNPJ, senhas, tokens ou chaves de API.
- Fotos de pessoas sem autorização.
- Fotos originais pesadas (só o resultado em `img/`).

## Fonte da verdade

A versão oficial do site é a deste repositório. O visual de referência é o `DESIGN.md`. O editor visual antigo do Claude Design e a pasta `site\` do computador do Gustavo estão desatualizados: não publique a partir deles.
