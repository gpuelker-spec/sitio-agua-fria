# DESIGN.md: Sítio Água Fria

Sistema visual do site do Laticínio Sítio Água Fria. Aqui ficam o token, a regra e o porquê, para que qualquer pessoa ou agente de IA tome a próxima decisão visual sem sair do sistema.

`AGENTS.md` diz **como trabalhar e onde mexer**. Este arquivo diz **como deve parecer**.

**De onde vem:** do logo oficial (preto + turquesa, três ondas), dos rótulos das embalagens (uma cor Pantone por produto) e das fotos reais do sítio. O site não inventa identidade: ele mostra o que já existe.

---

## 1. Direção: "Luz do pasto"

**Claro, fotográfico e editorial.** O site abre com a foto real do rebanho no pasto. Os títulos são grandes, em serifa fina, com uma palavra em itálico turquesa. Há muito espaço em branco e uma ideia por tela.

- **A foto é a protagonista.** O site anterior falava de pasto e de vacas sem mostrar nenhuma. Agora a foto vem antes do enfeite.
- **O texto conduz.** Tipografia grande no lugar de ilustração, ícone ou efeito.
- **A cor do rótulo é detalhe**, não fundo: uma bolinha ao lado do nome do queijo e o disco de quem ainda não tem foto.
- **Uma faixa escura só**, no fim (contato e rodapé), que é onde o logo oficial em fundo preto aparece.

Motivos da marca usados:

| Motivo | Forma | Onde |
|---|---|---|
| Três ondas | Traço turquesa, as mesmas do logo | Chamada do topo, faixa de fatos, Onde comprar |
| Selo em medalha | Selo oficial num disco claro com fio e sombra leve | Sobre a foto do topo e na seção de história |
| Disco do rótulo | Círculo na cor Pantone do produto, com as ondas em baixo-relevo | Produto que ainda não tem foto |
| Queijo com as ondas | Foto real da casca com as três ondas gravadas | Abertura da seção de queijos |

## 2. Cores

Todas estão em [`estilo/1-tokens.css`](estilo/1-tokens.css). Use sempre a variável, nunca a cor solta.

| Token | Hex | Papel |
|---|---|---|
| `--leite` | `#FBF8F1` | Fundo da página. |
| `--nata` | `#F1EBDD` | Faixas alternadas (rebanho, outros produtos) e fundo de foto. |
| `--noite` | `#020111` | Preto do logo: texto, botão principal, faixa de contato e rodapé. |
| `--tinta` | `#474A59` | Texto secundário em fundo claro. |
| `--linha` | `#02011122` | Fios de 1px. |
| `--agua` | `#30B2C1` | Turquesa do logo: ondas, botão em fundo escuro, botão flutuante. |
| `--agua-funda` | `#0F6B7A` | Turquesa para **texto** em fundo claro (destaque dos títulos, chamadas). |
| `--ambar` | `#FBAF40` | Só a etiqueta "Novo". |
| `--nevoa` | `#C9CCD9` | Texto secundário em fundo escuro. |

**Contraste (AA):** em fundo claro, texto só em `--noite`, `--tinta` ou `--agua-funda`. O turquesa claro `--agua` **nunca** é texto em fundo claro (não passa no contraste); lá ele é só traço. Em fundo escuro, texto em `--leite`, `--nevoa` ou `--agua`.

### Cor de cada produto

Vem do rótulo da embalagem e fica em [`conteudo/produtos.json`](conteudo/produtos.json) (campo `cor`). O cartão recebe a cor pela variável `--produto`. Nunca use duas cores de produto no mesmo cartão.

| Produto | Hex |
|---|---|
| Remanso, Horizonte, Horizontinho, Requeijão, Manteiga | `#FBAF40` |
| Nascente | `#2094A8` |
| Poente, Garoa | `#8ECC90` |
| Brisa | `#A776A5` |
| Coalho | `#EABD29` (a confirmar: ver `PENDENCIAS.md`) |
| Iogurte natural | `#30B2C1` |
| Iogurte de morango | `#EEA591` |
| Doce de leite | `#BB7727` |
| Sour cream | `#CFE2F4` |

## 3. Tipografia

Duas famílias, hospedadas no próprio site em `fontes/` (sem Google Fonts externo: mais rápido e sem enviar dados do visitante a terceiros). Licença livre (OFL), cópias em `fontes/LICENCA-*.txt`.

| Família | Fonte | Uso |
|---|---|---|
| `--fonte-titulo` | **Fraunces** (variável, 100 a 900, normal e itálico) | Títulos, nomes de produto, menu do celular. |
| `--fonte-texto` | **Figtree** (variável, 300 a 900) | Parágrafos, botões, chamadas, rótulos. |

A Fraunces do site é a versão de tamanho grande (traço fino e contrastado). Por isso:

- **Títulos grandes** usam peso leve: 370 a 400.
- **Títulos pequenos** (abaixo de 30px: subtítulos, nomes de produto) usam peso 500 a 560, senão o traço fica fino demais.

| Estilo | Tamanho / altura | Peso |
|---|---|---|
| `h1` | `clamp(44px, 7.6vw + 14px, 116px)` / 0.96 | 370 |
| `.titulo` | `clamp(34px, 3.6vw + 18px, 62px)` / 1.02 | 380 |
| `.titulo-longo` | `clamp(30px, 2.4vw + 18px, 50px)` / 1.07 | 380 |
| `.subtitulo` | 24px / 1.15 | 540 |
| `.produto-nome` | 23px / 1.1 | 560 |
| texto | 17px / 1.6 | 400 |
| `.texto-g` | 18px / 1.6 | 400 |
| `.chamada` | 13px, maiúsculas, espaçamento 0.14em | 600 |

