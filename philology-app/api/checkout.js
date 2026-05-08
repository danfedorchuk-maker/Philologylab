import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const SUBSCRIPTION_PRICES = [
    'price_1TUbUqELsv6hW8wtmmCgRu6p',
    'price_1TUbZUELsv6hW8wtmNafMOD7'
];

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    const { priceId, visitorId } = req.body;

    try {
        const isSubscription = SUBSCRIPTION_PRICES.includes(priceId);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: isSubscription ? 'subscription' : 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?paid=true&vid=${visitorId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
            metadata: { visitorId, priceId }
        });
        res.status(200).json({ url: session.url });
    } catch (e) {
        console.error('Stripe error:', e.message);
        res.status(500).json({ error: e.message });
    }
}
