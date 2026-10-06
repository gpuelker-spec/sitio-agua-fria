// Conventional Commits: <tipo>(escopo opcional): descrição em português
// Tipos: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // descrições em português começam com verbo ("adiciona", "corrige") e podem ter acento
    "subject-case": [0],
    "header-max-length": [2, "always", 100],
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
  },
};
