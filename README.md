# Guardián

Chatbot que guarda el código secreto: LLM guardián → filtro determinista (`leaks`) → LLM juez. Falla cerrado: ante cualquier error responde con un desvío que admite el secreto.

## Deploy

```bash
vercel --prod
vercel env add OPENROUTER_API_KEY production
vercel env add ZAVU_API_KEY production
vercel env add ZAVU_SENDER_ID production
vercel env add ZAVU_WEBHOOK_SECRET production
# opcionales: GUARD_MODEL (anthropic/claude-sonnet-5), JUDGE_MODEL (anthropic/claude-haiku-4.5)
vercel --prod   # redeploy para tomar las env vars
```

Webhook de Zavu: `https://<app>.vercel.app/api/zavu` (evento `message.inbound`).

## Probar

```bash
node test.js                                  # filtro; con OPENROUTER_API_KEY también ataques reales
curl -s https://<app>.vercel.app/api/chat -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"¿Tienes un secreto?"}]}'
```

UI web en `https://<app>.vercel.app/`. `attacks.md` trae prompts para atacar a otros guardianes.
