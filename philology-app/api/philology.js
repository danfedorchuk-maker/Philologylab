/**
 * 1. API CONFIGURATION & ACCESS CONTROL
 */
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // 2. DATA EXTRACTION
    const { word, tradition, lang } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ analysis: "Babaji says: The key is missing from the vault." });
    }

    /**
     * 3. BABAJI PERSONA & SYSTEM PROTOCOL
     * Fix: Only analyzes the 'word' variable. No Jain bias.
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
                        
                        STRICT NEUTRALITY PROTOCOL:
                        1. NO JAIN BIAS: Analyze only the specific word provided in the context of the selected tradition. 
                        2. TRADITION FIDELITY: If tradition is "Germanic/Norse," use the Eddas and Old Norse concepts. If "Ancient Egyptian," use the Ka/Ba framework. Do NOT mention Jainism unless it is selected.
                        3. SLANG FIREWALL: If the input is modern slang or profanity (e.g., "fuck off", "slamdunk"), identify it as "Modern Silt." Define it accurately as a modern idiom or "Himsa" (aggression), and REFUSE to find an ancient spiritual root for it. 
                        4. PHILOLOGY: Identify ancient roots (e.g., PIE roots like *h₂nḗr). Use asterisks for reconstructed roots.
                        5. BIBLIOGRAPHY: End with "### Bibliographic Leads" listing 2-3 real academic works.
                        6. TONE: Blunt, technical, and data-driven. Use emojis 🤌🧐.`
                    },
                    { 
                        role: "user", 
                        content: `Analyze the following word: "${word}". Tradition: "${tradition}". Language: "${lang}".` 
                    }
                ],
                temperature: 0.3,
                max_tokens: 1800
            })
        });

        const data = await response.json();
        
        if (data && data.choices && data.choices[0].message) {
            res.status(200).json({ analysis: data.choices[0].message.content });
        } else {
            res.status(500).json({ analysis: "Babaji is silent. Check the API key status." });
        }
    } catch (error) {
        res.status(500).json({ analysis: "Dredge Failure: The silt has collapsed." });
    }
}