**Destaque:** em cada título, uma palavra ou trecho fica em itálico turquesa. No conteúdo isso se escreve com asteriscos: `"Onde *comprar*"`.

## 4. Componentes

Todos em [`estilo/3-componentes.css`](estilo/3-componentes.css).

- **Logo:** `marca/logo-sitio.webp` no cabeçalho (44px de altura no celular, 54px no computador). `marca/logo-selo.webp` no rodapé escuro. Não redesenhar nem recolorir.
- **Botão (`.botao`):** pílula, fundo `--noite`, texto `--leite`, mínimo 48px de altura. Variante `.botao-claro` (fundo `--agua`, texto `--noite`) só em fundo escuro. `.botao-pequeno` no menu.
- **Link de ação (`.link-seta`):** texto sublinhado com seta →. A seta anda 3px ao passar o mouse.
- **Chamada (`.chamada`):** a linha pequena em maiúsculas acima de cada título.
- **Foto (`.foto`):** cantos de 28px, sempre recortada com `object-fit: cover`. Legenda opcional em pílula clara no canto inferior esquerdo (`.legenda`).
- **Selo em medalha (`.selo-medalha`):** disco `--leite` com o selo oficial dentro. O selo A2A2 tem baixa resolução: nunca mostrar com mais de 150px de largura.
- **Cartão de queijo (`.produto`):** foto real (ou disco), nome com a bolinha na cor do rótulo, tipo em maiúsculas, tempo de maturação e o link "Pedir", que abre o WhatsApp já com o nome do queijo.
- **Disco (`.disco`):** substitui a foto enquanto ela não existe. É honesto: não finge ser o produto.
- **Item (`.item`):** linha de "outros produtos" com miniatura de 84px, nome, tamanhos e "Pedir".
- **Etiqueta "Novo" (`.etiqueta-novo`):** pílula `--ambar`. Ligada pelo campo `"novo": true` do produto.
- **Botão flutuante (`#wa-float`):** canto inferior direito. Some enquanto outro botão de pedido está na tela.

## 5. Layout

- Celular primeiro (390px). Quebras em 760px, 900px e 1000px (menu em linha).
- Conteúdo com largura máxima de 1296px e margem lateral `--calha` (20 a 72px). Toda seção tem um `.miolo` por dentro.
- Seções separadas por `--espaco-secao` (64 a 128px). Fundos se alternam: `--leite`, `--nata`, e `--noite` só no fim.
- Composição assimétrica em duas colunas (5/7 ou 7/5): foto de um lado, texto do outro. Evite tudo centralizado.
- Grade de queijos: 2 colunas no celular, 3 no computador.
- Cantos: 18px (`--raio`) em cartões, 28px (`--raio-g`) em fotos grandes, pílula em botões.
- Profundidade: fios de 1px. Sombra só no que flutua (selo e botão flutuante).

## 6. Fotos

- **Só fotos reais do sítio.** Nada de banco de imagens nem de imagem gerada por IA.
- Preferir luz natural e o produto ou o lugar como é. Foto de celular vale.
- Sem rosto de pessoas sem autorização de quem aparece.
- Sem foto com preço à vista (cartazes de promoção).
- Cada foto tem texto alternativo em português em `conteudo/fotos.json`, descrevendo só o que aparece.
- Formatos AVIF e WebP, em mais de um tamanho. Só a foto do topo carrega com prioridade; as outras esperam a rolagem.

## 7. Movimento

Regras em [`estilo/5-movimento.css`](estilo/5-movimento.css) e em `AGENTS.md`.

- Discreto e só em CSS: blocos com a classe `.revela` sobem 28px e aparecem ao entrar na tela.
- **Nunca travar a rolagem.** Nada de capturar `wheel`, `touchmove` ou teclas.
- Quem pede menos movimento (`prefers-reduced-motion`) vê a página parada.
- O conteúdo nunca depende de animação nem de JavaScript para aparecer.
- Sem animação em loop (pulsar, girar, letreiro).

## 8. Faça e não faça

**Faça**
- Abra cada seção com uma chamada pequena e um título com uma palavra em destaque.
- Use os nomes da paisagem (Nascente, Poente, Remanso...) e a cor do rótulo como identidade de cada queijo.
- Mostre o produto real. Sem foto, use o disco e peça a foto (registre em `conteudo/pendencias.json`).
- Mantenha o botão de pedido sempre a um toque de distância.

**Não faça**
- Gradiente roxo ou azul, efeito de vidro, neon, emoji, ícone genérico de banco.
- Inter, Roboto ou Arial como fonte principal.
- Ilustração de vaca. A vaca aparece por foto.
- Turquesa claro (`--agua`) como texto em fundo claro.
- Seção inteira em fundo escuro além do contato e do rodapé.
- Preço, promessa de saúde ou qualquer informação ainda não confirmada (ver regras de conteúdo no `AGENTS.md`).

## 9. Guia de pedido para agentes

- "Nova seção no estilo Luz do pasto: fundo `--leite` ou `--nata`, `.chamada` em maiúsculas, `.titulo` em Fraunces com um trecho em `<em>`, foto real com cantos de 28px de um lado e texto do outro, textos vindos de `conteudo/site.json`."
- "Produto novo: um bloco em `conteudo/produtos.json` com `cor` do rótulo e `foto` (ou `null` para usar o disco). Não mexa no HTML."
- "Faixa escura: só para contato e rodapé. Fundo `--noite`, texto `--leite`, destaque `--agua`, botão `.botao-claro`."
