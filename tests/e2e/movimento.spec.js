import { expect, test } from "@playwright/test";
import { abrir } from "./conteudo.js";

const noFim = (page) =>
  page.evaluate(() => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2);

test("lazy loading: só a foto principal carrega com prioridade, o resto espera a rolagem", async ({
  page,
}) => {
  await abrir(page);
  const principal = page.locator(".heroi-cena picture img");
  await expect(principal).toHaveAttribute("fetchpriority", "high");
  await expect(principal).not.toHaveAttribute("loading", "lazy");

  // tudo depois do topo espera a rolagem e já reserva o espaço (largura e altura), para a página não pular
  const depois = page.locator("main .secao img, footer img");
  const total = await depois.count();
  expect(total).toBeGreaterThanOrEqual(10);
  for (let i = 0; i < total; i++) {
    await expect(depois.nth(i)).toHaveAttribute("loading", "lazy");
    await expect(depois.nth(i)).toHaveAttribute("width", /\d+/);
    await expect(depois.nth(i)).toHaveAttribute("height", /\d+/);
  }
  await expect(page.locator("iframe")).toHaveAttribute("loading", "lazy");
});

test("as fotos são servidas em AVIF e WebP, em mais de um tamanho", async ({ page }) => {
  await abrir(page);
  const fotos = page.locator("picture");
  const total = await fotos.count();
  expect(total).toBeGreaterThanOrEqual(10);
  for (let i = 0; i < total; i++) {
    const avif = fotos.nth(i).locator('source[type="image/avif"]').first();
    await expect(avif).toHaveAttribute("srcset", /\.avif \d+w/);
    await expect(fotos.nth(i).locator("img")).toHaveAttribute("srcset", /\.webp \d+w/);
    await expect(fotos.nth(i).locator("img")).toHaveAttribute("sizes", /.+/);
  }
});

test("rolagem: nada trava até o fim e o botão flutuante entra e sai", async ({ page }) => {
  test.slow(); // rola a página inteira: precisa de folga quando a máquina (ou o CI) está ocupada
  await abrir(page);
  const botao = page.locator("#wa-float");
  await expect(botao).toHaveClass(/escondido/); // some no topo, onde já existe o botão de pedido

  // rolagem rápida até o fim: nada pode travar ou devolver a página
  let apareceu = false;
  for (let i = 0; i < 80; i++) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(60);
    const estado = await page.evaluate(() => ({
      escondido: document.getElementById("wa-float").classList.contains("escondido"),
      fim: window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2,
    }));
    if (!estado.escondido) apareceu = true;
    if (estado.fim) break;
  }
  await expect.poll(() => noFim(page)).toBe(true);
  expect(apareceu, "o botão flutuante deveria aparecer no meio da página").toBe(true);
  await expect(botao).toHaveClass(/escondido/); // some na seção de contato

  await page.mouse.wheel(0, -2400);
  await expect(botao).not.toHaveClass(/escondido/, { timeout: 5_000 }); // volta ao subir
});

test("a rolagem acontece na hora e não é revertida", async ({ page }) => {
  await abrir(page);
  const antes = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 1200);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(antes + 500);
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(antes + 500);
  // nenhum overlay de tela cheia cobre a página durante a rolagem
  const cobre = await page.evaluate(() => {
    const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    const estilo = getComputedStyle(el);
    return estilo.position === "fixed" && el.getBoundingClientRect().height >= window.innerHeight;
  });
  expect(cobre).toBe(false);
});

test("teclado rola a página normalmente", async ({ page }) => {
  await abrir(page);
  await page.locator("body").click({ position: { x: 5, y: 300 } });
  for (let i = 0; i < 4; i++) await page.keyboard.press("PageDown");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
});

test("teclado: o primeiro Tab mostra o link de pular para o conteúdo", async ({ page }) => {
  await abrir(page);
  await page.keyboard.press("Tab");
  const pular = page.getByRole("link", { name: "Pular para o conteúdo" });
  await expect(pular).toBeFocused();
  await expect(pular).toBeInViewport();
});

test("link do herói leva à seção de queijos", async ({ page }) => {
  await abrir(page);
  await page.getByRole("link", { name: "Conheça nossos produtos" }).click();
  await expect
    .poll(() => page.evaluate(() => Math.abs(document.querySelector("#queijos").getBoundingClientRect().top)))
    .toBeLessThan(200);
});

test.describe("movimento reduzido", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("tudo aparece sem animação", async ({ page }) => {
    const erros = await abrir(page);
    const blocos = await page.evaluate(() =>
      [...document.querySelectorAll(".revela")].map((el) => {
        const estilo = getComputedStyle(el);
        return { animacao: estilo.animationName, opacidade: estilo.opacity };
      }),
    );
    expect(blocos.length).toBeGreaterThan(5);
    expect(blocos.every((b) => b.animacao === "none" && b.opacidade === "1")).toBe(true);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
    expect(erros).toEqual([]);
  });

  test("a rolagem não é travada", async ({ page }) => {
    await abrir(page);
    await page.mouse.wheel(0, 1200);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(600);
  });
});
