export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { word, tradition, lang } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `Analyze the word "${word}" from the ${lang} language and its deep esoteric connection to ${tradition}. Provide a scholarly, philological breakdown. Use LaTeX for symbols.`;

  try {
   // Replace the current fetch line with this one:
// Replace your current fetch line with this one:
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    // This is the fix: Better 'catching' of the response
    if (data && data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
      const output = data.candidates[0].content.parts[0].text;
      res.status(200).json({ analysis: output });
    } else {
      // If Google sends an error message, show it so we can see it
      const errorMsg = data.error ? data.error.message : "Empty response from Google.";
      res.status(500).json({ analysis: `Babaji is silent: ${errorMsg}` });
    }
  } catch (error) {
    res.status(500).json({ analysis: "Babaji is silent. The silt has claimed the signal." });
  }
}
