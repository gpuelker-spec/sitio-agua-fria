// Peças pequenas usadas por todas as seções do site.

/** Protege o texto para entrar no HTML (troca &, <, > e aspas). */
export const esc = (texto) =>
  String(texto).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Título: a palavra entre *asteriscos* vira o destaque em itálico. */
export const destaque = (texto) => esc(texto).replace(/\*(.+?)\*/g, "<em>$1</em>");

/** Troca {chaves} do texto pelos valores informados. */
export const preencher = (texto, valores) =>
  texto.replace(/\{(\w+)\}/g, (_, chave) => {
    if (!(chave in valores)) throw new Error(`Texto usa {${chave}}, que não existe`);
    return valores[chave];
  });

/** Link do WhatsApp do sítio com a mensagem pronta. */
export const linkWhatsApp = (site, mensagem) =>
  `https://wa.me/${site.contato.whatsapp_numero}?text=${encodeURIComponent(mensagem)}`;

/** Atributos de todo link que sai do site. */
export const EXTERNO = 'target="_blank" rel="noopener"';

/** As três ondas da marca, em traço. */
export const ondas = (classe = "ondas") =>
  `<svg class="${classe}" viewBox="0 0 34 22" aria-hidden="true"><path d="M1 3c4-3 7 3 11 0s7 3 11 0 7 3 10 0M1 11c4-3 7 3 11 0s7 3 11 0 7 3 10 0M1 19c4-3 7 3 11 0s7 3 11 0 7 3 10 0"/></svg>`;

/** Disco na cor do rótulo, para produto que ainda não tem foto. */
export const disco = () =>
  `<span class="disco" aria-hidden="true"><svg viewBox="0 0 100 60"><path d="M6 12c15-10 29 10 44 0s29 10 44 0M6 30c15-10 29 10 44 0s29 10 44 0M6 48c15-10 29 10 44 0s29 10 44 0"/></svg></span>`;

/**
 * Foto do site, nos formatos AVIF e WebP e em vários tamanhos.
 * - nome: chave em conteudo/fotos.json
 * - tamanhos: quanto da tela a foto ocupa (atributo "sizes"), para o navegador baixar o arquivo certo
 * - principal: true só na foto do topo (carrega com prioridade)
 * - celular: nome de outra foto (recorte em pé) usada em telas estreitas
 */
export function foto(ctx, nome, { tamanhos, principal = false, celular = null, alt = null } = {}) {
  const dados = (n) => {
    const info = ctx.fotos[n];
    const medida = ctx.medidas[n];
    if (!info) throw new Error(`Foto "${n}" não está em conteudo/fotos.json`);
    if (!medida) throw new Error(`Foto "${n}" ainda não foi gerada: rode npm run fotos`);
    return { info, medida };
  };
  const lista = (n, medida, ext) => medida.larguras.map((l) => `img/${n}-${l}.${ext} ${l}w`).join(", ");
  const fonte = (n, medida, ext, media = "") =>
    `<source${media} type="image/${ext}" srcset="${lista(n, medida, ext)}" sizes="${tamanhos}" width="${medida.largura}" height="${medida.altura}">`;

  const { info, medida } = dados(nome);
  const partes = [];
  if (celular) {
    const c = dados(celular);
    const media = ' media="(max-width: 759px)"';
    partes.push(fonte(celular, c.medida, "avif", media), fonte(celular, c.medida, "webp", media));
  }
  partes.push(fonte(nome, medida, "avif"));
  const padrao = medida.larguras[Math.min(1, medida.larguras.length - 1)];
  const carga = principal ? 'fetchpriority="high"' : 'loading="lazy"';
  const foco = info.foco ? ` style="object-position: ${info.foco}"` : "";
  partes.push(
    `<img src="img/${nome}-${padrao}.webp" srcset="${lista(nome, medida, "webp")}" sizes="${tamanhos}" alt="${esc(alt ?? info.alt)}" width="${medida.largura}" height="${medida.altura}" ${carga} decoding="async"${foco}>`,
  );
  return `<picture>${partes.join("")}</picture>`;
}
