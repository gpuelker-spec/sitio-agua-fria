// Lê o conteúdo do site (conteudo/*.json) para os testes compararem com a página montada.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** Tira os campos { valor, pendente } e as "_nota", igual ao scripts/montar.mjs. */
function limpar(dado) {
  if (Array.isArray(dado)) return dado.map(limpar);
  if (dado === null || typeof dado !== "object") return dado;
  if ("pendente" in dado) return limpar(dado.valor);
  return Object.fromEntries(
    Object.entries(dado)
      .filter(([chave]) => chave !== "_nota")
      .map(([chave, valor]) => [chave, limpar(valor)]),
  );
}

const ler = (arquivo) =>
  limpar(
    JSON.parse(readFileSync(fileURLToPath(new URL(`../../conteudo/${arquivo}`, import.meta.url)), "utf8")),
  );

export const site = ler("site.json");
export const produtos = ler("produtos.json");
export const WHATSAPP = `https://wa.me/${site.contato.whatsapp_numero}`;
export const SECOES = [
  "inicio",
  "historia",
  "rebanho",
  "queijos",
  "outros",
  "onde-comprar",
  "visitas",
  "contato",
];

/** Os testes não dependem do Google Maps: o iframe do mapa é bloqueado. */
export const semMapa = (page) => page.route(/google\.com\/maps|maps\.google\.com/, (route) => route.abort());

/** Abre o site e devolve a lista de erros de JavaScript (deve ficar vazia). */
export async function abrir(page) {
  const erros = [];
  page.on("pageerror", (e) => erros.push(e.message));
  await semMapa(page);
  await page.goto("/index.html");
  return erros;
}
