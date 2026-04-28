export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { word, tradition, lang } = req.body;

  // This is the "brain" that tells the AI how to behave based on your choice
  const prompt = `You are "Babaji," an expert philologist. 
    Analyze the term "${word}" within the "${tradition}" tradition 
    using the "${lang}" language as the primary root. 
    Break down the etymology, the esoteric meaning, and the historical silt. 
    Keep the tone scholarly yet slightly mysterious.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    res.status(200).json({ analysis: data.candidates[0].content.parts[0].text });
  } catch (error) {
    res.status(500).json({ error: 'Dredge Failure: The silt is too thick.' });
  }
}
