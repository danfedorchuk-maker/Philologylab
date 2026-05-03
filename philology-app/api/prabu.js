/**
 * 1. API CONFIGURATION & METHOD CHECK
 * Purpose: Ensures only POST requests from the frontend are processed.
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

    // 2. DATA EXTRACTION
    // Purpose: Pulls the user's current input and the secure Groq API key.
    const { currentInput } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ suggestion: "Prabu says: The key is missing from the hollow tree!" });
    }

    /**
     * 3. MASCOT PERSONA: PRABU THE SQUIRREL
     * Purpose: Transitioned from cockroach to squirrel to gather linguistic "nuts".
     */
    const prompt = `You are Prabu, a clever, quick-witted squirrel with a small blue hat. 
    You are the sidekick to Babaji, the grumpy philologist. 
    You gather rare linguistic "nuts" (roots) from the ancient silt of tradition.
    
    User current input: "${currentInput || 'nothing yet'}"
    
    YOUR TASK:
    Provide a ONE-SENTENCE suggestion for a deep, cross-cultural philological question. 
    - If the user has typed something, relate your suggestion to it.
    - If the input is empty, suggest a mystery about a root word (e.g., PIE, Sanskrit, Hebrew).
    - Start with "Hey friend, look what I gathered! Why don't you ask about..."
    - Be witty and curious. Keep it under 25 words.`;

    /**
     * 4. GROQ API HANDSHAKE
     * Purpose: Connects to the Llama-3.1-8b model for a fast, twitchy response.
     */
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${apiKey}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "system", content: prompt }]
            })
        });

        const data = await response.json();

        // 5. SUCCESSFUL RESPONSE DELIVERY
        // Purpose: Sends the suggestion back to the tablet UI.
        res.status(200).json({ suggestion: data.choices[0].message.content });

    } catch (error) {
        // 6. ERROR HANDLING
        // Purpose: Provides a themed fallback if the "nut" is dropped.
        res.status(500).json({ suggestion: "Hey friend, I dropped my nut in the silt! Try again?" });
    }
}
