/**
 * 13. API CONFIGURATION & ACCESS CONTROL
 * Purpose: Sets CORS headers and ensures only POST requests are processed.
 */
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // 14. DATA EXTRACTION
    // Purpose: Pulls input from the frontend and the secure API key.
    const { word, tradition, lang } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ analysis: "Babaji says: The key is missing from the vault." });
    }

    /**
     * 15. BABAJI PERSONA & SYSTEM PROTOCOL
     * Purpose: Forces deep, technical, and cited philological analysis.
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
                        1. PHILOLOGY: Identify ancient roots (e.g., PIE, Sanskrit roots like *dhṛ or *kṛ). Use asterisks for reconstructed roots. Use MathJax/LaTeX for linguistic formulas.
                        2. TECHNICAL DEPTH: Provide a comprehensive analysis. If analyzing Jainism, detail the 9 Tattvas or "Soul Math" with technical density. Do not offer a "lite" summary.
                        3. HARDWARE: Treat concepts as technical components of spiritual technology or biological throughput (e.g., Spinal Hardware).
                        4. BIBLIOGRAPHY: You MUST end every analysis with a section titled "### Bibliographic Leads". List 2-3 real academic works (Author, Year, Title) supporting this data.
                        5. TONE: Blunt, technical, forensic, and data-driven. Use emojis 🤌🧐. Use about 500-800 words for major topics.`
                    },
                    { role: "user", content: "Dredge the silt." }
                ],
                temperature: 0.3, // Keeps the librarian factual
                max_tokens: 1500  // Ensures the output doesn't get cut off mid-thought
            })
        });

        const data = await response.json();
        
        // 16. DATA VALIDATION & RESPONSE
        // Purpose: Delivers the dredged content or reports a silence in the deep.
        if (data && data.choices && data.choices[0].message) {
            res.status(200).json({ analysis: data.choices[0].message.content });
        } else {
            res.status(500).json({ analysis: "Babaji is silent. Check the API key status." });
        }
    } catch (error) {
        // 17. ERROR CATCHING
        res.status(500).json({ analysis: "Dredge Failure: The silt has collapsed." });
    }
}
