# DESIGN.md: Sítio Água Fria

Sistema visual do Laticínio Sítio Água Fria. Formato DESIGN.md: token, regra e porquê no mesmo arquivo, para que qualquer agente (Claude Design, Claude Code, outro modelo) tome a próxima decisão sem sair do sistema. O espelho navegável está no Design System "Sítio Água Fria" no Claude.

Mesmo papel do `AGENTS.md`, mas para o **visual**: `AGENTS.md` diz como construir, este arquivo diz como deve parecer.

---

## 1. Tema visual e atmosfera

**Rústico contemporâneo.** Um caderno de campo bem diagramado: papel cor de soro, tinta de carvão, carimbos de lote, desenhos em traço fino de porteira, horizonte e água correndo. O rústico vem da **matéria** (papel, carimbo, traço à mão, casca de queijo); o moderno vem da **estrutura** (grid editorial assimétrico, tipografia grande, muito respiro, movimento ligado à rolagem).

- Contraste é a ideia central: serifa expressiva × grotesca limpa; papel claro × faixas escuras de pasto; traço fino × blocos sólidos.
- Densidade baixa. Uma ideia por tela.
- Nada de brilho, vidro, gradiente roxo, emoji ou card com borda colorida à esquerda.

**Motivos (só em traço, nunca ilustração figurativa detalhada):**

