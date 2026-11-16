import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

// index.html, sitemap.xml, robots.txt e PENDENCIAS.md são gerados por "npm run montar".
// Este teste roda no CI e falha se alguém mudou o conteúdo sem montar de novo, ou editou o index.html à mão.
test("os arquivos gerados estão em dia com conteudo/, modelo/ e estilo/", () => {
  const raiz = fileURLToPath(new URL("../..", import.meta.url));
  let saida = "";
  try {
    saida = execFileSync(process.execPath, ["scripts/montar.mjs", "--conferir"], {
      cwd: raiz,
      encoding: "utf8",
    });
  } catch (erro) {
    saida = `${erro.stdout ?? ""}${erro.stderr ?? ""}`;
  }
  expect(saida).toContain("Site em dia com o conteúdo.");
});
