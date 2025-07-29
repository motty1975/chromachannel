// --- プロンプト用コピー機能を初期化 ---
    const initPromptCopy = () => {
        // .prompt-list がページ内に存在しない場合は、何もしない
        const promptList = document.querySelector('.prompt-list');
        if (!promptList) return;

        // .prompt-list 内でクリックイベントが発生したら処理を実行
        promptList.addEventListener('click', (e) => {
            // クリックされた要素が .copy-btn か、その子要素かを確認
            const copyButton = e.target.closest('.copy-btn');
            
            // copyButton が見つからない場合は処理を中断
            if (!copyButton) return;

            // ボタンの状態が「コピー完了」の時は、何もしない
            if (copyButton.classList.contains('copied')) return;

            // ボタンに一番近い .prompt-box を探し、その中の .prompt-text を見つける
            const promptBox = copyButton.closest('.prompt-box');
            const textToCopy = promptBox.querySelector('.prompt-text').innerText;

            // クリップボードにテキストを書き込む（モダンな方法）
            navigator.clipboard.writeText(textToCopy).then(() => {
                // --- コピー成功時の処理 ---
                const originalText = copyButton.innerHTML; // 元のボタンの内容を保存
                copyButton.classList.add('copied'); // 'copied' クラスを追加して色を変更
                copyButton.innerHTML = '<i class="fas fa-check"></i> コピー完了';

                // 2秒後に元の状態に戻す
                setTimeout(() => {
                    copyButton.classList.remove('copied');
                    copyButton.innerHTML = originalText;
                }, 2000);

            }).catch(err => {
                // --- コピー失敗時の処理 ---
                console.error('クリップボードへのコピーに失敗しました: ', err);
                alert('コピーに失敗しました。');
            });
        });
    };

    // --- 全ての機能を初期化して実行 ---
    initMobileMenu();
    initScrollAnimation();
    initHeaderScrollEffect();
    initPortfolioFilter();
    initThumbnailToggle();
    initPortfolioModal();
    initLearnModal();
    initPromptCopy(); // ← ここに新しい関数の呼び出しを追加