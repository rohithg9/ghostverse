// The game asks: "has this player paid for anything I haven't given them yet?"
// Each purchase can be collected exactly once.
import { getStore } from '@netlify/blobs';

export default async (req) => {
  const url = new URL(req.url);
  const pid = (url.searchParams.get('pid') || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80);
  const json = (o, st = 200) => new Response(JSON.stringify(o), {status:st, headers:{'content-type':'application/json', 'cache-control':'no-store'}});
  if(pid.length < 10) return json({items:[]});
  const store = getStore('purchases');
  const { blobs } = await store.list({prefix:'p/' + pid + '/'});
  const items = [];
  for(const b of blobs){
    const rec = await store.get(b.key, {type:'json'});
    if(!rec || rec.claimed) continue;
    rec.claimed = true; rec.claimedAt = Date.now();
    await store.setJSON(b.key, rec);
    await store.setJSON('log/' + rec.session, rec);
    items.push({item:rec.item, session:rec.session});
  }
  return json({items});
};

export const config = { path: '/api/claim' };
