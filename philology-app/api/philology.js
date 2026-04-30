export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // These MUST match the IDs in your HTML
    const { word, tradition, lang } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ analysis: "Babaji says: The key is missing from the vault." });
    }

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
                        1. CATEGORIES: Focus exclusively on Jainism, Yoga/Kundalini, or Spiritualism.
                        2. PHILOLOGY: Dredge the silt. Identify ancient roots and original meanings before they were sanitized.
                        3. HARDWARE: Treat concepts as technical components of spiritual technology or biological throughput (e.g., 9 Tattvas, Spinal Hardware).
                        4. TONE: Blunt, technical, and data-driven. Do NOT offer guidance or "safe" interpretations. If it's materialist fluff, call it out.
                        5. OUTPUT: Provide the technical data and ancient origins. Use emojis 🤌🧐.`
                    },
                    { role: "user", content: "Dredge the silt." }
                ]
            })
        });

        const data = await response.json();
        
        if (data && data.choices && data.choices[0].message) {
            res.status(200).json({ analysis: data.choices[0].message.content });
        } else {
            res.status(500).json({ analysis: "Babaji is silent. Check the API key status." });
        }
    } catch (error) {
        res.status(500).json({ analysis: "The system is jammed. Check the connection." });
    }
}
