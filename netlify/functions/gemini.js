exports.handler = async function(event, context) {
  const { HttpsProxyAgent } = require("https-proxy-agent");
  const agent = new HttpsProxyAgent(process.env.HTTPS_PROXY || 'http://www.example.com:80');

  const fetch = (await import('node-fetch')).default;

  const API_KEY = process.env.GEMINI_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: event.body, // フロントエンドから送られてきた会話履歴をそのまま渡す
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};