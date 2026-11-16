# Pendências do site

<!-- ARQUIVO GERADO a partir de conteudo/pendencias.json. Não edite à mão: rode "npm run montar". -->

Perguntas em aberto para o Gustavo. Enquanto uma pergunta não tem resposta, o site usa a
opção segura descrita em **Enquanto isso**, então nada fica travado nem inventado.

**Para responder:** diga o número e a resposta a quem estiver cuidando do site (pessoa ou IA).
Quem for aplicar segue a receita "Responder uma pendência" do [AGENTS.md](AGENTS.md).

Abertas: 18.

## 2. Texto sobre A2A2

O texto da seção A2A2 foi publicado sem as frases sobre digestão. Aprova essa versão ou quer mandar outra?

- [ ] Aprovo como está no site novo
- [ ] Mando outro texto (sem alegação de saúde)

**Enquanto isso:** O site usa o texto aprovado pela família, sem as frases sobre digestão, e avisa que não é leite sem lactose.

**Onde muda no site:**
  - `conteudo/site.json` › rebanho › texto
  - `conteudo/site.json` › rebanho › aviso

## 3. Fundadores na história

A seção de história deve citar quem fundou o laticínio, ou continua sem nomes na parte da fundação?

- [ ] Continua sem nomes na fundação
- [ ] Citar os fundadores (a família envia o texto)

**Enquanto isso:** O texto da origem fica como a família aprovou, sem nomes na fundação.

**Onde muda no site:**
  - `conteudo/site.json` › sobre › origem_texto

## 4. Nascente e Minas Frescal

Existem os rótulos Nascente e Minas Frescal. Hoje são dois produtos ou só o Nascente?

- [ ] Só o Nascente
- [ ] São dois produtos: incluir o Minas Frescal

**Enquanto isso:** O site mostra só o Nascente, como minas frescal.

**Onde muda no site:**
  - `conteudo/produtos.json` › queijos › nascente › tipo

## 5. Cor do Coalho

Qual das quatro opções de cor do rótulo do Coalho foi escolhida?

- [ ] Azul-claro
- [ ] Amarelo
- [ ] Cinza-azulado
- [ ] Cinza

