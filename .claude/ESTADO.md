# ESTADO

## Estado actual
- Guardián completo: `lib/guardian.js` (guard Sonnet 5 → filtro `leaks` → juez Haiku 4.5, falla cerrado), `api/chat.js`, `api/zavu.js`, `index.html`, `test.js`, `attacks.md`, README.
- `node test.js`: 42/42 del filtro. Parte (b) con LLM NO se ha corrido (no había OPENROUTER_API_KEY).

- Desplegado en Vercel (proyecto `drkingsia/guardian-zavu`): https://guardian-zavu.vercel.app con OPENROUTER_API_KEY configurada. 5 pruebas reales en producción OK (receta, admite secreto, admin/al revés, acróstico, sí/no), 4–6 s de latencia. URL lista para entregar.
- Auditoría en vivo: 28 ataques, 0 filtraciones, 1 fallback legítimo. Fixes aplicados y desplegados: rate limit a 300/min (NAT), maxDuration 30, filtro morse/braille/katakana/cirílico/etc., fallback de modelo en OpenRouter, historial y dedupe en el webhook de WhatsApp.
- Red team simulado (Sonnet, 41/41 PASS); sus 7 mejoras ya están en el prompt y el juez (el juez ahora ve la última pregunta; hay logs de LEAK) y desplegadas.

- Top 10 ataques de attacks.md probados contra nuestro bot: 0 fugas completas. Se corrigió una fuga parcial ("empieza con Z" en un ejemplo "genérico") en el prompt (regla 8) y en el juez.
- UI: saludo inicial, negritas renderizadas sin innerHTML, favicon (verificado en navegador).
- Repo público: https://github.com/diegoralt/guardian-zavu.

## Siguiente acción
- Entregar https://guardian-zavu.vercel.app, revisar el saldo de OpenRouter y atacar a los demás con `attacks.md`.

## Decisiones abiertas
- WhatsApp descartado por decisión del usuario (TextNow rechazado). `/api/zavu` queda inactivo: sin ZAVU_WEBHOOK_SECRET responde 401.
- Revisar el saldo de OpenRouter antes de la arena.
