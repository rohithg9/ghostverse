// Stripe calls this after every successful Payment Link checkout.
import crypto from 'node:crypto';
import { getStore } from '@netlify/blobs';

const env = k => (globalThis.Netlify && Netlify.env.get(k)) || process.env[k] || '';
const SECRET_KEY = () => env('STRIPE_SECRET_KEY') || env('STRIPE_SECRET') || env('STRIPE_KEY');

function verify(raw, header, secret){
  if(!header || !secret) return false;
  const parts = Object.fromEntries(header.split(',').map(p => { const i = p.indexOf('='); return [p.slice(0, i), p.slice(i + 1)]; }));
  const sigs = header.split(',').filter(p => p.startsWith('v1=')).map(p => p.slice(3));
  const t = parts.t; if(!t || !sigs.length) return false;
  if(Math.abs(Date.now() / 1000 - Number(t)) > 600) return false;
  const expected = crypto.createHmac('sha256', secret).update(t + '.' + raw, 'utf8').digest('hex');
  return sigs.some(s => s.length === expected.length && crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expected)));
}

function itemFrom(text, cents){
  const n = (text || '').toLowerCase();
  if(n.includes('premium')) return 'premium';
  if(n.includes('treasury')) return 'coins_xl';
  if(n.includes('vault')) return 'coins_l';
  if(n.includes('chest')) return 'coins_m';
  if(n.includes('pouch')) return 'coins_s';
  if(n.includes('club')) return 'club';
  if(n.includes('pass')) return 'pass';
  return ({99:'coins_s', 249:'coins_m', 999:'coins_xl'})[cents] || '';
}

export default async (req) => {
  if(req.method !== 'POST') return new Response('ok');
  const raw = await req.text();
  if(!verify(raw, req.headers.get('stripe-signature'), env('STRIPE_WEBHOOK_SECRET'))) return new Response('bad signature', {status:400});
  const evt = JSON.parse(raw);
  if(evt.type !== 'checkout.session.completed' && evt.type !== 'checkout.session.async_payment_succeeded') return new Response('ignored');
  const s = evt.data.object;
  if(s.payment_status !== 'paid') return new Response('not paid yet');
  const pid = (s.client_reference_id || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80);
  let names = '';
  try{
    const r = await fetch('https://api.stripe.com/v1/checkout/sessions/' + s.id + '/line_items?limit=10', {headers:{Authorization:'Bearer ' + SECRET_KEY()}});
    const js = await r.json(); names = (js.data || []).map(li => li.description || (li.price && li.price.nickname) || '').join(' | ');
  }catch(e){}
  const item = itemFrom(names, s.amount_total);
  const store = getStore('purchases');
  const rec = {item, session:s.id, pid, amount:s.amount_total, currency:s.currency, email:(s.customer_details && s.customer_details.email) || '', names, at:Date.now(), claimed:false};
  await store.setJSON('log/' + s.id, rec);
  if(pid && item) await store.setJSON('p/' + pid + '/' + s.id, rec);
  return new Response('stored');
};

export const config = { path: '/api/stripe-webhook' };
