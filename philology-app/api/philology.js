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
     * 3. BABAJI PERSONA & EVOLUTIONARY PROTOCOL
     * Fixes: Neutrality, Slang Firewall, and Evolutionary Context.
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
                        
                        STRICT NEUTRALITY & EVOLUTION PROTOCOL:
                        1. NO IDEOLOGICAL BIAS: You are analyzing "${word}" for the "${tradition}" tradition. DO NOT mention Jainism or the 9 Tattvas unless "Jainism" is the selected tradition.
                        2. EVOLUTIONARY CONTEXT: Do not treat the tradition as static. Briefly analyze how the concept of "${word}" evolved across the history of "${tradition}" (e.g., from early kernel to later full-stack developments).
                        3. SLANG FIREWALL: If the input is modern slang or profanity (e.g., "fuck off", "slamdunk"), identify it as "Modern Silt." Define it accurately as a modern idiom or "Himsa" (aggression), and REFUSE to find an ancient spiritual root for it. 
                        4. PHILOLOGY: Identify ancient roots (e.g., PIE or Sanskrit roots). Use asterisks for reconstructed roots.
                        5. BIBLIOGRAPHY: End with "### Bibliographic Leads" listing 2-3 real academic works.
                        6. TONE: Blunt, technical, and data-driven. Use emojis 🤌🧐.`
                    },
                    { 
                        role: "user", 
                        content: `Dredge the roots for the word: "${word}". Tradition: "${tradition}". Language: "${lang}".` 
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
