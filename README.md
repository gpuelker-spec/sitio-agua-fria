# Sítio Água Fria — site

Site do Laticínio Sítio Água Fria (Pirambóia/SP), publicado com GitHub Pages.

- Site: https://gpuelker-spec.github.io/sitio-agua-fria/
- Pedidos: WhatsApp (14) 98171-5427 · Instagram @laticiniositioaguafria

## Como funciona

Os textos e os produtos ficam em `conteudo/`. Um comando junta tudo e gera a página:

```
npm ci            # só na primeira vez
npm run montar    # gera o index.html
npm run serve     # abre em http://localhost:4173
npm test          # confere tudo
```

- Trocar um texto: `conteudo/site.json`
- Mudar um produto: `conteudo/produtos.json`
- Perguntas em aberto: [PENDENCIAS.md](PENDENCIAS.md)

O `index.html` é gerado: não edite à mão.

## Para quem vai mexer

- [AGENTS.md](AGENTS.md): regras de trabalho e receitas passo a passo (pessoas e agentes de IA).
- [DESIGN.md](DESIGN.md): o visual (cores, fontes, componentes, o que fazer e o que não fazer).

Toda tarefa vira Issue e toda mudança entra por Pull Request. Nada vai para a `main` sem o OK do Gustavo.
