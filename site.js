// Pequenos comportamentos do site. O conteúdo NÃO depende deste arquivo:
// sem JavaScript a página aparece inteira e todos os links funcionam.
// Regra: nunca interceptar wheel, touchmove ou teclas (isso trava a rolagem).

// 1. Menu do celular: fecha ao escolher uma seção.
const menu = document.getElementById("menu");
if (menu && typeof menu.hidePopover === "function") {
  menu.addEventListener("click", (evento) => {
    if (evento.target.closest("a") && menu.matches(":popover-open")) menu.hidePopover();
  });
}

// 2. Botão flutuante de pedido: some enquanto outro botão de pedido já está na tela
//    (o do topo e a seção de contato), para não ficar repetido.
const flutuante = document.getElementById("wa-float");
const vizinhos = [document.querySelector("[data-pedir-topo]"), document.getElementById("contato")].filter(
  Boolean,
);
if (flutuante && vizinhos.length > 0 && "IntersectionObserver" in window) {
  const visiveis = new Set();
  const observador = new IntersectionObserver((entradas) => {
    for (const entrada of entradas) {
      if (entrada.isIntersecting) visiveis.add(entrada.target);
      else visiveis.delete(entrada.target);
    }
    flutuante.classList.toggle("escondido", visiveis.size > 0);
  });
  for (const vizinho of vizinhos) observador.observe(vizinho);
}

// 3. Monitoramento de erros (Sentry): entra só depois que a página carregou,
//    para não disputar a conexão com a foto do topo. O código fica em src/sentry.js.
function carregarSentry() {
  const script = document.createElement("script");
  script.src = "sentry.min.js";
  document.head.append(script);
}
if (document.readyState === "complete") carregarSentry();
else window.addEventListener("load", carregarSentry, { once: true });
