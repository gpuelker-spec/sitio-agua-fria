// As seções da página, na ordem em que aparecem. Cada função recebe o conteúdo (ctx)
// e devolve o HTML da seção. Os TEXTOS não ficam aqui: ficam em conteudo/site.json
// e conteudo/produtos.json. Aqui fica só a estrutura.
import { destaque, disco, EXTERNO, esc, foto, linkWhatsApp, ondas, preencher } from "./util.mjs";

export function cabecalho({ site }) {
  const links = site.menu.map((m) => `<a href="#${m.destino}">${esc(m.texto)}</a>`).join("");
  const pedir = linkWhatsApp(site, site.contato.mensagem_pedido);
  return `
<header class="topo">
  <div class="miolo topo-linha">
    <a class="marca" href="#inicio" aria-label="${esc(site.nome)}, início"><img src="marca/logo-sitio.webp" alt="${esc(site.nome)}" width="567" height="278" decoding="async"></a>
    <button class="menu-botao" type="button" popovertarget="menu">Menu</button>
    <nav id="menu" class="menu" popover aria-label="Seções">
      <button class="menu-fechar" type="button" popovertarget="menu" popovertargetaction="hide">Fechar</button>
      ${links}
      <a class="botao botao-pequeno" href="${pedir}" ${EXTERNO}>${esc(site.botoes.menu_pedir)}</a>
    </nav>
  </div>
</header>`;
}

export function topo(ctx) {
  const { site } = ctx;
  const t = site.topo;
  return `
<section id="inicio" class="heroi">
  <div class="miolo">
    <div class="heroi-grade">
      <p class="chamada">${ondas()}${esc(t.chamada)}</p>
      <h1>${destaque(t.titulo)}</h1>
      <div class="heroi-apoio">
        <p class="texto-g apoio">${esc(t.texto)}</p>
        <div class="acoes">
          <a class="botao" data-pedir-topo href="${linkWhatsApp(site, site.contato.mensagem_pedido)}" ${EXTERNO}>${esc(t.botao)}</a>
          <a class="link-seta" href="#queijos">${esc(t.link)}</a>
        </div>
      </div>
    </div>
    <figure class="foto heroi-cena">
      ${foto(ctx, t.foto, { tamanhos: "(max-width: 759px) 92vw, min(1296px, 90vw)", principal: true, celular: t.foto_celular })}
      <span class="selo-medalha heroi-selo"><img src="marca/selo-a2a2.webp" alt="${esc(t.selo_alt)}" width="297" height="231" decoding="async"></span>
      <figcaption class="legenda">${esc(t.legenda)}</figcaption>
    </figure>
  </div>
</section>

<section class="fatos" aria-label="Diferenciais">
  <ul class="miolo" role="list">
    ${site.fatos.map((f) => `<li>${ondas()}${esc(f)}</li>`).join("\n    ")}
  </ul>
</section>`;
}

export function sobre(ctx) {
  const s = ctx.site.sobre;
  const equipe = s.equipe
    .map((p) => `<div><dt>${esc(p.nome)}</dt><dd>${esc(p.papel)}</dd></div>`)
    .join("\n        ");
  return `
<section id="historia" class="secao sobre">
  <div class="miolo sobre-grade">
    <figure class="foto sobre-foto revela">
      ${foto(ctx, s.foto, { tamanhos: "(max-width: 899px) 92vw, 38vw" })}
      <figcaption class="legenda">${esc(s.legenda)}</figcaption>
    </figure>
    <div class="sobre-texto">
      <p class="chamada">${esc(s.chamada)}</p>
      <h2 class="titulo">${destaque(s.titulo)}</h2>
      <h3 class="subtitulo">${esc(s.origem_titulo)}</h3>
      <p>${esc(s.origem_texto)}</p>
      <h3 class="subtitulo">${esc(s.equipe_titulo)}</h3>
      <dl class="equipe">
        ${equipe}
      </dl>
      <h3 class="subtitulo">${esc(s.inspiracao_titulo)}</h3>
      <p>${esc(s.inspiracao_texto)}</p>
      <div class="selos">
        <span class="selo-medalha"><img src="marca/selo-a2a2.webp" alt="${esc(s.selo_a2a2_alt)}" width="297" height="231" loading="lazy" decoding="async"></span>
        <span class="selo-medalha"><img src="marca/selo-sisp.webp" alt="${esc(s.selo_sisp_alt)}" width="606" height="351" loading="lazy" decoding="async"></span>
        <p>${esc(s.selos_texto)}</p>
      </div>
    </div>
  </div>
</section>`;
}

