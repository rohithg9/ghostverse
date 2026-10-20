// The game asks: "has this player paid for anything they haven't collected yet?"
// Stripe itself is the record: we find this player's paid checkouts and mark each one collected.
const env = k => (globalThis.Netlify && Netlify.env.get(k)) || process.env[k] || '';
const KEY = () => env('STRIPE_SECRET_KEY') || env('STRIPE_SECRET') || env('STRIPE_KEY');
const api = (path, body) => fetch('https://api.stripe.com/v1/' + path, {method:body ? 'POST' : 'GET', headers:{Authorization:'Bearer ' + KEY(), 'Content-Type':'application/x-www-form-urlencoded'}, body}).then(r => r.json());
const json = (o, st = 200) => new Response(JSON.stringify(o), {status:st, headers:{'content-type':'application/json', 'cache-control':'no-store'}});

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
  try{
    const pid = (new URL(req.url).searchParams.get('pid') || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80);
    if(pid.length < 10) return json({items:[]});
    if(!KEY()) return json({items:[], error:'STRIPE_SECRET_KEY is not set in Netlify'});
    const since = Math.floor(Date.now() / 1000) - 30 * 86400;
    const mine = []; let after = '';
    for(let page = 0; page < 5; page++){
      const r = await api('checkout/sessions?limit=100&created[gte]=' + since + '&expand[]=data.payment_intent.latest_charge' + (after ? '&starting_after=' + after : ''));
      if(r.error) return json({items:[], error:r.error.message});
      for(const s of r.data || []) if(s.client_reference_id === pid && s.payment_status === 'paid') mine.push(s);
      if(!r.has_more || !r.data.length) break; after = r.data[r.data.length - 1].id;
    }
    const items = [];
    for(const s of mine){
      const pi = s.payment_intent; if(!pi || typeof pi !== 'object') continue;
      if(pi.metadata && pi.metadata.gv_claimed) continue;
      const ch = pi.latest_charge; if(ch && typeof ch === 'object' && (ch.refunded || ch.amount_refunded > 0 || ch.disputed)) continue;
      const li = await api('checkout/sessions/' + s.id + '/line_items?limit=10');
      const names = (li.data || []).map(x => x.description || '').join(' | ');
      const item = itemFrom(names, s.amount_total); if(!item) continue;
      const done = await api('payment_intents/' + pi.id, 'metadata[gv_claimed]=' + Date.now() + '&metadata[gv_item]=' + item + '&metadata[gv_player]=' + pid);
      if(done.error) continue;
      items.push({item, session:s.id});
    }
    return json({items});
  }catch(e){ return json({items:[], error:String(e && e.message || e)}, 200); }
};

export const config = { path: '/api/claim' };