**Enquanto isso:** Amarelo (#EABD29), a cor que o site anterior já usava.

**Onde muda no site:**
  - `conteudo/produtos.json` › queijos › coalho › cor

## 6. Cor do Garoa

O Garoa continua no verde claro (Pantone 345C)?

- [ ] Sim, verde claro
- [ ] Mudou (informar a cor)

**Enquanto isso:** Verde claro (#8ECC90).

**Onde muda no site:**
  - `conteudo/produtos.json` › queijos › garoa › cor

## 7. Selo SISP por produto

Em quais produtos o site pode mostrar o selo SISP individualmente?

- [ ] Não mostrar selo por produto
- [ ] Mostrar nos produtos que o Gustavo indicar

**Enquanto isso:** Nenhum produto mostra selo próprio. O site cita a inspeção SISP 1774 do laticínio, sem dizer que vale para a linha inteira.

**Onde muda no site:**
  - `conteudo/produtos.json` › queijos › nascente › selo_sisp
  - `conteudo/produtos.json` › queijos › coalho › selo_sisp
  - `conteudo/produtos.json` › queijos › requeijao › selo_sisp

## 8. Maturação do Horizontinho

Quanto tempo o Horizontinho matura?

- [ ] 3 a 4 meses
- [ ] Outro tempo (informar)

**Enquanto isso:** 3 a 4 meses de maturação.

**Onde muda no site:**
  - `conteudo/produtos.json` › queijos › horizontinho › detalhe

## 9. Outros produtos da casa

Algum produto fora da lista atual deve entrar no site (por exemplo Gotas, queijo azul, kits sazonais)?

- [ ] Nenhum por enquanto
- [ ] Incluir os que o Gustavo indicar

**Enquanto isso:** Só entram os produtos da lista aprovada.

**Onde muda no site:** ainda não está no conteúdo; entra quando houver resposta.

## 10. Coalhada seca e sour cream

Coalhada seca 250 g e creme de iogurte (sour cream) 200 g entram no site com esses nomes e tamanhos?

- [ ] Sim, como estão
- [ ] Ajustar nome ou tamanho

**Enquanto isso:** Os dois aparecem em Outros produtos; o sour cream com a etiqueta Novo.

**Onde muda no site:**
  - `conteudo/produtos.json` › outros › coalhada-seca › nome
  - `conteudo/produtos.json` › outros › sour-cream › nome

## 11. Descrição de cada queijo

A família pode enviar uma linha de sabor ou uso para cada queijo?

- [ ] Enviar uma frase por queijo
- [ ] Deixar só nome e tipo

**Enquanto isso:** Cada queijo mostra nome, tipo e tempo de maturação, sem descrição de sabor.

**Onde muda no site:**
  - `conteudo/produtos.json` › queijos › nascente › descricao
  - `conteudo/produtos.json` › queijos › poente › descricao
  - `conteudo/produtos.json` › queijos › remanso › descricao
  - `conteudo/produtos.json` › queijos › garoa › descricao
  - `conteudo/produtos.json` › queijos › brisa › descricao
  - `conteudo/produtos.json` › queijos › horizontinho › descricao
  - `conteudo/produtos.json` › queijos › horizonte › descricao
  - `conteudo/produtos.json` › queijos › coalho › descricao
  - `conteudo/produtos.json` › queijos › requeijao › descricao

## 12. Fotos do rebanho

As fotos do rebanho e do pasto são de 2020 a 2022. Podem representar o sítio de hoje?

- [ ] Sim, pode usar
- [ ] Trocar por fotos novas

**Enquanto isso:** O site usa essas fotos, sem legenda com data.

**Onde muda no site:**
  - `conteudo/site.json` › rebanho › pilares › Rebanho › foto
  - `conteudo/site.json` › rebanho › pilares › Genética › foto
  - `conteudo/site.json` › rebanho › pilares › Pasto › foto

## 13. Fotos com pessoas

Há fotos da família ou da equipe que possam ser publicadas, com autorização de quem aparece?

- [ ] Não usar fotos de pessoas
- [ ] Usar as que o Gustavo enviar com autorização

**Enquanto isso:** O site não mostra rosto de ninguém.

**Onde muda no site:** ainda não está no conteúdo; entra quando houver resposta.

## 14. Prêmios

Existe prêmio ou reconhecimento que a família queira citar (concurso, queijo, ano)?

- [ ] Não citar
- [ ] Citar com os dados que o Gustavo enviar

**Enquanto isso:** O site não cita prêmio.

**Onde muda no site:** ainda não está no conteúdo; entra quando houver resposta.

## 15. Fotos que faltam

Faltam fotos de: Poente, Garoa, Horizontinho, Coalho, iogurte de morango, coalhada seca e sour cream. Dá para enviar?

- [ ] Enviar as fotos aos poucos
- [ ] Manter o disco colorido

**Enquanto isso:** Produto sem foto aparece com um disco na cor do rótulo e as três ondas da marca.

**Onde muda no site:**
  - `conteudo/produtos.json` › queijos › poente › foto
  - `conteudo/produtos.json` › queijos › garoa › foto
  - `conteudo/produtos.json` › queijos › horizontinho › foto
  - `conteudo/produtos.json` › queijos › coalho › foto
  - `conteudo/produtos.json` › outros › iogurte-morango › foto
  - `conteudo/produtos.json` › outros › coalhada-seca › foto
  - `conteudo/produtos.json` › outros › sour-cream › foto

## 16. Visitas

O texto da seção Visitas está aprovado? Há algo mais que possa ser dito sobre a experiência da visita?

- [ ] Aprovo o texto curto
- [ ] Mando outro texto

**Enquanto isso:** A seção diz só que a visita é com agendamento pelo WhatsApp.

**Onde muda no site:**
  - `conteudo/site.json` › visitas › texto
  - `conteudo/site.json` › visitas › degustacao

## 17. Nome dos pontos de venda

Os pontos de venda parceiros podem ser citados pelo nome?

- [ ] Manter sem nome
- [ ] Citar com autorização do parceiro

**Enquanto isso:** Aparece como "Padaria parceira em Botucatu", sem nome.

**Onde muda no site:**
  - `conteudo/site.json` › onde › pontos › item 1 › nome

## 18. Dias e horários

Quais os dias e horários de atendimento no WhatsApp e de retirada no sítio?

- [ ] Não mostrar horário
- [ ] Mostrar os horários que o Gustavo informar

**Enquanto isso:** O site não mostra horário.

**Onde muda no site:**
  - `conteudo/site.json` › onde › horario

## 19. Endereço completo

O endereço completo continua no mapa e no rodapé (na história aparece só Pirambóia/SP)?

- [ ] Sim, manter no mapa e no rodapé
- [ ] Mostrar só Pirambóia/SP em todo o site

**Enquanto isso:** Mantido no mapa, em Onde comprar e no rodapé, como no site anterior.

**Onde muda no site:**
  - `conteudo/site.json` › endereco › rua
  - `conteudo/site.json` › endereco › rua_curta
