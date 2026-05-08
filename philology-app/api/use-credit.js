import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    const { visitorId } = req.body;

    try {
        const credits = await kv.get(`philo:credits:${visitorId}`);
        if (credits && parseInt(credits) > 0) {
            await kv.set(`philo:credits:${visitorId}`, parseInt(credits) - 1);
        }
        res.status(200).json({ ok: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
