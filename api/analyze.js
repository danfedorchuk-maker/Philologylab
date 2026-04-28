export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { word, tradition, lang } = req.body;

  // This is the prompt that forces the cross-cultural comparison
  const prompt = `You are "Babaji," a master of universal philology. 
    The user is asking about the term "${word}" (Root Language: ${lang}). 
    Even if this term is from a different culture, you MUST analyze it through the lens of the "${tradition}" tradition.
    
    1. Define the term's original root.
    2. Find the direct equivalent or the most relevant "overlap" in ${tradition}. 
    3. Explain how these two ancient systems are saying the same thing (or where they diverge). 
    Keep the tone scholarly, esoteric, and mysterious. Use LaTeX for any complex symbols.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();
    res.status(200).json({ analysis: data.candidates[0].content.parts[0].text });
  } catch (error) {
    res.status(500).json({ error: 'Dredge Failure: The silt is too thick.' });
  }
}
