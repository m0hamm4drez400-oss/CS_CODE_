export default async function handler(req, res) {
  console.log("--- API Start ---");
  
  const { prompt, json } = req.body || {};
  const apiKey = process.env.AI_API_KEY;

  console.log("Key exists:", !!apiKey); // این رو توی لاگ ورسل چک کن که true هست یا false

  if (!apiKey) {
    console.error("API Key missing!");
    return res.status(500).json({ error: 'AI_API_KEY missing' });
  }

  try {
    const payload = {
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500
    };
    if (json) payload.response_format = { type: 'json_object' };

    console.log("Sending request to Groq...");
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("Groq response status:", response.status);

    if (!response.ok) {
      console.error("Groq error data:", JSON.stringify(data));
      return res.status(502).json({ error: 'Groq API error' });
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("Critical error:", err.message);
    res.status(500).json({ error: err.message });
  }
}
