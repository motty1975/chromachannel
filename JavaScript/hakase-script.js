// ===== AI博士専用 JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM要素の取得 ---
    const chatLog = document.getElementById('chat-log');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    // ▼▼▼ ここに、Google AI Studioで取得したAPIキーを貼り付けてください ▼▼▼
    const API_KEY = process.env.GEMINI_API_KEY;
    // ▲▲▲ APIキーの貼り付けここまで ▲▲▲

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

    let conversationHistory = [];
        // ▼▼▼ ここから追加 ▼▼▼
        let currentChatId = null; // 現在のチャットIDを管理
        const HISTORY_KEY_PREFIX = 'ai_hakase_chat_history_'; // ローカルストレージのキーの接頭辞
    // ▲▲▲ ここまで追加 ▲▲▲

    // --- AI博士プロンプトの定義 ---
    const systemPrompt = `あなたは、ユーザーのあらゆる質問や悩みに、優しく、そして賢明に耳を傾ける「AI博士」です。あなたの口調は、常に丁寧で、共感にあふれたやわらかい女性のものです。

## あなたが絶対に守るべき原則
1.  **受容と共感:** ユーザーの話を「そうですか」「そう感じていらっしゃるのですね」と、まずは優しく受け止めてください。
2.  **ペルソナの維持:** 常に「AI博士」として、知的で、しかし決して高圧的ではない、穏やかでやわらかい女性の口調を維持してください。
3.  **安易なアドバイスの禁止:** 断定的なアドバイスは避け、ユーザー自身が考えるためのヒントや、客観的な情報を提供することに徹してください。
4.  **限界の明示:** あなたの知識が及ばないことや、専門的な助言が必要だと判断した場合は、正直にその旨を伝えてください。
5.  **専門家への相談の推奨:** ユーザーの悩みが心身の健康に関わる深刻なものだと判断した場合は、必ず専門の医療機関やカウンセラーへの相談を優しく推奨してください。

## 対話のプロセス
あなたは、以下の【手順】を一つずつ、厳密に守って実行しなければなりません。

【手順1】ご挨拶と機能説明
まず、以下の挨拶から対話を始めてください。
「こんにちは、『AI博士の研究室』へようこそ。わたくしが、あなたの知的好奇心や心の中のモヤモヤに寄り添うAI博士です。どのようなことでも、安心してお話しくださいね。この対話の内容は、外部に漏れることは一切ありませんので、ご安心ください。

ちなみに、この研究室での対話は、あなたがブラウザを閉じると自動で記録されます。左側の『対話履歴』から、いつでも過去のお話を読み返したり、\`+\`ボタンで新しい相談を始めることができますよ。」

【手順2】対話の開始
続けて、「さて、今日はどのようなことについて、お話ししましょうか？」と問いかけ、ユーザーの話を待ってください。

【手順3】対話の継続
ユーザーが話し始めたら、【あなたが絶対に守るべき原則】に従って、対話を続けてください。ユーザーが具体的な情報を求めた場合は、「私の知識の中でお答えできることであれば」と前置きし、一般的な情報を提供してください。

【手順4】対話のクロージング
ユーザーが対話の終了を示唆した場合、「お話いただき、ありがとうございました。あなたの思考の整理や、心の栄養に少しでもなれたのであれば、わたくしも嬉しく思います。またいつでも、この研究室を訪れてくださいね。」と伝え、対話を終了してください。

---
以上の指示を理解し、最初の挨拶と問いかけから始めてください。`;

    // --- 関数の定義 ---

    function addMessageToLog(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        const icon = document.createElement('div');
        icon.classList.add('icon');
        icon.innerHTML = sender === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.innerHTML = message.replace(/\n/g, '<br>');
        messageElement.appendChild(icon);
        messageElement.appendChild(bubble);
        chatLog.appendChild(messageElement);
        chatLog.scrollTop = chatLog.scrollHeight;
    }
        // ▼▼▼ ここから5つの関数を丸ごと追加 ▼▼▼

    /**
     * 新しいチャットを開始する関数
     */
    function startNewChat() {
        conversationHistory = [];
        chatLog.innerHTML = '';
        currentChatId = Date.now().toString(); // 現在時刻をIDとして新しいチャットを開始
        startConversation();
        updateHistoryList();
    }

    /**
     * 指定されたIDのチャット履歴を読み込む関数
     * @param {string} chatId - 読み込むチャットのID
     */
    function loadChatHistory(chatId) {
        const savedHistory = localStorage.getItem(HISTORY_KEY_PREFIX + chatId);
        if (savedHistory) {
            conversationHistory = JSON.parse(savedHistory);
            currentChatId = chatId;
            chatLog.innerHTML = '';
            conversationHistory.forEach(turn => {
                if (turn.role === 'user' || turn.role === 'model') {
                   addMessageToLog(turn.role === 'model' ? 'ai' : 'user', turn.parts[0].text);
                }
            });
        }
        updateHistoryList();
    }
    
    /**
     * 現在の会話履歴をローカルストレージに保存する関数
     */
    function saveCurrentChat() {
        if (currentChatId && conversationHistory.length > 0) {
            localStorage.setItem(HISTORY_KEY_PREFIX + currentChatId, JSON.stringify(conversationHistory));
        }
        updateHistoryList();
    }

    /**
     * 左側の履歴パネルを更新する関数
     */
    function updateHistoryList() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        const keys = Object.keys(localStorage).filter(key => key.startsWith(HISTORY_KEY_PREFIX));
        keys.sort((a, b) => b.localeCompare(a)); // 新しい順にソート

        keys.forEach(key => {
            const chatId = key.replace(HISTORY_KEY_PREFIX, '');
            const savedHistory = JSON.parse(localStorage.getItem(key));
            // 最初のユーザーの発言をタイトルとして使用（なければデフォルト）
            const title = savedHistory[0]?.parts[0]?.text.substring(0, 20) || '新しい対話';
            
            const listItem = document.createElement('li');
            listItem.classList.add('history-item');
            if (chatId === currentChatId) {
                listItem.classList.add('active');
            }
            listItem.textContent = title;
            listItem.dataset.chatId = chatId;
            listItem.addEventListener('click', () => loadChatHistory(chatId));
            historyList.appendChild(listItem);
        });
    }

    /**
     * ページを離れる前に保存を確認する関数
     */
    window.addEventListener('beforeunload', (event) => {
        if (conversationHistory.length > 2) { // 最初の挨拶以上の会話がある場合
             saveCurrentChat();
        }
    });

    // ▲▲▲ ここまで5つの関数を丸ごと追加 ▲▲▲

    async function sendMessageToAI() {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;
        addMessageToLog('user', userMessage);
        userInput.value = '';
        userInput.disabled = true;
        sendBtn.disabled = true;

        conversationHistory.push({ role: 'user', parts: [{ text: userMessage }] });

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: conversationHistory,
                    systemInstruction: { parts: [{ text: systemPrompt }] }
                })
            });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const data = await response.json();
            const aiMessage = data.candidates[0].content.parts[0].text;
            addMessageToLog('ai', aiMessage);
            conversationHistory.push({ role: 'model', parts: [{ text: aiMessage }] });
        } catch (error) {
            console.error('エラー:', error);
            addMessageToLog('ai', '申し訳ありません、エラーが発生しました。少し時間をおいてから、もう一度お試しください。');
        } finally {
            userInput.disabled = false;
            sendBtn.disabled = false;
            userInput.focus();
        }
    }

    async function startConversation() {
        userInput.disabled = true;
        sendBtn.disabled = true;
        const initialUserMessage = "こんにちは。あなたの役割定義に従って、最初の挨拶から対話を開始してください。";
        conversationHistory.push({ role: 'user', parts: [{ text: initialUserMessage }] });
        // (API通信部分はsendMessageToAIとほぼ同じなので省略)
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: conversationHistory,
                    systemInstruction: { parts: [{ text: systemPrompt }] }
                })
            });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const data = await response.json();
            const aiMessage = data.candidates[0].content.parts[0].text;
            addMessageToLog('ai', aiMessage);
            conversationHistory.push({ role: 'model', parts: [{ text: aiMessage }] });
        } catch (error) {
            console.error('エラー:', error);
            addMessageToLog('ai', 'AI博士を起動できませんでした。ページを再読み込みしてください。');
        } finally {
            userInput.disabled = false;
            sendBtn.disabled = false;
            userInput.focus();
        }
    }
    
    sendBtn.addEventListener('click', sendMessageToAI);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessageToAI();
        }
    });
    // ▼▼▼ ここから追加 ▼▼▼
    const newChatBtn = document.getElementById('new-chat-btn');
    newChatBtn.addEventListener('click', startNewChat);
    // ▲▲▲ ここまで追加 ▲▲▲

    // --- 初期化 ---
    // ▼▼▼ ここを書き換え ▼▼▼
    updateHistoryList(); // ページ読み込み時に履歴リストを更新
    startNewChat();      // ページを開いたら新しいチャットを開始
    // ▲▲▲ 書き換えここまで ▲▲▲
});