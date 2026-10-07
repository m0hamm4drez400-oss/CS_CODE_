export default async function handler(req, res) {
  // تنظیم هدرها برای جلوگیری از خطای CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const { prompt, json } = req.body || {};
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'System Error: API Key not configured in Vercel.' });
  }

  try {
    const payload = {
      model: 'openai/gpt-oss-120b', // مدل جدید و فعال
      messages: [
        { role: 'system', content: 'You are a helpful assistant for CS Code website.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    };

    if (json) payload.response_format = { type: 'json_object' };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API Error:', data);
      return res.status(response.status).json({ 
        error: data.error?.message || 'The AI service is currently unavailable.' 
      });
    }

    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error('Serverless Function Error:', err);
    return res.status(500).json({ error: 'Connection failed. Please try again.' });
  }
}
