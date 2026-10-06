import { expect, test } from "@playwright/test";

const URL_SITE = "https://gpuelker-spec.github.io/sitio-agua-fria/";

test.beforeEach(async ({ page }) => {
  await page.goto("/index.html");
  await expect(page.locator("#inicio")).toBeAttached({ timeout: 15_000 });
});

const meta = (page, attr, nome) => page.locator(`meta[${attr}="${nome}"]`);

test("título e descrição para o Google", async ({ page }) => {
  const titulo = await page.title();
  expect(titulo).toContain("Sítio Água Fria");
  expect(titulo.length).toBeLessThanOrEqual(70);
  const desc = await meta(page, "name", "description").getAttribute("content");
  expect(desc.length).toBeGreaterThan(70);
  expect(desc.length).toBeLessThanOrEqual(160);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", URL_SITE);
});

test("prévia de compartilhamento (Open Graph) completa e com imagem que existe", async ({
  page,
  request,
}) => {
  for (const p of ["og:title", "og:description", "og:url", "og:image", "og:locale", "og:type"]) {
    await expect(meta(page, "property", p), `${p} ausente`).toHaveAttribute("content", /.+/);
  }
  await expect(meta(page, "property", "og:locale")).toHaveAttribute("content", "pt_BR");
  const img = await meta(page, "property", "og:image").getAttribute("content");
  expect(img.startsWith(URL_SITE)).toBe(true); // WhatsApp exige endereço absoluto
  const arquivo = img.replace(URL_SITE, "/");
  const resp = await request.get(arquivo);
  expect(resp.status()).toBe(200);
  expect(resp.headers()["content-type"]).toContain("image/jpeg");
  await expect(meta(page, "property", "og:image:width")).toHaveAttribute("content", "1200");
  await expect(meta(page, "property", "og:image:height")).toHaveAttribute("content", "630");
});

test("dados estruturados de negócio local válidos e coerentes com o site", async ({ page }) => {
  const bruto = await page.locator('script[type="application/ld+json"]').textContent();
  const ld = JSON.parse(bruto);
  expect(ld["@type"]).toBe("LocalBusiness");
  expect(ld.name).toContain("Sítio Água Fria");
  expect(ld.url).toBe(URL_SITE);
  expect(ld.address.streetAddress).toContain("Marechal Rondon, km 218");
  // o telefone dos dados estruturados é o mesmo número dos links de WhatsApp
  const digitos = ld.telephone.replace(/\D/g, "");
  const wa = await page.locator('a[href*="wa.me"]').first().getAttribute("href");
  expect(wa).toContain(digitos);
  expect(ld.sameAs).toContain("https://instagram.com/laticiniositioaguafria");
  // o mapa do site aponta para as mesmas coordenadas dos dados estruturados
  const mapa = await page.locator("iframe").getAttribute("src");
  expect(mapa).toContain(`${ld.geo.latitude},${ld.geo.longitude}`);
  await expect(page.getByRole("link", { name: "Abrir no Google Maps" })).toHaveAttribute("href", ld.hasMap);
});

test("robots.txt e sitemap.xml publicados", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain(`Sitemap: ${URL_SITE}sitemap.xml`);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain(`<loc>${URL_SITE}</loc>`);
});
