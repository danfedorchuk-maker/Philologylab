export default async function handler(req, res) {
  const apiKey = process.env.API_KEY;
  const { word } = req.body;

  try {
    // This is the specific 2026 stable endpoint for Flash 3
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Perform a philological and institutional intent scan for: " + word }] }]
      })
    });

    const data = await response.json();

    // Handling the "Check the list" error by catching empty responses
    if (data.candidates && data.candidates[0].content) {
        const resultText = data.candidates[0].content.parts[0].text;
        res.status(200).json({ result: resultText });
    } else {
        res.status(200).json({ result: "MODEL ERROR: " + JSON.stringify(data.error || "Model unavailable.") });
    }

  } catch (err) {
    res.status(200).json({ result: "CONNECTION ERROR: " + err.message });
  }
}
