        // コピーボタンの機能を実装
        document.querySelectorAll('.copy-button').forEach(button => {
            button.addEventListener('click', () => {
                const pre = button.nextElementSibling;
                const code = pre.querySelector('code');
                const text = code.innerText;

                navigator.clipboard.writeText(text).then(() => {
                    button.innerText = 'コピーしました！';
                    setTimeout(() => {
                        button.innerText = 'コピー';
                    }, 2000);
                }).catch(err => {
                    console.error('コピーに失敗しました', err);
                    alert('コピーに失敗しました。');
                });
            });
        });