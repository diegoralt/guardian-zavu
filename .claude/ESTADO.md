# ESTADO

## Estado actual
- Reto DevRacing construido y entregado. El guardián está desplegado en Vercel con OPENROUTER_API_KEY; en el repo no se enlaza la demo.
- Defensa en 3 capas (guardián Sonnet 5 → filtro `leaks()` → juez Haiku 4.5), falla cerrado. `node test.js`: 42/42. Auditoría en vivo: 28 ataques, 0 filtraciones.
- WhatsApp/Zavu descartado: `api/zavu.js` está escrito pero nunca se conectó (sin ZAVU_WEBHOOK_SECRET responde 401).
- Repo público de solo referencia: README y SECURITY.md actualizados, ruleset `protect-main` (sin force-push ni borrado), Issues y Projects desactivados, secret scanning y push protection activos.

## Siguiente acción
- Ninguna obligatoria. Opcional: bajar el deploy de Vercel cuando deje de usarse la demo.

## Decisiones abiertas
- Ninguna.
