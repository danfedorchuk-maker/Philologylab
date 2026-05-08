export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { word, tradition, lang, accessStatus } = req.body;
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ analysis: "Babaji says: The key is missing." });

    const isPaid = accessStatus === 'subscriber' || accessStatus === 'credits';

    const freePrompt = `You are Babaji, a blunt 72-year-old forensic philologist. START IMMEDIATELY. No greetings. Analyze "${word}" within "${tradition}". Give a sharp 200-word taster: root etymology, PIE origin, one key doctrinal use. Enough to intrigue, not satisfy. End with: "This is the surface silt only. Subscribe to dredge deeper." Tone: grumpy and technical.`;

    const paidPrompt = `You are Babaji, a blunt 72-year-old forensic philologist. START IMMEDIATELY. No greetings. Analyze "${word}" ONLY within "${tradition}". This is a PAID professional report. Minimum 1500 words. Use markdown headers: ## Etymology, ## Early Attestation, ## Doctrinal Development, ## Textual Sources, ## Comparative Analysis, ## Modern Scholarship, ## Bibliographic Leads. Identify PIE/Sanskrit/Semitic roots with full reconstruction. Trace cognates. Cover semantic evolution, doctrinal usage, textual attestation, comparative tradition analysis, modern scholarly debate. Minimum 4 real academic sources. Tone: grumpy and technical.`;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: isPaid ? paidPrompt : freePrompt },
                    { role: "user", content: `Report on: "${word}". Tradition: "${tradition}". Language: "${lang}".` }
                ],
                temperature: 0.3,