export function rebanho(ctx) {
  const r = ctx.site.rebanho;
  const pilares = r.pilares
    .map(
      (p) => `<li class="pilar revela">
        <figure class="foto">${foto(ctx, p.foto, { tamanhos: "(max-width: 759px) 92vw, 30vw" })}</figure>
        <p class="chamada">${esc(p.numero)} · ${esc(p.nome)}</p>
        <p class="pilar-texto">${esc(p.texto)}</p>
      </li>`,
    )
    .join("\n      ");
  return `
<section id="rebanho" class="secao rebanho">
  <div class="miolo">
    <div class="rebanho-abre">
      <div>
        <p class="chamada">${esc(r.chamada)}</p>
        <h2 class="titulo">${destaque(r.titulo)}</h2>
      </div>
      <div>
        <p class="texto-g">${esc(r.texto)}</p>
        <p class="aviso"><strong>${esc(r.aviso_destaque)}</strong> ${esc(r.aviso)}</p>
      </div>
    </div>
    <ol class="pilares" role="list">
      ${pilares}
    </ol>
  </div>
</section>`;
}

/** Miniatura do produto: a foto real ou, se ainda não houver, o disco na cor do rótulo. */
const retrato = (ctx, p, tamanhos) => (p.foto ? foto(ctx, p.foto, { tamanhos }) : disco());

export function queijos(ctx) {
  const { site, produtos } = ctx;
  const q = site.queijos;
  const cartoes = produtos.queijos
    .map((p) => {
      const pedir = linkWhatsApp(
        site,
        preencher(site.contato.mensagem_produto, { produto: `queijo ${p.nome}` }),
      );
      return `<li class="produto revela" style="--produto: ${p.cor}">
        <div class="produto-foto">${retrato(ctx, p, "(max-width: 759px) 45vw, 30vw")}</div>
        <h3 class="produto-nome">${esc(p.nome)}</h3>
        <p class="produto-tipo">${esc(p.tipo)}</p>
        ${p.detalhe ? `<p class="produto-detalhe">${esc(p.detalhe)}</p>` : ""}
        ${p.descricao ? `<p class="produto-descricao">${esc(p.descricao)}</p>` : ""}
        <a class="link-seta" href="${pedir}" ${EXTERNO}>${esc(site.botoes.pedir_produto)}<span class="so-leitor"> ${esc(p.nome)} pelo WhatsApp</span></a>
      </li>`;
    })
    .join("\n      ");
  return `
<section id="queijos" class="secao queijos">
  <div class="miolo">
    <div class="queijos-abre">
      <div>
        <p class="chamada">${esc(q.chamada)}</p>
        <h2 class="titulo titulo-longo">${destaque(q.titulo)}</h2>
        <p class="apoio">${esc(q.texto)}</p>
      </div>
      <figure class="foto queijos-foto revela">
        ${foto(ctx, q.foto, { tamanhos: "(max-width: 899px) 92vw, 36vw" })}
        <figcaption class="legenda">${esc(q.legenda)}</figcaption>
      </figure>
    </div>
    <ul class="grade-queijos" role="list">
      ${cartoes}
    </ul>
  </div>
</section>`;
}

export function outros(ctx) {
  const { site, produtos } = ctx;
  const o = site.outros;
  const itens = produtos.outros
    .map((p) => {
      const pedir = linkWhatsApp(site, preencher(site.contato.mensagem_produto, { produto: p.nome }));
      const novo = p.novo ? ` <span class="etiqueta-novo">${esc(o.novo)}</span>` : "";
      return `<li class="item" style="--produto: ${p.cor}">
        <div class="item-foto">${retrato(ctx, p, "84px")}</div>
        <div class="item-texto">
          <h3 class="item-nome">${esc(p.nome)}${novo}</h3>
          <p class="item-tamanhos">${esc(p.tamanhos)}</p>
        </div>
        <a class="link-seta" href="${pedir}" ${EXTERNO}>${esc(site.botoes.pedir_produto)}<span class="so-leitor"> ${esc(p.nome)} pelo WhatsApp</span></a>
      </li>`;
    })
    .join("\n      ");
  return `
<section id="outros" class="secao outros">
  <div class="miolo">
    <p class="chamada">${esc(o.chamada)}</p>
    <h2 class="titulo">${destaque(o.titulo)}</h2>
    <ul class="grade-outros" role="list">
      ${itens}
    </ul>
  </div>
</section>`;
}

