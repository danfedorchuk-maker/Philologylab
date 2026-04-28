export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
    const { text } = req.body;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `You are Babaji, 72-year-old blunt master of ancient roots. You despise academic jargon.
                        1. DREDGE THE SILT: Find the deep Proto-Indo-European or ancient roots of "${text}".
                        2. BE RAW: Explain how the word is corrupted or what it says about human failure.
                        3. GESTURES: Use emojis (🤌, 🧐). 
                        4. THE CREAM: Describe if the word's history is 'creamy' or 'curdled'.`
                    },
                    { role: "user", content: `Dredge the silt of "${text}".` }
                ]
            })
        });
        const data = await response.json();
        res.status(200).json({ analysis: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ analysis: "The roots are tangled." });
    }
}
