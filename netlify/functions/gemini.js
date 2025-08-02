// Netlify Functions (gemini.js)

exports.handler = async function(event, context) {
  // node-fetchをrequireで安定的に読み込む
  const fetch = require('node-fetch');

  // APIキーを環境変数から取得
  const API_KEY = process.env.GEMINI_API_KEY;

  // APIキーが設定されていない場合は、エラーを返す
  if (!API_KEY) {
    console.error('エラー: 環境変数 GEMINI_API_KEY が設定されていません。');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'サーバー側でAPIキーが設定されていません。' }),
    };
  }

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

  // フロントエンドから送られてきたリクエストボディを、一度JavaScriptオブジェクトに変換
  const requestBody = JSON.parse(event.body);

  // 送信するリクエストボディに、安全設定（safetySettings）を追加
  const modifiedBody = {
    contents: requestBody.contents,
    systemInstruction: requestBody.systemInstruction,
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };

  // タイムアウト処理のための設定
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 9000); // 9秒でタイムアウト

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // 変更したリクエストボディをJSON文字列に変換して送信
      body: JSON.stringify(modifiedBody),
      signal: controller.signal
    });
    
    // タイムアウト前に応答があれば、タイマーを解除
    clearTimeout(timeout);

    // Google APIからのエラーレスポンスを適切に処理
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google APIからのエラー:', errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Google APIエラー: ${errorData.error.message}` }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (error) {
    // タイムアウトした場合のエラー処理
    if (error.name === 'AbortError') {
      console.error('エラー: リクエストがタイムアウトしました。');
      return {
        statusCode: 504, // Gateway Timeout
        body: JSON.stringify({ error: 'AIからの応答が時間内にありませんでした。' }),
      };
    }
    
    // その他のネットワークエラーなど
    console.error('予期せぬエラー:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};