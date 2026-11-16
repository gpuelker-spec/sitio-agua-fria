// Gera og-image.jpg (1200 x 630): a imagem que aparece ao compartilhar o site no WhatsApp e no Instagram.
//   npm run og
// Rode de novo se mudar o título do topo, a foto principal ou as cores.
import { readFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { destaque, esc } from "../modelo/util.mjs";
import { naRaiz } from "./caminhos.mjs";
import { ligar, PORTA } from "./servir.mjs";

const site = JSON.parse(readFileSync(naRaiz("conteudo", "site.json"), "utf8"));
const base = `http://localhost:${PORTA}/`;
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><base href="${base}">
<style>
@font-face { font-family: "Fraunces"; src: url("fontes/fraunces-titulo-normal.woff2"); font-weight: 100 900; }
@font-face { font-family: "Fraunces"; src: url("fontes/fraunces-titulo-italic.woff2"); font-weight: 100 900; font-style: italic; }
@font-face { font-family: "Figtree"; src: url("fontes/figtree.woff2"); font-weight: 300 900; }
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; display: grid; grid-template-columns: 560px 1fr; background: #fbf8f1; color: #020111; font-family: "Figtree", sans-serif; }
.texto { padding: 56px 28px 52px 60px; display: flex; flex-direction: column; }
.texto img { width: 250px; }
h1 { margin-top: auto; font: 370 76px/0.98 "Fraunces", serif; letter-spacing: -0.025em; }
h1 em { font-style: italic; font-weight: 400; color: #0f6b7a; white-space: nowrap; }
p { margin-top: 22px; font-size: 21px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #0f6b7a; }
.foto { padding: 28px 28px 28px 0; }
.foto img { width: 100%; height: 100%; object-fit: cover; object-position: 38% 60%; border-radius: 28px; }
</style></head><body>
<div class="texto"><img src="marca/logo-sitio.png" alt=""><h1>${destaque(site.topo.titulo)}</h1><p>${esc(site.endereco.cidade)}/${esc(site.endereco.estado)} · desde ${esc(site.fundacao)}</p></div>
<div class="foto"><img src="img/pasto-rebanho-1280.webp" alt=""></div>
</body></html>`;

const desligar = await ligar();
const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
// abre primeiro um endereço do próprio site: assim as fontes carregam sem bloqueio de origem
await pagina.goto(`${base}robots.txt`);
await pagina.setContent(html, { waitUntil: "networkidle" });
await pagina.evaluate(() => document.fonts.ready);
const png = await pagina.screenshot({ type: "png" });
await navegador.close();
desligar();
await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toFile(naRaiz("og-image.jpg"));
console.log("og-image.jpg gerada (1200 x 630)");
