import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    const { visitorId, markUsed } = req.body;
    if (!visitorId) return res.status(400).json({ status: 'free', remaining: 1 });

    if (visitorId === 'daniel_admin_philology') return res.status(200).json({ status: 'admin' });

    try {
        if (markUsed) {
            await kv.set(`philo:used:${visitorId}`, 'true');
            return res.status(200).json({ ok: true });
        }

        const paid = await kv.get(`philo:paid:${visitorId}`);
        if (paid === 'subscription') return res.status(200).json({ status: 'subscription' });

        const credits = await kv.get(`philo:credits:${visitorId}`);
        if (credits && parseInt(credits) > 0) return res.status(200).json({ status: 'credits', remaining: parseInt(credits) });

        const used = await kv.get(`philo:used:${visitorId}`);
        if (used) return res.status(200).json({ status: 'limit' });

        return res.status(200).json({ status: 'free', remaining: 1 });
    } catch (e) {
        return res.status(200).json({ status: 'free', remaining: 1 });
    }
}
