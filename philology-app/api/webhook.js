import Stripe from 'stripe';
import { kv } from '@vercel/kv';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const visitorId = session.metadata.visitorId;
        const priceId = session.metadata.priceId;

        if (priceId === 'price_1TUbUqELsv6hW8wtmmCgRu6p' || priceId === 'price_1TUbZUELsv6hW8wtmNafMOD7') {
            await kv.set(`philo:paid:${visitorId}`, 'subscription');
        } else if (priceId === 'price_1TUbb7ELsv6hW8wtlwg6pW19') {
            const credits = await kv.get(`philo:credits:${visitorId}`) || 0;
            await kv.set(`philo:credits:${visitorId}`, parseInt(credits) + 1);
        } else if (priceId === 'price_1TUbdHELsv6hW8wtgMCBpXSv') {
            const credits = await kv.get(`philo:credits:${visitorId}`) || 0;
            await kv.set(`philo:credits:${visitorId}`, parseInt(credits) + 3);
        }
    }

    res.status(200).json({ received: true });
}
