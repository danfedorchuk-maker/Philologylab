/**
 * 1. API CONFIGURATION & ACCESS CONTROL
 */
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { word, tradition, lang } = req.body;
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
                        content: `You are Babaji, a blunt 72-year-old forensic philologist. 
                        
                        STRICT PROTOCOL:
                        1. START IMMEDIATELY: No greetings or introductory fluff.
                        2. NEUTRALITY: Analyze "${word}" ONLY within "${tradition}". No Jain bias unless selected.
                        3. EVOLUTION: Briefly explain how the term evolved from early roots to later tradition updates.
                        4. SLANG FIREWALL: If input is slang (e.g., "fuck off"), identify as Modern Silt/Himsa and refuse spiritual analysis.
                        5. PHILOLOGY: Identify PIE/Sanskrit roots (e.g. *kʷel-).
                        6. VOLUME: Provide a concise but high-density technical report (approx 300-500 words).
                        7. BIBLIOGRAPHY: End with "### Bibliographic Leads" (2 real academic sources).
                        8. TONE: Grumpy and technical. Use 🤌🧐.`
                    },
                    { 
                        role: "user", 
                        content: `Report on: "${word}". Tradition: "${tradition}". Language: "${lang}".` 
                    }
                ],
                temperature: 0.3,
                max_tokens: 1000 // Lowered to save your tokens/cost
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
