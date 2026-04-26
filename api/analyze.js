export default async function handler(req, res) {
  // CORS Headers to allow the Android App to connect
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle the "pre-flight" check from the phone
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { word, tradition, lang } = req.body;
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
        contents: [{ parts: [{ text: `Philological analysis of "${word}" in ${tradition} tradition. Language: ${lang}.` }] }]
      })
    });

    const data = await response.json();
    
    // If Google returns an error, we wrap it so the index doesn't break
    if (data.error) {
      return res.status(200).json({ 
        candidates: [{ content: { parts: [{ text: "GOOGLE API ERROR: " + data.error.message }] } }] 
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ 
      candidates: [{ content: { parts: [{ text: "BRIDGE ERROR: Connection failed." }] } }] 
    });
  }
}
