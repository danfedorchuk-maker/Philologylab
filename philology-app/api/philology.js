export default async function handler(req, res) {
    // Enable CORS and POST only
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { word, tradition, lang } = req.body;
    
    // Use the same GROQ key you use for the Astrology app
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ analysis: "Babaji says: The linguistic vault is sealed. (Missing GROQ_API_KEY)" });
    }

    // This prompt keeps your custom categories but injects Babaji's personality
    const prompt = `You are Babaji, a 72-year-old blunt philologist. 
    Analyze the word "${word}" from the "${lang}" language and its deep esoteric connection to the "${tradition}" tradition. 
    Dredge the silt: Find the ancient roots, tell me if the history is 'creamy' or 'curdled', and be raw about how the meaning has been corrupted. 
    Use emojis 🤌🧐 and LaTeX for any complex symbols. No academic jargon.`;

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
                        content: prompt
                    },
                    {
                        role: "user",
                        content: "Dredge the silt."
                    }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (data && data.choices && data.choices[0].message) {
            const output = data.choices[0].message.content;
            res.status(200).json({ analysis: output });
        } else {
            const errorMsg = data.error ? data.error.message : "Empty response from Groq.";
            res.status(500).json({ analysis: `Babaji is silent: ${errorMsg}` });
        }
    } catch (error) {
        res.status(500).json({ analysis: "Babaji is silent. The silt has claimed the signal." });
    }
}
