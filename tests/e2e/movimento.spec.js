import { expect, test } from "@playwright/test";

// Os testes não dependem do Google Maps: o iframe do mapa é bloqueado.
test.beforeEach(async ({ page }) => {
  await page.route(/google\.com\/maps|maps\.google\.com/, (route) => route.abort());
});

async function abrir(page) {
  const erros = [];
  page.on("pageerror", (e) => erros.push(e.message));
  await page.goto("/index.html");
  await expect(page.locator("#dc-root #inicio")).toBeAttached({ timeout: 15_000 });
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
    const img = page.locator(`img[src="${src}"]`);
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

  // rola como uma pessoa (a transição de queijo trava a rolagem por instantes)
  for (let i = 0; i < 60; i++) {
    await page.mouse.wheel(0, 350);
    await page.waitForTimeout(250);
    if (await page.evaluate(() => window.scrollY + window.innerHeight >= document.body.scrollHeight - 2))
      break;
  }
  await expect(page.locator("#contato > div")).toHaveClass(/is-in/, { timeout: 5_000 });
  await expect(page.locator(".rv:not(.is-in)")).toHaveCount(0, { timeout: 5_000 });
  await expect(botao).toHaveClass(/is-hidden/); // sai na seção Contato

  // volta a aparecer ao subir para longe do Contato (rolando como uma pessoa)
  await expect
    .poll(
      async () => {
        await page.mouse.wheel(0, -350);
        await page.waitForTimeout(300);
        return (await botao.getAttribute("class")) || "";
      },
      { timeout: 30_000, intervals: [0] },
    )
    .not.toContain("is-hidden");
});

test.describe("movimento reduzido", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("tudo aparece sem animação e a transição de queijo fica desligada", async ({ page }) => {
    const erros = await abrir(page);
    await expect(page.locator("#mo-skeleton")).toHaveCount(0, { timeout: 10_000 });
    await expect(page.locator(".rv:not(.is-in)")).toHaveCount(0);
    await expect(page.locator("[data-corte]")).toHaveCount(0);
    const animacoes = await page.evaluate(() =>
      [...document.querySelectorAll(".sk")].map((el) => getComputedStyle(el).animationName),
    );
    expect(animacoes.every((n) => n === "none")).toBe(true);
    expect(erros).toEqual([]);
  });

  test("a rolagem não é travada", async ({ page }) => {
    await abrir(page);
    await page.mouse.wheel(0, 1200);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(600);
  });
});
