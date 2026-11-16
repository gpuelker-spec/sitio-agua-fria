// Servidor local simples para ver o site no navegador e rodar os testes.
//   npm run serve   →   http://localhost:4173
// Só Node, sem instalar nada (funciona igual no Windows, no Mac e no CI).
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { createGzip } from "node:zlib";
import { naRaiz } from "./caminhos.mjs";

export const PORTA = Number(process.env.PORT) || 4173;
const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

const servidor = createServer((pedido, resposta) => {
  const url = new URL(pedido.url, "http://localhost");
  let caminho = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, "");
  if (caminho === "" || caminho === ".") caminho = "index.html";
  const arquivo = naRaiz(caminho);
  // nunca serve nada fora da pasta do site
  if (caminho.includes("..") || !existsSync(arquivo) || !statSync(arquivo).isFile()) {
    resposta.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    resposta.end("Não encontrado");
    return;
  }
  const tipo = TIPOS[extname(arquivo).toLowerCase()] ?? "application/octet-stream";
  // texto vai comprimido (gzip), como no GitHub Pages: assim a medição de velocidade local é realista
  if (tipo.includes("charset") && /\bgzip\b/.test(pedido.headers["accept-encoding"] ?? "")) {
    resposta.writeHead(200, { "content-type": tipo, "content-encoding": "gzip" });
    createReadStream(arquivo).pipe(createGzip()).pipe(resposta);
    return;
  }
  resposta.writeHead(200, { "content-type": tipo });
  createReadStream(arquivo).pipe(resposta);
});

/** Liga o servidor e devolve uma função para desligar. Se a porta já estiver em uso, aproveita o que está rodando. */
export function ligar() {
  return new Promise((resolver, rejeitar) => {
    servidor.once("error", (erro) => (erro.code === "EADDRINUSE" ? resolver(() => {}) : rejeitar(erro)));
    servidor.listen(PORTA, () => resolver(() => servidor.close()));
  });
}

// rodado direto (npm run serve): liga e fica no ar
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await ligar();
  console.log(`Site em http://localhost:${PORTA}`);
}
