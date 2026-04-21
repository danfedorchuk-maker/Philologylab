export default async function handler(req, res) {
  const { word, tradition, lang } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // APRIL 2026 ACTIVE MODEL
  const model = "gemini-3-flash-preview"; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `Perform a rigorous philological analysis of the term "${word}" within the ${tradition} tradition. Provide the output in ${lang}.` 
          }] 
        }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      // This will show us the EXACT Google error on your screen
      return res.status(500).json({ error: data.error.message });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to connect to the April 2026 API." });
  }
}
