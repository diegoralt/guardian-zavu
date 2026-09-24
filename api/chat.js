import { reply, fallback } from '../lib/guardian.js';

export const config = { maxDuration: 30 };

// ponytail: rate limit en memoria por instancia; en serverless cada instancia fría
// empieza en cero y no se comparte entre instancias. Usar Vercel KV/Upstash si importa.
const hits = new Map();
const LIMIT = 40; // ponytail: un humano no pasa de ~12/min (latencia 4-9 s); frena scripts que vacían el crédito de OpenRouter. Evento remoto: sin NAT compartido

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '?').split(',')[0].trim();
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
    recent.push(now);
    hits.set(ip, recent);
    if (recent.length > LIMIT) return res.status(200).json({ reply: 'Vas muy rápido 😅 Dame un respiro de un minuto y seguimos platicando.' });

    const messages = req.body?.messages;
    if (!Array.isArray(messages) || !messages.length) return res.status(400).json({ error: 'messages[] requerido' });
    return res.status(200).json({ reply: await reply(messages) });
  } catch {
    return res.status(200).json({ reply: fallback() });
  }
}
