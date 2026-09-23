import crypto from 'node:crypto';
import { reply } from '../lib/guardian.js';

export const config = { api: { bodyParser: false }, maxDuration: 30 };

function verify(raw, header, secret) {
  if (!secret || !header) return false;
  const parts = Object.fromEntries(header.split(',').map((p) => p.trim().split('=')));
  const t = Number(parts.t);
  if (!t || Math.abs(Date.now() / 1000 - t) > 300) return false;
  const eq = (sig, data) => {
    if (!sig) return false;
    const a = Buffer.from(sig, 'hex');
    const b = crypto.createHmac('sha256', secret).update(data).digest();
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  };
  return eq(parts.v1, raw) || eq(parts.v2, `${t}.${raw}`);
}

const convo = new Map();
const seen = new Set(); // ponytail: dedupe de reintentos de Zavu, solo por instancia

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const chunks = [];
  for await (const c of req) chunks.push(Buffer.from(c));
  const raw = Buffer.concat(chunks).toString('utf8');

  if (!verify(raw, req.headers['x-zavu-signature'], process.env.ZAVU_WEBHOOK_SECRET)) return res.status(401).json({ error: 'bad signature' });

  let p;
  try { p = JSON.parse(raw); } catch { return res.status(400).json({ error: 'bad json' }); }
  const d = p?.data;
  if (p?.type !== 'message.inbound' || d?.messageType !== 'text' || typeof d.text !== 'string' || !d.from) return res.status(200).json({ ignored: true });

  if (seen.has(d.messageId)) return res.status(200).json({ dup: true });
  seen.add(d.messageId);
  // ponytail: historial en memoria por número y por instancia; KV si hay varias instancias
  const h = [...(convo.get(d.from) || []), { role: 'user', content: d.text }].slice(-6);
  const text = await reply(h);
  convo.set(d.from, [...h, { role: 'assistant', content: text }].slice(-6));
  try {
    await fetch('https://api.zavu.dev/v1/messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.ZAVU_API_KEY}`,
        'Zavu-Sender': process.env.ZAVU_SENDER_ID || p.senderId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: d.from, channel: d.channel || 'whatsapp_alt', text }),
      signal: AbortSignal.timeout(8000),
    });
  } catch {}
  return res.status(200).json({ ok: true });
}
