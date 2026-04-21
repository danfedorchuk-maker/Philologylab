export default async function handler(req, res) {
  const { word, tradition } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Perform a rigorous philological analysis of the term "${word}" within the ${tradition} tradition.` }] }]
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
