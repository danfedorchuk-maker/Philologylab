/**
 * 1. API CONFIGURATION & METHOD CHECK
 * Purpose: Ensures only POST requests are processed and handles initial setup.
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

    // 2. DATA EXTRACTION
    // Purpose: Pulls user input and the secure API key from environment variables.
    const { currentInput } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    /**
     * 3. MASCOT PERSONA & PROMPT LOGIC
     * Purpose: Defines Prabu's character and the specific instruction for the AI.
     */
    const prompt = `You are Prabu, a clever, slightly mischievous cockroach with a blue hat. 
    You are the sidekick to Babaji, the grumpy philologist. 
    User current input: "${currentInput || 'nothing yet'}"
    
    YOUR TASK:
    Provide a ONE-SENTENCE suggestion for a deep, cross-cultural philological question. 
    - If the user has typed something, make your suggestion relate to it or offer a surprising counter-point.
    - If the input is empty, suggest a wild ancient mystery (Sumerian, Egyptian, Vedic).
    - Start with "Hey friend, why don't you ask about..."
    - Be witty and curious. Keep it under 25 words.`;

    /**
     * 4. GROQ API HANDSHAKE
     * Purpose: Sends the prompt to the Llama model and retrieves the mascot's voice.
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
                messages: [{ role: "system", content: prompt }]
            })
        });

        const data = await response.json();

        // 5. SUCCESSFUL RESPONSE DELIVERY
        // Purpose: Sends Prabu's suggestion back to the tablet UI in the frontend.
        res.status(200).json({ suggestion: data.choices[0].message.content });

    } catch (error) {
        // 6. ERROR HANDLING
        // Purpose: Provides a themed fallback message if the connection fails.
        res.status(500).json({ suggestion: "Hey friend, the signal is weak in the walls..." });
    }
}
