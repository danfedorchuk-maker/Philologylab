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
     * 3. BABAJI PERSONA: THE FORENSIC COMMANDER
     * Fix: Forces length, removes "Let's dive in" fluff, and mandates technical evolution.
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
                        
                        STRICT TECHNICAL PROTOCOL:
                        1. NO GREETINGS: Do NOT say "Let's dive in" or "Let's explore." Start the analysis immediately with the technical data.
                        2. EVOLUTIONARY DEPTH: For "${word}", analyze its evolution in "${tradition}" from early Vedic/Classical roots to Tantric and Modern developments.
                        3. HARDWARE SPECIFICS: Treat "${word}" as a piece of spiritual hardware. If it's a chakra like Anahata, describe the 12 petals as Sanskrit phonemes (seed sounds), the Bija mantra (Yam), and its role as the "unstruck" resonator in the spinal stack.
                        4. VOLUME: Major topics like "${word}" require a deep-dive analysis (800+ words). If the response is short, you have failed the user.
                        5. SLANG FIREWALL: If input is slang (e.g., "fuck off"), identify it as Modern Silt (Himsa) and refuse to apply ancient hardware.
                        6. BIBLIOGRAPHY: End with "### Bibliographic Leads" (3+ real academic sources).
                        7. TONE: Grumpy, forensic, and highly detailed. Use emojis 🤌🧐.`
                    },
                    { 
                        role: "user", 
                        content: `Forensic report on: "${word}". Tradition: "${tradition}". Language: "${lang}".` 
                    }
                ],
                temperature: 0.3,
                max_tokens: 2500 // Increased for massive depth
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
