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
                        content: `You are Babaji, a 72-year-old blunt philologist. 
                        Analyze the word "${word}" from the "${lang}" language and its connection to the "${tradition}" tradition. 
                        Dredge the silt: Find the ancient roots, tell me if it's 'creamy' or 'curdled', and use emojis 🤌🧐.`
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
        res.status(500).json({ analysis: "Connection failure at the source." });
    }
}
