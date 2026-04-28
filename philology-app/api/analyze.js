export default async function handler(req, res) {
  // 1. Allow Vercel to handle the request
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { word, tradition, lang } = req.body;

  // 2. The Instructions for the Brain
  const prompt = `You are "Babaji," a master of universal philology. 
    Analyze the term "${word}" (Source: ${lang}). 
    Bridge it to the "${tradition}" tradition. 
    Explain the deep, esoteric overlap between these systems. 
    Tone: Scholarly, mysterious, and uncompromising. Use LaTeX for math/symbols.`;

  try {
    // 3. The Handshake with Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    // 4. Send the wisdom back to the screen
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      res.status(200).json({ analysis: data.candidates[0].content.parts[0].text });
    } else {
      res.status(500).json({ analysis: "The Oracle is silent. Check the API Key." });
    }
  } catch (error) {
    res.status(500).json({ analysis: "Dredge Failure: The silt is too thick." });
  }
}