export function onde({ site }) {
  const o = site.onde;
  const pontos = o.pontos
    .map(
      (p) =>
        `<li class="ponto"><h3 class="subtitulo">${esc(p.nome)}</h3><p>${esc(preencher(p.texto, { endereco: site.endereco.rua }))}</p></li>`,
    )
    .join("\n        ");
  return `
<section id="onde-comprar" class="secao onde">
  <div class="miolo onde-grade">
    <div>
      <p class="chamada">${esc(o.chamada)}</p>
      <h2 class="titulo">${destaque(o.titulo)}</h2>
      <p class="apoio">${esc(o.texto)}</p>
      ${o.horario ? `<p class="apoio">${esc(o.horario)}</p>` : ""}
      ${ondas("ondas ondas-grande")}
    </div>
    <ol class="pontos" role="list">
        ${pontos}
    </ol>
  </div>
</section>`;
}

export function visitas(ctx) {
  const { site } = ctx;
  const v = site.visitas;
  return `
<section id="visitas" class="secao visitas">
  <div class="miolo visitas-grade">
    <figure class="foto visitas-foto revela">
      ${foto(ctx, v.foto, { tamanhos: "(max-width: 759px) 92vw, 36vw" })}
      <figcaption class="legenda">${esc(v.legenda)}</figcaption>
    </figure>
    <div>
      <p class="chamada">${esc(v.chamada)}</p>
      <h2 class="titulo">${destaque(v.titulo)}</h2>
      <p class="texto-g apoio">${esc(v.texto)}</p>
      ${v.degustacao ? `<p class="apoio">${esc(v.degustacao)}</p>` : ""}
      <div class="acoes">
        <a class="botao" href="${linkWhatsApp(site, site.contato.mensagem_visita)}" ${EXTERNO}>${esc(v.botao)}</a>
      </div>
    </div>
  </div>
</section>`;
}

export function pedido({ site }) {
  const p = site.pedido;
  const e = site.endereco;
  const mapa = `https://maps.google.com/maps?q=${e.latitude},${e.longitude}&amp;z=14&amp;hl=pt-BR&amp;output=embed`;
  return `
<section id="contato" class="secao pedido escuro">
  <div class="miolo pedido-grade">
    <div>
      <p class="chamada">${esc(p.chamada)}</p>
      <h2 class="titulo">${destaque(p.titulo)}</h2>
      <p class="texto-g apoio">${esc(p.texto)}</p>
      <div class="acoes">
        <a class="botao botao-claro" href="${linkWhatsApp(site, site.contato.mensagem_pedido)}" ${EXTERNO}>${esc(preencher(p.botao, { whatsapp: site.contato.whatsapp_exibicao }))}</a>
        <a class="link-seta" href="https://instagram.com/${site.contato.instagram}" ${EXTERNO}>@${esc(site.contato.instagram)}</a>
      </div>
    </div>
    <div>
      <div class="mapa">
        <iframe title="${esc(preencher(p.mapa_titulo, { endereco: e.rua }))}" src="${mapa}" loading="lazy"></iframe>
      </div>
      <p class="mapa-link"><a class="link-seta" href="${e.link_mapa}" ${EXTERNO}>${esc(p.mapa_link)}</a></p>
    </div>
  </div>
</section>`;
}

export function rodape({ site }) {
  const links = site.menu.map((m) => `<a href="#${m.destino}">${esc(m.texto)}</a>`).join("");
  return `
<footer class="rodape escuro">
  <div class="miolo rodape-linha">
    <img src="marca/logo-selo.webp" alt="${esc(site.rodape.selo_alt)}" width="233" height="261" loading="lazy" decoding="async">
    <div>
      <p>${esc(preencher(site.rodape.texto, { endereco_curto: site.endereco.rua_curta }))}</p>
      <nav class="rodape-menu" aria-label="Rodapé">${links}</nav>
    </div>
  </div>
</footer>`;
}

export function botaoFlutuante({ site }) {
  return `
<a id="wa-float" href="${linkWhatsApp(site, site.contato.mensagem_pedido)}" ${EXTERNO} aria-label="${esc(site.botoes.flutuante_leitor_de_tela)}">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.6-5.4A8.4 8.4 0 1 1 21 11.5z"/></svg>
  <span>${esc(site.botoes.flutuante)}</span>
</a>`;
}
