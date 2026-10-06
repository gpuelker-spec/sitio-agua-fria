import { expect, test } from "@playwright/test";

// Os testes não dependem do Google Maps: o iframe do mapa é bloqueado.
test.beforeEach(async ({ page }) => {
  await page.route(/google\.com\/maps|maps\.google\.com/, (route) => route.abort());
});

async function abrir(page) {
  const erros = [];
  page.on("pageerror", (e) => erros.push(e.message));
  await page.goto("/index.html");
  await expect(page.locator("#inicio")).toBeAttached({ timeout: 15_000 });
  return erros;
}

test("carregamento: skeleton e barra de progresso saem quando o site fica pronto", async ({ page }) => {
  const erros = await abrir(page);
  await expect(page.locator("#mo-skeleton")).toHaveCount(0, { timeout: 10_000 });
  await expect(page.locator("#mo-progress")).toHaveCount(0, { timeout: 10_000 });
  expect(erros).toEqual([]);
});

test("entrada: o herói aparece em cascata depois do carregamento", async ({ page }) => {
  await abrir(page);
  const heroi = page.locator("#inicio .rv");
  await expect(heroi).not.toHaveCount(0);
  const total = await heroi.count();
  for (let i = 0; i < total; i++) {
    await expect(heroi.nth(i)).toHaveClass(/is-in/, { timeout: 10_000 });
  }
});

test("lazy loading: só a foto principal carrega com prioridade, o resto espera a rolagem", async ({
  page,
}) => {
  await abrir(page);
  await expect(page.locator('img[src="f1.jpg"]')).toHaveAttribute("fetchpriority", "high");
  await expect(page.locator('img[src="f1.jpg"]')).not.toHaveAttribute("loading", "lazy");
  for (const src of ["f7.jpg", "f3.jpg", "f4.jpg", "a2a2.png", "selo-sisp.jpg"]) {
    const img = page.locator(`img[src="${src}"]:not(.carimbo img)`); // o selo do herói é acima da dobra
    await expect(img).toHaveAttribute("loading", "lazy");
    await expect(img).toHaveAttribute("width", /\d+/);
    await expect(img).toHaveAttribute("height", /\d+/);
  }
  await expect(page.locator("iframe")).toHaveAttribute("loading", "lazy");
});

test("skeleton por elemento: cada foto troca o placeholder pela imagem ao carregar", async ({ page }) => {
  await abrir(page);
  const fotos = page.locator(".sk:has(img)");
  const total = await fotos.count();
  expect(total).toBeGreaterThanOrEqual(4);
  for (let i = 0; i < total; i++) {
    await fotos.nth(i).scrollIntoViewIfNeeded();
    await expect(fotos.nth(i)).toHaveClass(/is-loaded/, { timeout: 10_000 });
    await expect(fotos.nth(i).locator("img")).toHaveClass(/is-loaded/);
  }
});

test("rolagem: os blocos entram ao aparecer e o botão flutuante entra e sai", async ({ page }) => {
  await abrir(page);
  const botao = page.locator("#wa-float");
  await expect(botao).toHaveClass(/is-hidden/); // escondido no topo

  // rolagem rápida até o fim: nada pode travar ou devolver a página
  for (let i = 0; i < 40; i++) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(60);
    if (await page.evaluate(() => window.scrollY + window.innerHeight >= document.body.scrollHeight - 2))
      break;
  }
  await expect
    .poll(() => page.evaluate(() => window.scrollY + window.innerHeight >= document.body.scrollHeight - 2))
    .toBe(true);
  await expect(page.locator("#contato .contato-texto")).toHaveClass(/is-in/, { timeout: 5_000 });
  await expect(page.locator(".rv:not(.is-in)")).toHaveCount(0, { timeout: 5_000 });
  await expect(botao).toHaveClass(/is-hidden/); // sai na seção Contato

  await page.mouse.wheel(0, -1600);
  await expect(botao).not.toHaveClass(/is-hidden/, { timeout: 5_000 }); // volta ao subir
});

test("transição leve: rótulo da seção aparece pequeno e some, sem travar a rolagem", async ({ page }) => {
  await abrir(page);
  const rotulo = page.locator('[data-corte="rotulo"]');
  await expect(rotulo).not.toHaveClass(/is-on/); // não aparece ao abrir a página

  const antes = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 900);
  // a rolagem acontece na hora e não é revertida
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(antes + 500);
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(antes + 500);

  await expect(rotulo).toHaveClass(/is-on/);
  await expect(page.locator('[data-corte="texto"]')).not.toBeEmpty();
  // é um rótulo pequeno, não um overlay de tela cheia
  const caixa = await rotulo.boundingBox();
  const tela = page.viewportSize();
  expect(caixa.height).toBeLessThan(80);
  expect(caixa.width).toBeLessThan(tela.width * 0.8);
  await expect(rotulo).not.toHaveClass(/is-on/, { timeout: 4_000 }); // some sozinho
});

test("teclado rola a página normalmente", async ({ page }) => {
  await abrir(page);
  await page.locator("body").click({ position: { x: 5, y: 300 } });
  for (let i = 0; i < 4; i++) await page.keyboard.press("PageDown");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
});

test("link do herói leva à seção certa", async ({ page }) => {
  await abrir(page);
  await page.getByRole("link", { name: "Ver a linha" }).click();
  await expect
    .poll(() =>
      page.evaluate(() => Math.abs(document.querySelector("#produtos").getBoundingClientRect().top)),
    )
    .toBeLessThan(200);
});

test.describe("movimento reduzido", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("tudo aparece sem animação e sem rótulo de transição", async ({ page }) => {
    const erros = await abrir(page);
    await expect(page.locator("#mo-skeleton")).toHaveCount(0, { timeout: 10_000 });
    await expect(page.locator(".rv:not(.is-in)")).toHaveCount(0);
    const animacoes = await page.evaluate(() =>
      [...document.querySelectorAll(".sk")].map((el) => getComputedStyle(el).animationName),
    );
    expect(animacoes.every((n) => n === "none")).toBe(true);
    // rolar não mostra o rótulo nem gira o carimbo
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(400);
    await expect(page.locator('[data-corte="rotulo"]')).not.toHaveClass(/is-on/);
    expect(await page.locator(".carimbo svg").evaluate((el) => el.style.transform)).toBe("");
    expect(erros).toEqual([]);
  });

  test("a rolagem não é travada", async ({ page }) => {
    await abrir(page);
    await page.mouse.wheel(0, 1200);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(600);
  });
});
