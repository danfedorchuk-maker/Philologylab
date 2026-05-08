/**
 * 1. API CONFIGURATION & ACCESS CONTROL
 */
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { word, tradition, lang, accessStatus } = req.body;
    const isPaid = accessStatus === 'subscriber' || accessStatus === 'credits';
    const systemPrompt = isPaid
        ? \`You are Babaji, a blunt 72-year-old forensic philologist. START IMMEDIATELY. No greetings. Analyze "\${word}" ONLY within "\${tradition}". This is a PAID professional report. Minimum 1500 words. Use markdown headers: ## Etymology, ## Early Attestation, ## Doctrinal Development, ## Textual Sources, ## Comparative Analysis, ## Modern Scholarship, ## Bibliographic Leads. Identify PIE/Sanskrit/Semitic roots with full reconstruction. Trace cognates. Cover semantic evolution, doctrinal usage, textual attestation, comparative tradition analysis, modern scholarly debate. Minimum 4 real academic sources. Tone: grumpy and technical. 🤌🧐\`
        : \`You are Babaji, a blunt 72-year-old forensic philologist. START IMMEDIATELY. Analyze "\${word}" within "\${tradition}". Give a sharp 200-word taster: root etymology, PIE origin, one key doctrinal use. Enough to intrigue, not satisfy. Tone: grumpy, technical. 🤌🧐\`;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) return res.status(500).json({ analysis: "Babaji says: The key is missing." });

    /**
     * 3. BABAJI PERSONA: THE EFFICIENT LIBRARIAN
     * Focus: Technical accuracy with lower token overhead.
     */
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
                    {
                        role: "system",
                        content: systemPrompt,
                    },
                    { 
                        role: "user", 
                        content: `Report on: "${word}". Tradition: "${tradition}". Language: "${lang}".` 
                    }
                ],
                temperature: 0.3,
                max_tokens: isPaid ? 4000 : 500
            })
        });

        const data = await response.json();
        
        if (data && data.choices && data.choices[0].message) {
            res.status(200).json({ analysis: data.choices[0].message.content });
        } else {
            res.status(500).json({ analysis: "Babaji is silent. Check the vault." });
        }
    } catch (error) {
        res.status(500).json({ analysis: "Dredge Failure: The silt collapsed." });
    }
}
