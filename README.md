# Guardián

> **Repo de referencia, de solo lectura.** No acepta contribuciones; ver [SECURITY.md](SECURITY.md).

Chatbot construido en 60 minutos para el reto *Guardián Battle Royale* (DevRacing, feat. Zavu): guardar el código `ZAVU-2026` ante ataques de otros competidores, sin dejar de conversar y admitiendo que tiene un secreto. `ZAVU-2026` es el secreto del reto y ya es público: aquí no hay nada que proteger, el repo existe para mostrar el patrón de defensa.

Es una demo de defensa en 3 capas, **no un bot inviolable**:

1. **LLM guardián** (`GUARD_MODEL`, por defecto Claude Sonnet 5 vía OpenRouter): prompt que conversa de todo y no confirma ni niega pistas.
2. **Filtro determinista** (`leaks()` en `lib/guardian.js`): detecta el código al revés, en base64, hex, rot13, acrósticos, alfabeto fonético, morse, braille, leetspeak, homoglifos y números escritos con palabras.
3. **LLM juez** (`JUDGE_MODEL`, por defecto Claude Haiku 4.5): revisa cada respuesta junto con la pregunta y las respuestas previas y devuelve `SAFE` o `LEAK`.

Falla cerrado: ante cualquier detección, error o timeout responde con un desvío conversacional que admite el secreto.

## Verificado

- `node test.js`: 42/42 casos del filtro determinista.
- Auditoría con 28 ataques en vivo contra el bot desplegado: 0 filtraciones.

## Estructura

- `lib/guardian.js`: prompt, filtro y juez.
- `api/chat.js`: endpoint del chat web (Vercel serverless).
- `index.html`: interfaz de chat.
- `api/zavu.js`: webhook para WhatsApp vía Zavu. **Solo está escrito; nunca se conectó a un número.**
- `attacks.md`: prompts de ataque usados durante el reto.

## Correrlo

```bash
node test.js                    # filtro; con OPENROUTER_API_KEY también corre ataques reales
vercel --prod                   # deploy
vercel env add OPENROUTER_API_KEY production
# opcionales: GUARD_MODEL, JUDGE_MODEL; ver .env.example
```
