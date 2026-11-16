import { expect, test } from "@playwright/test";
import { abrir, produtos, SECOES, semMapa, site, WHATSAPP } from "./conteudo.js";

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

test("todo produto do conteúdo aparece na página, na ordem", async ({ page }) => {
  await abrir(page);
  const queijos = await page.locator("#queijos .produto-nome").allTextContents();
  expect(queijos.map((n) => n.trim())).toEqual(produtos.queijos.map((p) => p.nome));
  const outros = page.locator("#outros .item-nome");
  await expect(outros).toHaveCount(produtos.outros.length);
  for (const [i, p] of produtos.outros.entries()) {
    await expect(outros.nth(i)).toContainText(p.nome);
  }
});

test("cada produto tem foto real ou o disco na cor do rótulo, e um link para pedir", async ({ page }) => {
  await abrir(page);
  const cartoes = page.locator("#queijos .produto, #outros .item");
  const total = await cartoes.count();
  expect(total).toBe(produtos.queijos.length + produtos.outros.length);
  for (let i = 0; i < total; i++) {
    const cartao = cartoes.nth(i);
    await expect(cartao.locator("picture img, .disco")).toHaveCount(1);
    expect(await cartao.getAttribute("style")).toMatch(/--produto: #[0-9a-f]{6}/i);
    const pedir = await cartao.locator('a[href*="wa.me"]').getAttribute("href");
    expect(new URL(pedir).searchParams.get("text")).toContain("quero pedir:");
  }
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
  await expect(
    page.locator(`a[href="https://instagram.com/${site.contato.instagram}"]`).first(),
  ).toBeAttached();
});

test("todas as imagens têm texto alternativo e existem no servidor", async ({ page, request }) => {
  await abrir(page);
  const imagens = await page.locator("#site img").evaluateAll((imgs) =>
    imgs.map((i) => ({
      src: i.getAttribute("src"),
      alt: i.getAttribute("alt"),
      // todos os tamanhos e formatos oferecidos ao navegador (AVIF e WebP)
      variantes: [...(i.closest("picture")?.querySelectorAll("source, img") ?? [])].flatMap((el) =>
        (el.getAttribute("srcset") ?? "").split(",").map((v) => v.trim().split(" ")[0]),
      ),
    })),
  );
  expect(imagens.length).toBeGreaterThan(0);
  const arquivos = new Set();
  for (const { src, alt, variantes } of imagens) {
    expect(alt, `alt vazio em ${src}`).toBeTruthy();
    arquivos.add(src);
    for (const v of variantes.filter(Boolean)) arquivos.add(v);
  }
  for (const arquivo of arquivos) {
    const resp = await request.get(`/${arquivo}`);
    expect(resp.status(), `${arquivo} não encontrado`).toBe(200);
  }
});

test("textos da família: Cuesta, quem faz acontecer e sem entrega na cidade", async ({ page }) => {
  await abrir(page);
  await expect(page.locator("#inicio")).toContainText("Cuesta de Botucatu");
  await expect(page.locator(".equipe dt")).toHaveText(["Henrique", "Raquel", "Raquel e Gustavo"]);
  await expect(page.locator("#rebanho")).toContainText("não é leite sem lactose");
  await expect(page.locator("#onde-comprar")).not.toContainText("Entrega em Botucatu");
  // na história, o endereço é só a cidade (sem rodovia nem km)
  await expect(page.locator("#historia")).toContainText("Pirambóia/SP");
  await expect(page.locator("#historia")).not.toContainText(/Rondon|km \d/);
});

test("regras de conteúdo: sem preço, sem alegação de saúde e sem pendência à mostra", async ({ page }) => {
  await abrir(page);
  const texto = await page.locator("body").innerText();
  // preços mudam e o pedido é pelo WhatsApp: o site não mostra preço
  expect(texto).not.toMatch(/R\$|\breais\b/i);
  // A2A2 sem promessa de saúde (a única menção a lactose é o aviso de que NÃO é sem lactose)
  expect(texto).not.toMatch(
    /digest|intoler|al[ée]rgi|saud[áa]vel|sa[úu]de|imunidade|emagrec|previne|doen[çc]a/i,
  );
  expect(texto.match(/lactose/gi) ?? []).toHaveLength(1);
  // nada pendente, vazio ou sem preencher pode aparecer para o visitante
  expect(texto).not.toMatch(/A CONFIRMAR|pendente|undefined|\bnull\b|\[object|\{\w+\}/i);
  // assuntos que a família ainda não decidiu como tratar não entram no site
  expect(texto).not.toMatch(/degusta|pr[êe]mio|medalha/i);
});

test("o conteúdo aparece mesmo sem JavaScript", async ({ browser }) => {
  const contexto = await browser.newContext({ javaScriptEnabled: false });
  const page = await contexto.newPage();
  await semMapa(page);
  await page.goto("/index.html");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("#queijos .produto-nome").first()).toBeVisible();
  await expect(page.locator("#contato .botao")).toBeVisible();
  await expect(page.locator("#wa-float")).toBeVisible();
  await contexto.close();
});

test("menu do celular abre, leva à seção e fecha", async ({ page }) => {
  test.skip(page.viewportSize().width >= 1000, "no computador o menu fica sempre aberto");
  await abrir(page);
  const menu = page.locator("#menu");
  await expect(menu).toBeHidden();
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(menu).toBeVisible();
  await menu.getByRole("link", { name: "Queijos", exact: true }).click();
  await expect(menu).toBeHidden();
  await expect
    .poll(() => page.evaluate(() => Math.abs(document.querySelector("#queijos").getBoundingClientRect().top)))
    .toBeLessThan(200);
});

test("botão flutuante de pedido existe e leva ao WhatsApp", async ({ page }) => {
  await abrir(page);
  // some no topo (classe escondido); por isso é buscado pelo id e não pelo papel acessível
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
        .filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1)
        .slice(0, 12)
        .map((e) => `${e.tagName}.${e.getAttribute("class")}:${Math.round(e.getBoundingClientRect().right)}`)
        .join(" | ") || "nenhum elemento",
  );
  expect(largos).toBe("nenhum elemento");
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
  await semMapa(page);
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
