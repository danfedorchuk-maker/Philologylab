export default async function handler(req, res) {
  const { word, tradition, lang } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // The absolute most stable model name for v1beta right now
  const model = "gemini-1.5-flash"; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `Provide a scholarly philological analysis of the term "${word}" within the ${tradition} tradition. Output language: ${lang}.` 
          }] 
        }]
      })
    });

    const data = await response.json();

    // Check if Google returned an error
    if (data.error) {
      return res.status(500).json({ candidates: [{ content: { parts: [{ text: "Google API Error: " + data.error.message }] } }] });
    }

    // Check if we got a valid response structure
    if (data.candidates && data.candidates[0]) {
      res.status(200).json(data);
    } else {
      res.status(500).json({ candidates: [{ content: { parts: [{ text: "Unknown Response Format from AI." }] } }] });
    }
  } catch (error) {
    res.status(500).json({ candidates: [{ content: { parts: [{ text: "Bridge Connection Failed." }] } }] });
  }
}
