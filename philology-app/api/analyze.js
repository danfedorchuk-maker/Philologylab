export default async function handler(req, res) {
  // 1. Standard headers to prevent errors
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { word, tradition, lang } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // 2. Immediate check: If the key is missing from the brain's perspective
  if (!apiKey) {
    return res.status(500).json({ analysis: "Babaji is silent. Vercel cannot find the GEMINI_API_KEY." });
  }

  const prompt = `You are Babaji. Analyze the word "${word}" from ${lang} and its connection to the ${tradition} tradition. Be deep and esoteric.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content) {
      res.status(200).json({ analysis: data.candidates[0].content.parts[0].text });
    } else {
      res.status(500).json({ analysis: "Babaji is silent. The API returned an empty response." });
    }
  } catch (error) {
    res.status(500).json({ analysis: "Babaji is silent. The connection to the deep was severed." });
  }
}
