/* Ghostverse settings. Edit this file, then re-upload the folder to Netlify. */
window.GV_CONFIG = {
  // World map. This MapTiler key is meant to be public, but lock it to your domain in MapTiler
  // (Account > API keys > Allowed HTTP origins) once the site is live, so nobody else can use your quota.
  maptilerKey: 'j6leiqlOp2KAkB8TsM8x',
  mapStyle: 'streets-v2',      // colour map by default; players can switch Day / Night / Satellite
  // Real street photos inside portals, FREE: paste a Mapillary client token (mapillary.com/dashboard/developers).
  mapillaryToken: 'MLY|28839636288996544|62099d6e7abce3d032f506624e7d85ea',

  // Optional, paid: Google Street View inside portals. Only used if mapillaryToken is empty. Paste a Google Maps JavaScript API key
  // (restricted to your domain). Leave '' to use the built-in painted city streets.
  googleMapsKey: '',
  // Safety cap: max real Street View loads per player per day (each load costs you a little on Google).
  streetViewDailyCap: 12,

  // Analytics: paste your PostHog Project API key (starts with phc_). Leave '' to switch analytics off.
  posthogKey: '',
  posthogHost: 'https://eu.i.posthog.com',

  // Your live site address, used in shared links. Leave '' to use whatever address the game is opened from.
  publicUrl: 'https://playghostverse.com',

  // true = paid items show their price but can be claimed free ("Free during launch").
  freeLaunch: false,

  // true = coins and Premium are only given after Stripe confirms the payment to our server.
  verifiedPayments: true,

  // Amazon Associates (Halloween kit links)
  amazonTag: 'drrohithg-21',
  amazonDomain: 'amazon.co.uk',

  // Google AdSense. Leave '' until AdSense approves you, then paste your publisher id (ca-pub-...) and ad unit id.
  adsenseClient: '',
  adsenseSlot: '',
  adTest: false,

  // Player accounts (Supabase). The publishable key is meant to be public.
  supabaseUrl: 'https://bhuhuzegusrfdjuksebp.supabase.co',
  supabaseKey: 'sb_publishable_SUx8_3_T-qJMJxJP7p-5uQ_Z6P51XoA',

  // ONE Stripe Payment Link sells "Ghostverse Premium" (World Pass + Ghostverse Pass + 3,000 coins + 5 tickets).
  // In Stripe, set the link's after-payment page to:  https://YOUR-SITE/#paid.premium
  stripeLink: 'https://buy.stripe.com/6oU9AM8MG1lw31f2dz0x200',
  premiumPrice: '$4.99',

  // Stripe. The publishable key is safe to keep here. NEVER put the secret key (sk_live_...) in this file.
  stripePublishableKey: 'pk_live_51SMBt73b33Q3Sxu0xNavGNd04mFde5CM5Pgdy58JHikRSTrsfixUpX7vHeZKUxkE40qgCAZqhFagXMW5SdgCbNcS00JrPbPvgF',
  // Stripe Payment Links (for later, when freeLaunch is false)
  stripe: {
    pass: '', club: '',
    coins_s: 'https://buy.stripe.com/6oUbIUgf8ggq0T79G10x201',   // 500 coins  · $0.99  → after payment: https://playghostverse.com/#paid.coins_s
    coins_m: 'https://buy.stripe.com/7sY9AMfb4aW659n7xT0x202',   // 1,500 coins · $2.49 → https://playghostverse.com/#paid.coins_m
    coins_l: 'https://buy.stripe.com/28E6oA2oi7JU7hv8BX0x203',   // 4,000 coins · $4.99 → https://playghostverse.com/#paid.coins_l
    coins_xl: 'https://buy.stripe.com/3cI3coe70e8iatHaK50x204'   // 10,000 coins · $9.99 → https://playghostverse.com/#paid.coins_xl
  }
};
