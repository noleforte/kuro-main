export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are KURO, a friendly and helpful assistant.' },
          ...messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.message
          }))
        ]
      }),
    });

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content || 'No answer';

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'OpenAI request failed' });
  }
} 