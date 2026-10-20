// Stripe pings this after each payment. The game collects purchases through /api/claim.
export default async () => new Response('ok');
export const config = { path: '/api/stripe-webhook' };
