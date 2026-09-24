# ESTADO

## Estado actual
- Reto DevRacing construido y entregado. Proyecto de Vercel eliminado (demo fuera de línea, 404); el repo queda solo como referencia.
- Defensa en 3 capas (guardián Sonnet 5 → filtro `leaks()` → juez Haiku 4.5), falla cerrado. `node test.js`: 42/42. Auditoría en vivo: 28 ataques, 0 filtraciones.
- WhatsApp/Zavu descartado: `api/zavu.js` está escrito pero nunca se conectó (sin ZAVU_WEBHOOK_SECRET responde 401).
- Repo público de solo referencia: README y SECURITY.md actualizados, ruleset `protect-main` (sin force-push ni borrado), Issues y Projects desactivados, secret scanning y push protection activos.

## Siguiente acción
- Ninguna. Proyecto cerrado (key de OpenRouter revocada).

## Decisiones abiertas
- Ninguna.
