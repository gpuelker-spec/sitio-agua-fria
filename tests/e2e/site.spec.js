import { expect, test } from "@playwright/test";

const WHATSAPP = "https://wa.me/5514981715427";
const SECOES = ["inicio", "historia", "produtos", "galeria", "locais", "contato"];
const QUEIJOS = ["Nascente", "Poente", "Remanso", "Garoa", "Brisa", "Horizontinho", "Horizonte", "Coalho"];

/** Abre o site e espera o template ser montado pelo support.js. */
async function abrir(page) {
  const erros = [];
  page.on("pageerror", (e) => erros.push(e.message));
  await page.goto("/index.html");
  await expect(page.locator("#inicio")).toBeAttached({ timeout: 15_000 });
  return erros;
}

test("carrega sem erros de JavaScript e com o título certo", async ({ page }) => {
  const erros = await abrir(page);
  await expect(page).toHaveTitle(/Sítio Água Fria/);
  await expect(page.locator("h1")).toContainText("Queijo feito com leite 100% A2A2");
  expect(erros).toEqual([]);
});

test("todas as seções existem e os links do menu apontam para elas", async ({ page }) => {
  await abrir(page);
  for (const id of SECOES) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  const ancoras = await page
    .locator('nav a[href^="#"]')
    .evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  expect(ancoras.length).toBeGreaterThan(0);
  for (const href of ancoras) {
    await expect(page.locator(href)).toBeAttached();
  }
});

test("a linha de queijos mostra os 8 produtos", async ({ page }) => {
  await abrir(page);
  const nomes = await page.locator("#produtos .queijo-nome").allTextContents();
  expect(nomes.map((n) => n.trim())).toEqual(QUEIJOS);
});

test("todo link de WhatsApp leva ao número do Sítio com mensagem pronta", async ({ page }) => {
  await abrir(page);
  const links = await page.locator('a[href*="wa.me"]').evaluateAll((as) => as.map((a) => a.href));
  expect(links.length).toBeGreaterThanOrEqual(3);
  for (const href of links) {
    expect(href.startsWith(WHATSAPP)).toBe(true);
    const texto = new URL(href).searchParams.get("text");
    expect(texto).toContain("Vim pelo site");
  }
});

test("links externos abrem em nova aba com segurança", async ({ page }) => {
  await abrir(page);
  const externos = page.locator('a[href^="http"]');
  const total = await externos.count();
  expect(total).toBeGreaterThan(0);
  for (let i = 0; i < total; i++) {
    await expect(externos.nth(i)).toHaveAttribute("target", "_blank");
    await expect(externos.nth(i)).toHaveAttribute("rel", /noopener/);
  }
  await expect(page.locator('a[href="https://instagram.com/laticiniositioaguafria"]').first()).toBeAttached();
});

test("todas as imagens têm texto alternativo e existem no servidor", async ({ page, request }) => {
  await abrir(page);
  const imagens = await page
    .locator("#site img")
    .evaluateAll((imgs) => imgs.map((i) => ({ src: i.getAttribute("src"), alt: i.getAttribute("alt") })));
  expect(imagens.length).toBeGreaterThan(0);
  for (const { src, alt } of imagens) {
    expect(alt, `alt vazio em ${src}`).toBeTruthy();
    const resp = await request.get(`/${src}`);
    expect(resp.status(), `${src} não encontrado`).toBe(200);
  }
});

test("textos da família: Cuesta, quem faz acontecer e sem entrega na cidade", async ({ page }) => {
  await abrir(page);
  await expect(page.locator("#inicio")).toContainText("Cuesta de Botucatu");
  await expect(page.locator(".equipe dt")).toHaveText(["Henrique", "Raquel", "Raquel e Gustavo"]);
  await expect(page.locator("#genetica")).toContainText("não é leite sem lactose");
  await expect(page.locator("#locais .rota")).not.toContainText("Entrega em Botucatu");
});

test("botão flutuante de pedido existe e leva ao WhatsApp", async ({ page }) => {
  await abrir(page);
  // fica escondido (is-hidden) no topo; por isso é buscado pelo id e não pelo papel acessível
  const botao = page.locator("#wa-float");
  await expect(botao).toBeAttached();
  await expect(botao).toHaveAttribute("href", new RegExp(`^${WHATSAPP}`));
  await expect(botao).toHaveAttribute("aria-label", "Fazer pedido pelo WhatsApp");
});

test("não há rolagem horizontal (layout cabe na tela)", async ({ page }) => {
  await abrir(page);
  const sobra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(sobra).toBeLessThanOrEqual(1);
  // no celular, conteúdo largo demais faz o navegador "afastar" a página: a largura tem que ser a da tela
  const largos = await page.evaluate(
    () =>
      [...document.querySelectorAll("#site *")]
        .filter((e) => e.getBoundingClientRect().right > window.innerWidth - 2)
        .slice(0, 12)
        .map((e) => `${e.tagName}.${e.getAttribute("class")}:${Math.round(e.getBoundingClientRect().right)}`)
        .join(" | ") || "nenhum elemento",
  );
  expect(await page.evaluate(() => window.innerWidth), largos).toBe(page.viewportSize().width);
});

test("endereço e inspeção SISP aparecem no rodapé", async ({ page }) => {
  await abrir(page);
  const rodape = page.locator("footer");
  await expect(rodape).toContainText("Marechal Rondon, km 218");
  await expect(rodape).toContainText("SISP 1774");
});

test("Sentry carrega sem erro e não envia nada fora do site publicado", async ({ page }) => {
  const enviados = [];
  page.on("request", (r) => {
    if (r.url().includes("sentry.io")) enviados.push(r.url());
  });
  const erros = await abrir(page);
  await page.goto("/index.html#teste-sentry");
  await expect(page.locator("#inicio")).toBeAttached({ timeout: 15_000 });
  await page.waitForTimeout(500);
  expect(erros).toEqual([]);
  expect(enviados).toEqual([]);
});

test("no site publicado, o Sentry envia o erro de teste sem dados pessoais", async ({ page, baseURL }) => {
  // Simula o endereço de produção servindo os arquivos locais; o envio ao Sentry é interceptado (nada sai da máquina).
  await page.route("https://gpuelker-spec.github.io/sitio-agua-fria/**", async (route) => {
    const caminho = new URL(route.request().url()).pathname.replace("/sitio-agua-fria", "");
    await route.fulfill({ response: await page.request.get(`${baseURL}${caminho}`) });
  });
  const envios = [];
  await page.route(/sentry\.io/, async (route) => {
    envios.push(route.request().postData() || "");
    await route.fulfill({ status: 200, body: "{}" });
  });
  await page.goto("https://gpuelker-spec.github.io/sitio-agua-fria/index.html#teste-sentry");
  await expect.poll(() => envios.length, { timeout: 10_000 }).toBeGreaterThan(0);
  const corpo = envios.join("\n");
  expect(corpo).toContain("Teste do Sentry");
  expect(corpo).not.toContain("{{auto}}"); // IP não é coletado
  await page.unrouteAll({ behavior: "ignoreErrors" });
});
