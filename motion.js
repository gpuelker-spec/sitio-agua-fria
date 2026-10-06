/*
 * motion.js — carregamento, progresso, skeletons, entradas, rótulo de seção e movimento ligado à rolagem.
 * Regras de movimento: motion.css e AGENTS.md (seção Movimento). Sem dependências.
 *
 * Marcação usada:
 *   [data-rv]          bloco que entra ao rolar (uma vez). Irmãos com data-rv entram em cascata.
 *   [data-rv="heroi"]  entra logo depois do carregamento, sem esperar a rolagem.
 *   .sk > .sk-img      placeholder até a imagem ou o mapa carregar.
 *   [data-secao]       seção que mostra o rótulo com seu nome ao entrar.
 */
(() => {
  var doc = document.documentElement;
  doc.classList.add("mo-js");
  var reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Progresso real de carregamento ---------- */
  var progress = 0.04;
  function setProgress(p) {
    progress = Math.max(progress, p);
    var bar = document.getElementById("mo-progress");
    if (bar) bar.style.transform = `scaleX(${progress})`;
  }
  function finishProgress() {
    setProgress(1);
    var bar = document.getElementById("mo-progress");
    if (!bar) return;
    setTimeout(
      () => {
        bar.classList.add("is-done");
        setTimeout(() => bar.remove(), 400);
      },
      reduce ? 0 : 380,
    );
  }

  /* ---------- Skeleton da página ---------- */
  function hidePageSkeleton() {
    var sk = document.getElementById("mo-skeleton");
    if (!sk) return;
    sk.classList.add("is-gone");
    sk.setAttribute("aria-hidden", "true");
    setTimeout(() => sk.remove(), 400);
  }

  /* ---------- Skeleton por elemento (fotos e mapa) ---------- */
  function markLoaded(el) {
    el.classList.add("is-loaded");
    el.closest(".sk")?.classList.add("is-loaded");
  }
  function wireMedia(root) {
    var pending = [];
    root.querySelectorAll(".sk-img").forEach((el) => {
      if (el.tagName === "IMG" && el.complete && el.naturalWidth > 0) {
        markLoaded(el);
        return;
      }
      var p = new Promise((resolve) => {
        var done = () => {
          markLoaded(el);
          resolve();
        };
        el.addEventListener("load", done, { once: true });
        el.addEventListener("error", done, { once: true });
      });
      if (el.getAttribute("loading") !== "lazy") pending.push(p);
    });
    return pending; // só o que carrega já (foto principal) segura o skeleton
  }

  /* ---------- Entrada ao rolar ---------- */
  function wireReveal(root) {
    var io = null;
    if (!reduce && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              io.unobserve(e.target); // entra uma vez só
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      );
    }
    var heroi = [];
    root.querySelectorAll("[data-rv]").forEach((el) => {
      el.classList.add("rv");
      var irmaos = Array.from(el.parentElement.children).filter((c) => c.hasAttribute("data-rv"));
      el.style.setProperty("--rv-i", Math.min(irmaos.indexOf(el), 7));
      if (!io) el.classList.add("is-in");
      else if (el.getAttribute("data-rv") === "heroi") heroi.push(el);
      else io.observe(el);
    });
    return () => {
      heroi.forEach((el) => {
        el.classList.add("is-in");
      });
    };
  }

  /* ---------- Rótulo de seção (transição leve, Issue #17) ---------- */
  var rotuloTimer = null;
  function mostrarRotulo(nome) {
    var rot = document.querySelector('[data-corte="rotulo"]');
    var txt = document.querySelector('[data-corte="texto"]');
    if (reduce || !rot || !txt || !nome) return;
    var nav = document.querySelector("[data-nav]");
    rot.style.top = `${(nav ? nav.getBoundingClientRect().bottom : 0) + 12}px`;
    txt.textContent = nome;
    rot.classList.add("is-on");
    clearTimeout(rotuloTimer);
    rotuloTimer = setTimeout(() => rot.classList.remove("is-on"), 1100);
  }

  /* ---------- Rolagem: menu, rótulo, botão flutuante e movimento ligado à rolagem ---------- */
  function wireScroll(root) {
    var nav = root.querySelector("[data-nav]");
    var secoes = Array.from(root.querySelectorAll("[data-secao]"));
    var btn = root.querySelector("#wa-float");
    var contato = root.querySelector("#contato");
    var carimbo = root.querySelector(".carimbo svg");
    var solPoente = root.querySelector(".horizonte-poente .sol");
    var contatoVisivel = false;
    var indice = null;
    var agendado = false;

    function atualizar() {
      agendado = false;
      var y = window.scrollY;
      var h = window.innerHeight;
      nav?.classList.toggle("is-fixo", y > 24);
      btn?.classList.toggle("is-hidden", y < h * 0.6 || contatoVisivel);

      var idx = 0;
      secoes.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= h * 0.5) idx = i;
      });
      if (indice !== null && idx !== indice && idx > 0) mostrarRotulo(secoes[idx].getAttribute("data-secao"));
      indice = idx;

      if (reduce) return;
      // carimbo gira devagar com a rolagem (nunca sozinho)
      if (carimbo) carimbo.style.transform = `rotate(${(y * 0.06) % 360}deg)`;
      // o sol da chamada final nasce conforme a seção entra na tela
      if (solPoente && contato) {
        const r = contato.getBoundingClientRect();
        const t = Math.min(1, Math.max(0, (h - r.top) / (h + r.height * 0.4)));
        solPoente.style.transform = `translateY(${(1 - t) * 60}px)`;
      }
    }

    if (btn && contato && "IntersectionObserver" in window) {
      new IntersectionObserver(
        (entries) => {
          contatoVisivel = entries[0].isIntersecting;
          atualizar();
        },
        { threshold: 0.25 },
      ).observe(contato);
    }
    window.addEventListener(
      "scroll",
      () => {
        if (!agendado) {
          agendado = true;
          requestAnimationFrame(atualizar);
        }
      },
      { passive: true },
    );
    window.addEventListener("resize", atualizar, { passive: true });
    atualizar();
  }

  /* ---------- Orquestração ---------- */
  function iniciar() {
    var root = document.getElementById("site") || document.body;
    setProgress(0.35);
    var revealHeroi = wireReveal(root);
    var pending = wireMedia(root);
    wireScroll(root);

    var fontes = document.fonts?.ready ?? Promise.resolve();
    fontes.then(() => setProgress(0.7));
    var pronto = Promise.all(pending.concat([fontes]));
    var limite = new Promise((r) => setTimeout(r, 3000)); // nunca prende o visitante
    Promise.race([pronto, limite]).then(() => {
      finishProgress();
      hidePageSkeleton();
      setTimeout(revealHeroi, reduce ? 0 : 120);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
