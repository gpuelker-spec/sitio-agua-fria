/*
 * motion.js — carregamento, progresso, skeletons e entradas do site.
 * Ver motion.css para as regras de movimento. Sem dependências.
 *
 * O site é montado pelo support.js (React) dentro de #dc-root. Este script
 * espera a montagem e então liga: skeletons por elemento, entrada ao rolar,
 * botão flutuante que entra/sai, e encerra a barra de progresso.
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
        setTimeout(() => {
          bar.remove();
        }, 400);
      },
      reduce ? 0 : 380,
    );
  }

  /* ---------- Skeleton da página: sai quando o conteúdo está pronto ---------- */
  function hidePageSkeleton() {
    var sk = document.getElementById("mo-skeleton");
    if (!sk) return;
    sk.classList.add("is-gone");
    sk.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      sk.remove();
    }, 400);
  }

  /* ---------- Skeleton por elemento (fotos e mapa) ---------- */
  function markLoaded(el) {
    el.classList.add("is-loaded");
    var holder = el.closest(".sk");
    if (holder) holder.classList.add("is-loaded");
  }
  function wireMedia(root) {
    var media = root.querySelectorAll(".sk-img");
    var pending = [];
    media.forEach((el) => {
      var done = el.tagName === "IMG" ? el.complete && el.naturalWidth > 0 : false;
      if (done) {
        markLoaded(el);
        return;
      }
      var p = new Promise((resolve) => {
        el.addEventListener(
          "load",
          () => {
            markLoaded(el);
            resolve();
          },
          { once: true },
        );
        el.addEventListener(
          "error",
          () => {
            markLoaded(el);
            resolve();
          },
          { once: true },
        );
      });
      if (el.getAttribute("loading") !== "lazy") pending.push(p);
    });
    return pending; // só o que carrega já (foto principal) entra no progresso
  }

  /* ---------- Entrada ao rolar ---------- */
  var REVEAL = [
    { sel: "#inicio > div:first-child > *", stagger: true, now: true },
    { sel: "#inicio > div:last-child", now: true, delay: 2 },
    { sel: "section[aria-label='Selos']" },
    { sel: "#historia > *", stagger: true },
    { sel: "#produtos > span, #produtos > h2, #produtos > p", stagger: true },
    { sel: "#produtos .card", stagger: true },
    { sel: "#produtos > div:not(:has(> .card))" },
    { sel: "#galeria > span, #galeria figure", stagger: true },
    { sel: "#locais > div:first-child > div:first-child" },
    { sel: "#locais > div:first-child > div:last-child > *", stagger: true },
    { sel: "#locais > div.sk" },
    { sel: "#contato > div" },
  ];

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
    var heroEls = [];
    REVEAL.forEach((group) => {
      var els;
      try {
        els = root.querySelectorAll(group.sel);
      } catch {
        return; // navegador sem suporte a :has()
      }
      els.forEach((el, i) => {
        if (el.classList.contains("rv")) return;
        el.classList.add("rv");
        var idx = (group.delay || 0) + (group.stagger ? Math.min(i, 7) : 0);
        el.style.setProperty("--rv-i", idx);
        if (!io) {
          el.classList.add("is-in");
          return;
        }
        if (group.now) heroEls.push(el);
        else io.observe(el);
      });
    });
    return function revealHero() {
      heroEls.forEach((el) => {
        el.classList.add("is-in");
      });
    };
  }

  /* ---------- Botão flutuante: entra depois do topo, sai no Contato ---------- */
  function wireFloat(root) {
    var btn = root.querySelector("#wa-float");
    if (!btn) return;
    var contato = root.querySelector("#contato");
    var contatoVisivel = false;
    function update() {
      var passouTopo = window.scrollY > window.innerHeight * 0.6;
      btn.classList.toggle("is-hidden", !passouTopo || contatoVisivel);
    }
    if (contato && "IntersectionObserver" in window) {
      new IntersectionObserver(
        (entries) => {
          contatoVisivel = entries[0].isIntersecting;
          update();
        },
        { threshold: 0.25 },
      ).observe(contato);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------- Orquestração ---------- */
  function onMounted(root) {
    setProgress(0.55);
    var revealHero = wireReveal(root);
    var pending = wireMedia(root);
    wireFloat(root);

    var fonts = document.fonts?.ready ? document.fonts.ready : Promise.resolve();
    fonts.then(() => {
      setProgress(0.75);
    });

    // Espera o CSS do design system (injetado pelo template) para não mostrar a página sem estilo
    var styles = new Promise((resolve) => {
      var tries = 0;
      (function check() {
        var link = document.querySelector('link[rel="stylesheet"][href*="ds-styles"]');
        var ok = false;
        try {
          ok = !!link?.sheet?.cssRules.length;
        } catch {
          ok = !!link?.sheet;
        }
        if (ok || tries++ > 60) {
          setProgress(0.65);
          resolve();
          return;
        }
        setTimeout(check, 50);
      })();
    });

    var ready = styles.then(() => {
      var f = document.fonts?.ready ? document.fonts.ready : Promise.resolve();
      return Promise.all(pending.concat([f]));
    });
    var timeout = new Promise((r) => {
      setTimeout(r, 4000);
    }); // nunca prende o usuário
    Promise.race([ready, timeout]).then(() => {
      finishProgress();
      hidePageSkeleton();
      // pequena folga para o skeleton começar a sair antes do herói entrar
      setTimeout(revealHero, reduce ? 0 : 120);
    });
  }

  function waitForMount() {
    var root = document.getElementById("dc-root");
    if (root?.children.length) {
      onMounted(root);
      return;
    }
    var mo = new MutationObserver(() => {
      var r = document.getElementById("dc-root");
      if (r?.children.length && r.querySelector("#inicio")) {
        mo.disconnect();
        onMounted(r);
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setProgress(0.2);
      waitForMount();
    });
  } else {
    setProgress(0.2);
    waitForMount();
  }

  // Falha de segurança: se o site não montar, tira o skeleton e mostra o que houver.
  setTimeout(() => {
    if (document.getElementById("mo-skeleton")) {
      finishProgress();
      hidePageSkeleton();
    }
  }, 8000);
})();
