import Stripe from 'stripe';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    
    if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: 'No Stripe key configured' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { priceId, visitorId } = req.body;

    const SUBSCRIPTION_PRICES = [
        'price_1TUbUqELsv6hW8wtmmCgRu6p',
        'price_1TUbZUELsv6hW8wtmNafMOD7'
    ];

    try {
        const isSubscription = SUBSCRIPTION_PRICES.includes(priceId);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: isSubscription ? 'subscription' : 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://philologylab.vercel.app'}/?paid=true&vid=${visitorId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://philologylab.vercel.app'}/`,
            metadata: { visitorId, priceId }
        });
        res.status(200).json({ url: session.url });
    } catch (e) {
        console.error('Stripe error:', e.message);
        res.status(500).json({ error: e.message });
    }
}