| Motivo | Forma | Onde |
|---|---|---|
| Porteira | 3 travessas horizontais + 1 diagonal | Divisores de seção, marca de lista |
| Água corrente | 3 ondas paralelas (as mesmas do logo) | Rodapé, separador do mapa |
| Horizonte | Linha longa + arco de sol nascente | Herói e chamada final |
| Roda de queijo | Círculo com texto em volta (carimbo) | Selos A2A2, SISP, lote |
| Genética (FIV) | Grade de pequenos círculos, poucos preenchidos | Bloco de genética |
| Paisagem dos nomes | Glifo por queijo: Nascente (meio-sol subindo), Poente (meio-sol descendo), Remanso (linhas d'água paradas), Garoa (pontos), Brisa (linhas de vento), Horizonte (linha), Horizontinho (linha curta), Coalho (roda) | Cards de produto |

## 2. Paleta e papéis

Tema principal **dia** (papel claro). As faixas escuras usam `pasto` ou `carvao` como chão.

| Token | Hex | Papel |
|---|---|---|
| `soro` | `#F3ECDF` | Fundo da página (papel). |
| `coalho` | `#FAF6EE` | Superfície elevada: cards, mapa, campos. |
| `feno` | `#E7D3A8` | Etiquetas de papel kraft (tags de produto). Texto só `carvao`/`pasto`. |
| `carvao` | `#1F1A14` | Texto principal; chão de faixas escuras. 14.7:1 em `soro`. |
| `tinta` | `#5E5447` | Texto secundário em `soro`/`coalho` (6.3:1). |
| `linha` | `#1F1A1429` | Fios de 1px (bordas, divisores, traços). |
| `casca` | `#B9772A` | Cor da marca (casca de queijo curado). **Só preenchimento, traço, ícone ou texto ≥24px** (3.1:1 em `soro`). |
| `casca-texto` | `#8A5418` | Casca para texto pequeno em `soro`/`coalho` (5.3:1). |
| `pasto` | `#263A24` | Botão principal, faixas escuras. Texto `soro` em cima (10.4:1). |
| `terra` | `#5A3E2B` | Detalhes: porteira, glifos. |
| `agua` | `#2E6F7E` | Links e água em `soro` (4.8:1). |
| `nascente` | `#2AD4F2` | Ciano do logo. **Só em chão escuro** (`pasto` 6.9:1, `carvao` 9.7:1). Nunca em `soro`. |

Regras: no máximo **uma** cor quente (`casca`) e **uma** fria (`agua`/`nascente`) por tela. Verde `pasto` é estrutura, não enfeite.

## 3. Tipografia

| Família | Fonte (Google Fonts) | Uso |
|---|---|---|
| `display` | **Fraunces**, eixos `opsz` alto, `SOFT 100`, `WONK 1` | Títulos. A serifa "macia e torta" é o rústico. Itálico para a palavra de ênfase. |
| `texto` | **Work Sans** 400/500/600 | Parágrafos, botões, navegação. |
| `lote` | **IBM Plex Mono** 500 | Rótulos de lote, kicker, metadados ("LOTE 0214 · MATURAÇÃO 12 MESES"). Sempre caixa alta, espaçamento +0.12em. |

| Estilo | Família | Tamanho / altura | Peso |
|---|---|---|---|
| `display-xl` | display | clamp(56px, 9vw, 128px) / 0.92 | 380 |
| `display-l` | display | clamp(40px, 5.6vw, 76px) / 0.98 | 400 |
| `titulo` | display | clamp(30px, 3.6vw, 48px) / 1.04 | 420 |
| `subtitulo` | display | 24px / 1.15 | 500 |
| `corpo-l` | texto | 19px / 1.6 | 400 |
| `corpo` | texto | 16px / 1.65 | 400 |
| `lote` | lote | 12px / 1.2, caixa alta, +0.12em | 500 |

Não use Inter, Roboto ou system-ui como identidade.

## 4. Componentes

- **Botão principal:** fundo `pasto`, texto `soro`, `radius-pill`, 14px × 22px, Work Sans 600. Ícone à esquerda opcional. Pressionado: `scale(0.97)`.
- **Link de ação:** texto `carvao` com sublinhado de 1px em `casca` e seta →. A seta anda 3px no hover.
- **Rótulo de queijo (card de produto):** fundo `coalho`, borda `linha`, `radius-md`. Em cima, o glifo da paisagem em traço `terra`. Embaixo, tipo em `lote` e nome em `subtitulo`. Sem sombra colorida.
- **Etiqueta kraft:** fundo `feno`, texto `carvao`, `radius-sm`, furo de etiqueta (círculo 6px `soro`) à esquerda.
- **Carimbo (selo):** círculo de 1.5px `casca` ou `carvao`, texto em `lote` correndo pela borda, centro com sigla (A2A2, SISP). Pode girar com a rolagem, nunca sozinho.
- **Divisor porteira:** 3 fios horizontais de 1px `linha` + 1 diagonal, 64–120px de largura.
- **Faixa escura:** chão `pasto` ou `carvao`, texto `soro`, destaque `nascente`, raio 0 nas bordas da tela.

## 5. Layout

- Grid de 12 colunas, largura máx. 1240px, calha `clamp(20px, 5vw, 72px)`.
- **Assimetria**: título ocupa 7–8 colunas, texto de apoio em 4, deslocado. Evite tudo centralizado.
- Espaçamento (4 em 4): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Seções separadas por 96–128px.
- Fotos em moldura de **arco** (janela de galpão: topo arredondado `radius-arco`) ou retângulo reto. Nunca círculo de avatar.

## 6. Profundidade e elevação

- **Fios, não sombras.** Separação por `linha` de 1px.
- Uma única sombra, `papel`, para o que flutua (botão flutuante, rótulo de seção): `0 1px 0 #1F1A1414, 0 18px 40px -24px #1F1A1459`.
- Textura de papel: ruído muito sutil (opacidade ≤ 0.05) no fundo `soro`.

## 7. Faça e não faça

**Faça**
- Use os nomes da paisagem (Nascente, Horizonte…) como identidade visual dos produtos.
- Use dados reais em `lote` (SISP 1774, desde 2017, A2A2) como textura gráfica.
- Deixe uma palavra do título em itálico para dar voz ("Queijo de leite *100% A2A2*").

**Não faça**
- Gradiente roxo/azul, glassmorphism, neon, emoji, ícones genéricos de stock.
- Ilustrações "fofinhas" de vaca. A vaca aparece por foto ou nem aparece.
- Animação em loop para chamar atenção (pulsar, girar sozinho, marquee infinito).
- `nascente` em fundo claro; `casca` em texto pequeno.

## 8. Comportamento responsivo

- Celular primeiro: 390px. Quebras em 720px e 1080px.
- Toque mínimo de 44px. O botão flutuante de pedido fica no canto inferior direito.
- No celular o grid vira uma coluna; os títulos `display-xl` descem para 56px; fotos em arco ocupam a largura toda.

## 9. Guia de prompt para agentes

- "Nova seção no estilo Sítio Água Fria: papel `soro`, título Fraunces com uma palavra em itálico, kicker em IBM Plex Mono caixa alta, um motivo em traço (porteira, onda ou horizonte), layout assimétrico."
- "Card de produto: rótulo de queijo com glifo da paisagem do nome, tipo em `lote`, nome em `subtitulo`, fundo `coalho`."
- "Faixa escura de destaque: chão `pasto`, texto `soro`, destaque `nascente`, horizonte em traço."
- Movimento: siga `AGENTS.md` → seção Movimento (motion-principles; sempre com `prefers-reduced-motion`).
