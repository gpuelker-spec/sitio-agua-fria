# DESIGN.md: Sítio Água Fria

Sistema visual do Laticínio Sítio Água Fria. Formato DESIGN.md: token, regra e porquê no mesmo arquivo, para que qualquer agente (Claude Design, Claude Code, outro modelo) tome a próxima decisão sem sair do sistema. O espelho navegável está no Design System "Sítio Água Fria" no Claude.

Mesmo papel do `AGENTS.md`, mas para o **visual**: `AGENTS.md` diz como construir, este arquivo diz como deve parecer.

**De onde vem:** a marca real da pasta `marketing-comercial` (logo, selo, guia de design dos rótulos e as cores Pantone de cada produto). O site não inventa identidade; ele leva os rótulos para a web.

---

## 1. Tema visual e atmosfera

**Rústico contemporâneo, com a cara dos rótulos.** Papel cor de soro, tinta azul-noite, as três ondas turquesa do logo e títulos em slab com tinta gasta, como um rótulo impresso no sítio. O rústico vem da **matéria** (papel, tinta falhada, carimbo, fita "produto artesanal"); o moderno vem da **estrutura** (grid editorial assimétrico, tipografia grande, muito respiro, movimento ligado à rolagem).

- Contraste é a ideia central: slab pesada em caixa alta × grotesca limpa; papel claro × faixas `noite`; uma cor de produto por vez sobre o escuro.
- Densidade baixa. Uma ideia por tela.
- Nada de brilho, vidro, gradiente roxo, emoji ou card com borda colorida à esquerda.

**Motivos (da marca, em traço):**

| Motivo | Forma | Onde |
|---|---|---|
| Água corrente | 3 ondas paralelas turquesa (as do logo) | Divisores, marcador de lista, rodapé |
| Horizonte | Linha longa + sol nascendo | Herói e chamada final (o sol sobe com a rolagem) |
| Carimbo | Anel com texto em volta + selo A2A2 no centro | Herói; gira só com a rolagem |
| Disco do rótulo | Círculo na cor Pantone do produto | Cards de produto |
| Fita | Faixa "PRODUTO ARTESANAL" | Base dos cards |
| Genética (FIV) | Grade de pequenos círculos, poucos preenchidos | Bloco de genética |

## 2. Paleta e papéis

### Base

| Token | Hex | Papel |
|---|---|---|
| `soro` | `#F3ECDF` | Fundo da página (papel). |
| `coalho` | `#FAF6EE` | Superfície elevada: mapa, campos. |
| `noite` | `#020111` | Cor do logo e fundo dos rótulos de queijo. Texto principal, faixas escuras, rodapé, botão principal. |
| `grafite` | `#231F20` | Fundo dos rótulos de pote (iogurte, requeijão, doce). |
| `tinta` | `#4B4F5E` | Texto secundário em `soro`/`coalho`. |
| `linha` | `#02011124` | Fios de 1px. |
| `turquesa` | `#30B2C1` | Ondas do logo. **Em chão escuro** (texto, ênfase) ou como preenchimento (botão flutuante, `botao-claro`). |
| `turquesa-texto` | `#17707F` | Turquesa para links e texto pequeno em papel. |
| `nascente` | `#2094A8` | Ênfase (`em`) em papel. |
| `ambar` | `#FBAF40` | Cor quente da linha curada. |

### Cor do produto (Pantone dos rótulos)

Cada card ou etiqueta recebe **uma** cor via `style="--produto: #HEX"`. Nunca misture duas cores de produto no mesmo card.

| Produto | Hex |
|---|---|
| Remanso, Horizonte, Horizontinho, Requeijão, Manteiga | `#FBAF40` |
| Nascente | `#2094A8` |
| Minas | `#73CEE1` |
| Iogurte natural | `#30B2C1` |
| Iogurte de morango | `#EEA591` |
| Poente | `#8ECC90` |
| Garoa | `#8ECC90` (cor ainda em definição nos rótulos) |
| Brisa | `#A776A5` |
| Doce de leite | `#BB7727` |
| Coalho | `#EABD29` (cor ainda em definição nos rótulos) |

Regras: em papel, só `noite` e `tinta` carregam texto. Turquesa claro nunca é texto pequeno em `soro`; use `turquesa-texto`.

## 3. Tipografia

As fontes dos rótulos são comerciais; o site usa substitutas livres do Google Fonts com o mesmo desenho.

| Família | Fonte | No rótulo | Uso |
|---|---|---|---|
| `display` | **Roboto Slab** 400–900 | Nexa Rust Slab Black | Títulos. `display-xl`/`display-l` em 900, caixa alta. Com a classe `ferrugem`, ganham a tinta gasta. |
| `texto` | **Work Sans** 400/500/600 | — | Parágrafos, botões, navegação. |
| `lote` | **Barlow Condensed** 500–700 | Matahari Condensed | Kicker, tipo do queijo, fita, metadados. Caixa alta, espaçamento +0.1em. |

