// Tira prints do site montado, seção por seção, no computador (1440 px) e no celular (390 px).
//   npm run prints   →   pasta prints/ (não entra no repositório)
// Use antes de abrir um PR com mudança visual, para mostrar o antes e o depois ao Gustavo.
import { mkdirSync, rmSync } from "node:fs";
import { chromium } from "@playwright/test";
import { naRaiz } from "./caminhos.mjs";
import { ligar, PORTA } from "./servir.mjs";

const TELAS = [
  { nome: "computador", viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  {
    nome: "celular",
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
];
const SECOES = ["inicio", "historia", "rebanho", "queijos", "outros", "onde-comprar", "visitas", "contato"];

const desligar = await ligar();
rmSync(naRaiz("prints"), { recursive: true, force: true });
mkdirSync(naRaiz("prints"), { recursive: true });
const navegador = await chromium.launch();

for (const tela of TELAS) {
  const { nome, ...opcoes } = tela;
  // movimento reduzido: tudo aparece de uma vez, sem depender da rolagem
  const contexto = await navegador.newContext({ ...opcoes, reducedMotion: "reduce" });
  const pagina = await contexto.newPage();
  await pagina.goto(`http://localhost:${PORTA}/`, { waitUntil: "load" });
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.locator(".heroi-cena picture img").evaluate((img) => img.decode());
  await pagina.screenshot({ path: naRaiz("prints", `${nome}-0-primeira-tela.png`) });

  // rola a página inteira para carregar as fotos que esperam a rolagem (lazy)
  const altura = await pagina.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < altura; y += 500) {
    await pagina.evaluate((v) => window.scrollTo(0, v), y);
    await pagina.waitForTimeout(120);
  }
  await pagina.waitForLoadState("networkidle").catch(() => {});
  await pagina.addStyleTag({ content: "#wa-float { display: none !important; }" });

  let n = 1;
  for (const id of SECOES) {
    await pagina.locator(`#${id}`).screenshot({ path: naRaiz("prints", `${nome}-${n}-${id}.png`) });
    n += 1;
  }
  await pagina.locator("footer").screenshot({ path: naRaiz("prints", `${nome}-${n}-rodape.png`) });
  await pagina.evaluate(() => window.scrollTo(0, 0));
  await pagina.screenshot({ path: naRaiz("prints", `${nome}-pagina-inteira.png`), fullPage: true });
  await contexto.close();
}

await navegador.close();
desligar();
console.log("Prints salvos em prints/");
