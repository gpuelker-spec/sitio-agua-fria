// Observabilidade: envia ao Sentry os erros de JavaScript que acontecem no navegador dos visitantes.
// Gerado em sentry.min.js por `npm run build:sentry`. Não edite sentry.min.js à mão.
import * as Sentry from "@sentry/browser";

// Só monitora o site publicado. Em localhost (testes e desenvolvimento) nada é enviado.
const PRODUCAO = /(^|\.)github\.io$|(^|\.)sitioaguafria\.com\.br$/;

if (PRODUCAO.test(window.location.hostname)) {
  Sentry.init({
    dsn: "https://4cc2cbd5788a3ef1712cd5c77f60a994@o4512211141918720.ingest.us.sentry.io/4512211146899456",
    environment: "producao",
    // LGPD: não coleta IP, cookies nem dados pessoais. Sem gravação de sessão (Session Replay).
    sendDefaultPii: false,
    // Só erros; sem medição de desempenho, para ficar dentro do plano gratuito.
    tracesSampleRate: 0,
    // Ignora ruído que não é do site (extensões do navegador, scripts de terceiros).
    denyUrls: [/extensions\//i, /^chrome:\/\//i, /^moz-extension:\/\//i, /^safari-extension:\/\//i],
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications",
    ],
  });

  // Teste manual: abra o site com #teste-sentry no fim do endereço para enviar um erro proposital.
  if (window.location.hash === "#teste-sentry") {
    Sentry.captureException(new Error("Teste do Sentry: erro proposital disparado pelo Gustavo"));
  }
}