| Estilo | Família | Tamanho / altura | Peso |
|---|---|---|---|
| `display-xl` | display | clamp(48px, 8.2vw, 116px) / 0.92, caixa alta | 900 |
| `display-l` | display | clamp(36px, 5.2vw, 72px) / 0.96, caixa alta | 900 |
| `titulo` | display | clamp(30px, 3.4vw, 46px) / 1.05 | 800 |
| `subtitulo` | display | 22px / 1.15 | 700 |
| `corpo-l` | texto | 19px / 1.6 | 400 |
| `corpo` | texto | 16px / 1.65 | 400 |
| `lote` | lote | 15px / 1.2, caixa alta, +0.1em | 600 |

**Ênfase:** a palavra de destaque vai em `<em>`, **sem itálico**: muda só a cor (`nascente` em papel, `turquesa` no escuro).

**Ferrugem:** máscara de ruído (`--ferrugem` em `site.css`) que falha a tinta dos títulos, como a Nexa Rust. Sutil: o título tem que continuar 100% legível. Não use em texto corrido.

## 4. Componentes

- **Logo:** `logo-sitio.png` no menu (60px de altura, 44px no celular). `logo-selo.jpg` no rodapé. Não redesenhar, não recolorir.
- **Botão principal (`.botao`):** fundo `noite`, texto `soro`, `radius-pill`, 14px × 22px, Work Sans 600. Pressionado: `scale(0.97)`. Variante `.botao-claro`: fundo `turquesa`, texto `noite`, para chão escuro.
- **Link de ação:** texto `noite` com sublinhado de 1px e seta →. A seta anda 3px no hover.
- **Rótulo de queijo (`.queijo`):** o card é um mini-rótulo. Disco na cor `--produto` em cima; faixa `noite` com o lockup "·Sítio· Água Fria", nome em slab 900 caixa alta (com `ferrugem`), tipo em `lote` na cor do produto; fita "Produto artesanal" na base.
- **Etiqueta de pote (`.etiquetas li`):** fita na cor `--produto` do rótulo, texto `grafite` em `lote` caixa alta, cantos retos.
- **Carimbo:** anel de texto em `lote` ("REBANHO 100% A2A2 · LEITE DO PRÓPRIO SÍTIO") com o selo `a2a2.png` no centro. Gira com a rolagem, nunca sozinho.
- **Ondas (`.ondas`):** 3 traços turquesa paralelos; `.ondas-grande` como divisor de seção.
- **Faixa escura:** chão `noite`, texto `soro`, ênfase `turquesa`, raio 0 nas bordas da tela.

## 5. Layout

- Grid de 12 colunas, largura máx. 1240px, calha `clamp(20px, 5vw, 72px)`.
- **Assimetria**: título ocupa 7–8 colunas, texto de apoio em 4, deslocado. Evite tudo centralizado.
- Espaçamento (4 em 4): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Seções separadas por 72–128px.
- Fotos em moldura de **arco** (topo arredondado `radius-arco`) ou retângulo com `radius-md`. Nunca círculo de avatar.

## 6. Profundidade e elevação

- **Fios, não sombras.** Separação por `linha` de 1px.
- Uma única sombra, `papel`, para o que flutua (botão flutuante, rótulo de seção): `0 1px 0 #02011114, 0 18px 40px -24px #02011166`.
- Textura de papel: ruído muito sutil (opacidade ≤ 0.05) no fundo `soro`.

## 7. Faça e não faça

**Faça**
- Use os nomes da paisagem (Nascente, Horizonte…) e a cor Pantone de cada rótulo como identidade dos produtos.
- Use dados reais em `lote` (SISP 1774, desde 2017, A2A2) como textura gráfica.
- Mantenha o tom do posicionamento: luz natural nas fotos, preto + turquesa, ondas.

**Não faça**
- Gradiente roxo/azul, glassmorphism, neon, emoji, ícones genéricos de stock.
- Ilustrações "fofinhas" de vaca. A vaca aparece por foto ou nem aparece.
- Animação em loop para chamar atenção (pulsar, girar sozinho, marquee infinito).
- Promessas de saúde no texto (ver posicionamento da marca).
- Duas cores de produto no mesmo card; turquesa claro como texto pequeno no papel.

## 8. Comportamento responsivo

- Celular primeiro: 390px. Quebras em 720px e 1080px.
- Toque mínimo de 44px. O botão flutuante de pedido fica no canto inferior direito.
- No celular o grid vira uma coluna; os títulos `display-xl` descem para 48px; fotos em arco ocupam a largura toda; os rótulos de queijo ficam em 2 colunas.

## 9. Guia de prompt para agentes

- "Nova seção no estilo Sítio Água Fria: papel `soro`, título Roboto Slab 900 caixa alta com `ferrugem` e uma palavra em `<em>` (cor `nascente`), kicker em Barlow Condensed caixa alta, ondas turquesa como divisor, layout assimétrico."
- "Card de produto: rótulo `.queijo` com `--produto` na cor Pantone do rótulo, faixa `noite`, nome em slab, tipo em `lote`, fita 'Produto artesanal'."
- "Faixa escura de destaque: chão `noite`, texto `soro`, ênfase `turquesa`, horizonte em traço."
- Movimento: siga `AGENTS.md` → seção Movimento (motion-principles; sempre com `prefers-reduced-motion`).
