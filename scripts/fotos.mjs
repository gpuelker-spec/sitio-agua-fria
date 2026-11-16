// Gera as versões leves (AVIF e WebP) das fotos listadas em conteudo/fotos.json.
// Uso:  npm run fotos -- "C:\pasta\das\fotos\originais" [nome-da-foto ...]
// Sem nomes, gera só as que ainda não existem em img/. Com --todas, refaz tudo.
// As fotos originais não entram no repositório: só o resultado em img/.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { naRaiz as caminho } from "./caminhos.mjs";

const args = process.argv.slice(2);
const todas = args.includes("--todas");
const [pasta, ...pedidas] = args.filter((a) => a !== "--todas");

if (!pasta || !existsSync(pasta)) {
  console.error('Informe a pasta das fotos originais:  npm run fotos -- "C:\\pasta\\das\\fotos"');
  process.exit(1);
}

const { fotos } = JSON.parse(readFileSync(caminho("conteudo", "fotos.json"), "utf8"));
const arquivoMedidas = caminho("img", "medidas.json");
const medidas = existsSync(arquivoMedidas) ? JSON.parse(readFileSync(arquivoMedidas, "utf8")) : {};
const originais = readdirSync(pasta);
mkdirSync(caminho("img"), { recursive: true });

/** Acha o arquivo original pelo nome ou por um pedaço único do nome. */
function acharOriginal(origem) {
  const alvo = origem.normalize("NFC").toLowerCase();
  const achados = originais.filter((f) => f.normalize("NFC").toLowerCase().includes(alvo));
  if (achados.length !== 1) {
    throw new Error(`"${origem}": esperava 1 arquivo na pasta, achei ${achados.length}`);
  }
  return join(pasta, achados[0]);
}

for (const [nome, foto] of Object.entries(fotos)) {
  if (pedidas.length > 0 && !pedidas.includes(nome)) continue;
  if (!todas && pedidas.length === 0 && medidas[nome]) continue;

  // .rotate() sem argumento endireita a foto conforme a orientação gravada pelo celular
  let imagem = sharp(acharOriginal(foto.origem)).rotate();
  const info = await imagem.clone().toBuffer({ resolveWithObject: true });
  let { width: largura, height: altura } = info.info;
  if (foto.recorte) {
    const r = foto.recorte;
    const area = {
      left: Math.round(r.x * largura),
      top: Math.round(r.y * altura),
      width: Math.round(r.l * largura),
      height: Math.round(r.a * altura),
    };
    imagem = sharp(info.data).extract(area);
    largura = area.width;
    altura = area.height;
  } else {
    imagem = sharp(info.data);
  }

  // nunca amplia: larguras maiores que a foto são trocadas pela largura real
  const larguras = [...new Set(foto.larguras.map((l) => Math.min(l, largura)))].sort((a, b) => a - b);
  for (const l of larguras) {
    const base = imagem.clone().resize({ width: l });
    await base
      .clone()
      .avif({ quality: 52, effort: 6 })
      .toFile(caminho("img", `${nome}-${l}.avif`));
    await base
      .clone()
      .webp({ quality: 76, effort: 5 })
      .toFile(caminho("img", `${nome}-${l}.webp`));
  }
  medidas[nome] = { largura, altura, larguras };
  console.log(`${nome}: ${larguras.join(", ")} px`);
}

const ordenadas = Object.fromEntries(Object.entries(medidas).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(arquivoMedidas, `${JSON.stringify(ordenadas, null, 2)}\n`);
