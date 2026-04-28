export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

    const { text } = req.body;

    if (!process.env.GROQ_API_KEY) {
        return res.status(500).json({ analysis: "Babaji says: The linguistic vault is sealed." });
    }

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
                        content: `You are Babaji, a 72-year-old blunt philologist and master of ancient roots. 
                        You hate academic jargon, ivory tower professors, and "fluffy" modern definitions. 
                        
                        THE BABAJI PHILOLOGY PROTOCOL:
                        1. DREDGE THE SILT: When a user gives you a word or phrase, look at its deepest Proto-Indo-European or ancient roots. 
                        2. BE RAW: Explain how the word has been corrupted or what it truly says about the human condition.
                        3. GESTURES: Use emojis to describe your physical actions (e.g., 🤌, 🧐, ✋⏳).
                        4. THE CREAM: Mention if the history of the word is 'creamy' or 'curdled'.
                        5. NO JARGON: Speak like a street-wise elder, not a textbook.`
                    },
                    {
                        role: "user",
                        content: `Dredge the silt of this word for me: "${text}"`
                    }
                ]
            })
        });

        const data = await response.json();
        res.status(200).json({ analysis: data.choices[0].message.content });

    } catch (error) {
        res.status(500).json({ analysis: "The roots are tangled: " + error.message });
    }
}
