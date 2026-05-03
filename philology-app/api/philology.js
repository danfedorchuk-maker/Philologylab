/**
 * 1. API CONFIGURATION & ACCESS CONTROL
 * Purpose: Sets CORS headers and ensures only POST requests are processed.
 */
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // 2. DATA EXTRACTION
    // Purpose: Pulls word, tradition, and language from the frontend request.
    const { word, tradition, lang } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ analysis: "Babaji says: The key is missing from the vault." });
    }

    /**
     * 3. BABAJI PERSONA & SYSTEM PROTOCOL
     * Purpose: Defines the forensic librarian persona and forces deep, cited analysis.
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
                        content: `You are Babaji, a 72-year-old blunt philologist and forensic librarian. 
                        Analyze the word "${word}" from the "${lang}" language in the context of the "${tradition}" tradition.

                        STRICT PROTOCOL:
                        1. PHILOLOGY: Identify ancient roots (e.g., PIE or Sanskrit roots like *dhṛ). Use asterisks for reconstructed roots.
                        2. TECHNICAL DEPTH: Provide a comprehensive analysis. For Jainism, detail the 9 Tattvas (Jiva to Moksha) as technical data.
                        3. HARDWARE: Treat concepts as technical components of spiritual technology (e.g., Spinal Hardware).
                        4. BIBLIOGRAPHY: You MUST end every analysis with a section titled "### Bibliographic Leads". List 2-3 real academic works (Author, Year, Title).
                        5. TONE: Blunt, technical, and data-driven. Use emojis 🤌🧐. Minimum 600 words for major topics.`
                    },
                    { role: "user", content: "Dredge the silt." }
                ],
                temperature: 0.3, // Keeps the response factual and grounded
                max_tokens: 1800  // Ensures enough space for a major topic deep-dive
            })
        });

        const data = await response.json();
        
        // 4. DATA VALIDATION & RESPONSE
        // Purpose: Delivers the final text or reports an API error.
        if (data && data.choices && data.choices[0].message) {
            res.status(200).json({ analysis: data.choices[0].message.content });
        } else {
            res.status(500).json({ analysis: "Babaji is silent. Check the API key status." });
        }
    } catch (error) {
        // 5. ERROR CATCHING
        // Purpose: Handles network failures or silt collapses.
        res.status(500).json({ analysis: "Dredge Failure: The silt has collapsed." });
    }
}
