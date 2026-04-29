export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { word, tradition, lang } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // Injection of the Babaji Persona
  const prompt = `You are Babaji, a 72-year-old blunt philologist. 
  Dredge the silt of the word "${word}" from the ${lang} language and its connection to ${tradition}. 
  Be raw, find the ancient roots, and tell me if the history is 'creamy' or 'curdled'. 
  No academic jargon. Use emojis 🤌🧐. Use LaTeX for symbols if needed.`;

  try {
    // UPDATED URL: Using the stable gemini-3-flash
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    if (data && data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
      const output = data.candidates[0].content.parts[0].text;
      res.status(200).json({ analysis: output });
    } else {
      const errorMsg = data.error ? data.error.message : "Empty response from Google.";
      res.status(500).json({ analysis: `Babaji is silent: ${errorMsg}` });
    }
  } catch (error) {
    res.status(500).json({ analysis: "Babaji is silent. The silt has claimed the signal." });
  }
}
