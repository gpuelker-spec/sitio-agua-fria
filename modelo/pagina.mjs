// A página inteira: <head> (SEO, prévia de compartilhamento, dados estruturados) + as seções.
import * as secoes from "./secoes.mjs";
import { esc } from "./util.mjs";

/** Dados estruturados para o Google (negócio local). Saem do mesmo conteúdo que a página. */
function dadosEstruturados({ site, produtos }) {
  const e = site.endereco;
  const oferta = (nome) => ({ "@type": "Offer", itemOffered: { "@type": "Product", name: nome } });
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}#negocio`,
    name: site.nome_completo,
    description: site.seo.descricao_negocio,
    url: site.url,
    image: `${site.url}og-image.jpg`,
    logo: `${site.url}marca/icone.png`,
    telephone: site.contato.telefone_internacional,
    address: {
      "@type": "PostalAddress",
      streetAddress: e.rua,
      addressLocality: e.cidade,
      addressRegion: e.estado,
      addressCountry: "BR",
    },
    areaServed: e.atende,
    sameAs: [`https://instagram.com/${site.contato.instagram}`],
    foundingDate: site.fundacao,
    makesOffer: [
      ...produtos.queijos.map((p) => oferta(`Queijo ${p.nome} (${p.tipo.toLowerCase()})`)),
      ...produtos.outros.map((p) => oferta(p.nome)),
    ],
    geo: { "@type": "GeoCoordinates", latitude: e.latitude, longitude: e.longitude },
    hasMap: e.link_mapa,
  };
}

export function pagina(ctx) {
  const { site, css } = ctx;
  const seo = site.seo;
  return `<!DOCTYPE html>
<!-- ARQUIVO GERADO. Não edite à mão: mude conteudo/, modelo/ ou estilo/ e rode "npm run montar". -->
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(seo.titulo)}</title>
<meta name="description" content="${esc(seo.descricao)}">
<link rel="canonical" href="${site.url}">
<meta name="theme-color" content="#fbf8f1">
<meta name="robots" content="index, follow">
<link rel="icon" href="marca/icone.png">
<link rel="apple-touch-icon" href="marca/icone.png">
<!-- Prévia ao compartilhar (WhatsApp, Instagram, Facebook) -->
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="${esc(site.nome)}">
<meta property="og:title" content="${esc(seo.titulo_compartilhar)}">
<meta property="og:description" content="${esc(seo.descricao_compartilhar)}">
<meta property="og:url" content="${site.url}">
<meta property="og:image" content="${site.url}og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(seo.imagem_alt)}">
<meta name="twitter:card" content="summary_large_image">
<!-- Dados estruturados para o Google (negócio local) -->
<script type="application/ld+json">
${JSON.stringify(dadosEstruturados(ctx), null, 2)}
</script>
<link rel="preload" as="font" type="font/woff2" href="fontes/fraunces-titulo-normal.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="fontes/figtree.woff2" crossorigin>
<style>${css}</style>
<script src="site.js" defer></script>
</head>
<body>
<a class="pular" href="#inicio">Pular para o conteúdo</a>
<div id="site">
${secoes.cabecalho(ctx)}
<main>
${secoes.topo(ctx)}
${secoes.sobre(ctx)}
${secoes.rebanho(ctx)}
${secoes.queijos(ctx)}
${secoes.outros(ctx)}
${secoes.onde(ctx)}
${secoes.visitas(ctx)}
${secoes.pedido(ctx)}
</main>
${secoes.botaoFlutuante(ctx)}
${secoes.rodape(ctx)}
</div>
</body>
</html>
`;
}
