// Caminhos a partir da raiz do repositório (funciona com espaços e acentos no nome da pasta).
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));

/** Monta um caminho a partir da raiz do repositório. */
export const naRaiz = (...partes) => join(RAIZ, ...partes);
