export default async function handler(req, res) {
  const apiKey = process.env.API_KEY;
  const { word } = req.body;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "System Override: Provide a deep philological analysis for: " + word }] }]
      })
    });

    const data = await response.json();
    
    // This part ensures the website actually gets a string back
    if (data.candidates) {
      res.status(200).json({ result: data.candidates[0].content.parts[0].text });
    } else {
      res.status(200).json({ result: "API Error: " + JSON.stringify(data) });
    }
  } catch (err) {
    res.status(200).json({ result: "Server Error: " + err.message });
  }
}
