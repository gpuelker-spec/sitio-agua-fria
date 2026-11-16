// Monta o site: lê conteudo/ (textos e produtos), modelo/ (estrutura) e estilo/ (visual)
// e gera index.html, sitemap.xml e PENDENCIAS.md.
//   npm run montar            gera os arquivos
//   npm run montar:conferir   só confere se estão em dia (usado no CI)
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { transform } from "esbuild";
import { pagina } from "../modelo/pagina.mjs";
import { naRaiz } from "./caminhos.mjs";

const ler = (...partes) => readFileSync(naRaiz(...partes), "utf8");
const lerJson = (...partes) => JSON.parse(ler(...partes));

/**
 * Tira os campos { valor, pendente } e as "_nota" do conteúdo.
 * Devolve o conteúdo limpo e anota onde cada pendência é usada.
 */
function limpar(dado, caminho, usos) {
  if (Array.isArray(dado)) return dado.map((item, i) => limpar(item, `${caminho}[${i + 1}]`, usos));
  if (dado === null || typeof dado !== "object") return dado;
  if ("pendente" in dado) {
    if (!("valor" in dado)) throw new Error(`${caminho}: campo com "pendente" precisa de "valor"`);
    usos.push({ n: dado.pendente, onde: caminho });
    return limpar(dado.valor, caminho, usos);
  }
  const limpo = {};
  for (const [chave, valor] of Object.entries(dado)) {
    if (chave === "_nota") continue;
    const nome = valor && typeof valor === "object" && "id" in valor ? valor.id : chave;
    limpo[chave] = limpar(valor, caminho ? `${caminho} › ${nome}` : nome, usos);
  }
  return limpo;
}

/** Em listas, usa o "id" ou o "nome" do item no lugar do número, para o caminho ficar legível. */
function rotular(usos, bruto, arquivo) {
  const achar = (onde) => {
    let atual = bruto;
    const partes = [];
    for (const parte of onde.split(" › ")) {
      const lista = parte.match(/^(.+)\[(\d+)\]$/);
      if (lista) {
        atual = atual?.[lista[1]]?.[Number(lista[2]) - 1];
        const rotulo = atual?.id ?? (typeof atual?.nome === "string" ? atual.nome : null);
        partes.push(rotulo ? `${lista[1]} › ${rotulo}` : `${lista[1]} › item ${lista[2]}`);
      } else {
        atual = atual?.[parte];
        partes.push(parte);
      }
    }
    return partes.join(" › ");
  };
  return usos.map((u) => ({ n: u.n, onde: `\`${arquivo}\` › ${achar(u.onde)}` }));
}

function carregar(arquivo) {
  const bruto = lerJson("conteudo", arquivo);
  const usos = [];
  const limpo = limpar(bruto, "", usos);
  return { limpo, usos: rotular(usos, bruto, `conteudo/${arquivo}`) };
}

function pendenciasMd(pendencias, usos) {
  const numeros = new Set(pendencias.map((p) => p.n));
  for (const u of usos) {
    if (!numeros.has(u.n)) throw new Error(`${u.onde} aponta para a pendência ${u.n}, que não existe`);
  }
  const blocos = pendencias.map((p) => {
    const onde = usos.filter((u) => u.n === p.n).map((u) => `  - ${u.onde}`);
    return [
      `## ${p.n}. ${p.titulo}`,
      "",
      p.pergunta,
      "",
      ...p.opcoes.map((o) => `- [ ] ${o}`),
      "",
      `**Enquanto isso:** ${p.enquanto_isso}`,
      "",
      onde.length > 0
        ? `**Onde muda no site:**\n${onde.join("\n")}`
        : "**Onde muda no site:** ainda não está no conteúdo; entra quando houver resposta.",
    ].join("\n");
  });
  return `# Pendências do site

<!-- ARQUIVO GERADO a partir de conteudo/pendencias.json. Não edite à mão: rode "npm run montar". -->

Perguntas em aberto para o Gustavo. Enquanto uma pergunta não tem resposta, o site usa a
opção segura descrita em **Enquanto isso**, então nada fica travado nem inventado.

**Para responder:** diga o número e a resposta a quem estiver cuidando do site (pessoa ou IA).
Quem for aplicar segue a receita "Responder uma pendência" do [AGENTS.md](AGENTS.md).

Abertas: ${pendencias.length}.

${blocos.join("\n\n")}
`;
}

const site = carregar("site.json");
const produtos = carregar("produtos.json");
const { fotos } = lerJson("conteudo", "fotos.json");
const medidas = lerJson("img", "medidas.json");
const { pendencias } = lerJson("conteudo", "pendencias.json");

// Visual: os arquivos de estilo/ entram na ordem do nome (1-tokens, 2-base...) e vão dentro da página.
const estilos = readdirSync(naRaiz("estilo"))
  .filter((a) => a.endsWith(".css"))
  .sort()
  .map((a) => ler("estilo", a))
  .join("\n");
const css = (await transform(estilos, { loader: "css", minify: true })).code.trim();

const saidas = {
  "index.html": pagina({ site: site.limpo, produtos: produtos.limpo, fotos, medidas, css }),
  "sitemap.xml": `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site.limpo.url}</loc>
    <lastmod>${site.limpo.atualizado}</lastmod>
  </url>
</urlset>
`,
  "robots.txt": `User-agent: *\nAllow: /\n\nSitemap: ${site.limpo.url}sitemap.xml\n`,
  "PENDENCIAS.md": pendenciasMd(pendencias, [...site.usos, ...produtos.usos]),
};

const conferir = process.argv.includes("--conferir");
const desatualizados = [];
for (const [arquivo, texto] of Object.entries(saidas)) {
  if (conferir) {
    let atual = "";
    try {
      atual = ler(arquivo).replaceAll("\r\n", "\n");
    } catch {
      // arquivo ainda não existe: conta como desatualizado
    }
    if (atual !== texto) desatualizados.push(arquivo);
  } else {
    writeFileSync(naRaiz(arquivo), texto);
  }
}

if (desatualizados.length > 0) {
  console.error(
    `Desatualizado: ${desatualizados.join(", ")}. Rode "npm run montar" e faça commit do resultado.`,
  );
  process.exit(1);
}
console.log(conferir ? "Site em dia com o conteúdo." : `Site montado: ${Object.keys(saidas).join(", ")}`);
