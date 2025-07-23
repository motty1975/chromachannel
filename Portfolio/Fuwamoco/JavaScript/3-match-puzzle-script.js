document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    const pcGnavi = document.getElementById('pc-gnavi');
    const headerHamburger = document.getElementById('header-hamburger');
    const floatingHamburger = document.getElementById('floating-hamburger');
    const hamburgerNav = document.getElementById('hamburger-nav');
    // const closeHamburgerBtn = document.getElementById('close-hamburger'); // ← この行を削除
    const body = document.body;

    let lastScrollY = 0;
    let ticking = false;
    const scrollThreshold = 100;

    function handleScroll() {
        const currentScrollY = window.scrollY;

        if (window.innerWidth > 1024) { // PC版
            if (currentScrollY <= scrollThreshold) {
                header.classList.remove('hidden');
                pcGnavi.style.display = 'block';
                floatingHamburger.classList.remove('visible');
                headerHamburger.style.display = 'none'; // PCではヘッダーのハンバーガーは常に非表示
            } else {
                header.classList.add('hidden');
                pcGnavi.style.display = 'none';
                if (!hamburgerNav.classList.contains('active')) {
                    floatingHamburger.classList.add('visible');
                }
                headerHamburger.style.display = 'none'; // PCではヘッダーのハンバーガーは常に非表示
            }
        } else { // モバイル版
            header.classList.remove('hidden');
            floatingHamburger.classList.remove('visible');
            pcGnavi.style.display = 'none';
            // ハンバーガーメニューが開いている/閉じている状態にかかわらず、常にheaderHamburgerを表示
            headerHamburger.style.display = 'flex';
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    });

    handleScroll(); // 初期状態を設定

    window.addEventListener('resize', function() {
        header.classList.remove('hidden');
        floatingHamburger.classList.remove('visible');
        hamburgerNav.classList.remove('active');
        // headerHamburger.classList.remove('active'); // activeクラスもリセット - これは不要になるかもしれません
        // floatingHamburger.classList.remove('active'); // activeクラスもリセット - これは不要になるかもしれません
        body.classList.remove('no-scroll');

        if (window.innerWidth > 1024) {
            floatingHamburger.classList.remove('visible');
            headerHamburger.style.display = 'none'; // PC時は常に非表示
        } else {
            headerHamburger.style.display = 'flex'; // モバイル時は常に表示
        }

        handleScroll();
    });

    // --- ハンバーガーメニューを開く/閉じる関数 (統合) ---
    function toggleHamburgerMenu() {
        if (hamburgerNav.classList.contains('active')) {
            // メニューが開いている場合、閉じる
            hamburgerNav.classList.remove('active');
            body.classList.remove('no-scroll');

            // 閉じた後、アイコンの表示をスクロール状態に合わせて更新
            if (window.innerWidth > 1024) {
                if (window.scrollY > scrollThreshold) {
                    floatingHamburger.classList.add('visible');
                }
            } else {
                headerHamburger.style.display = 'flex'; // モバイル版のヘッダーアイコンを表示
            }
        } else {
            // メニューが閉じている場合、開く
            hamburgerNav.classList.add('active');
            body.classList.add('no-scroll');

            // 開いた際、PCではフローティングを非表示に、モバイルではヘッダーハンバーガーを非表示に（今回の変更でこれは不要）
            // 今回はハンバーガーアイコンは常に表示されるため、ここで非表示にする処理は削除します。
            // 実際は、ハンバーガーアイコンが閉じるアイコンに切り替わるUIが一般的ですが、
            // 「ハンバーガーアイコンは残し、閉じる役割も兼ねる」という要件なので、アイコンの見た目の変化は行いません。
        }
    }

    // ハンバーガーアイコンをクリックすると、メニューの開閉をトグルする
    headerHamburger.addEventListener('click', toggleHamburgerMenu);
    floatingHamburger.addEventListener('click', toggleHamburgerMenu);

    // closeHamburgerBtn.addEventListener('click', function() { // ← このイベントリスナーを削除
    //     closeHamburgerMenu();
    // });

    const accordionMenus = document.querySelectorAll('.accordion-menu');

    accordionMenus.forEach(menu => {
        menu.addEventListener('click', function() {
            const contentId = this.dataset.accordion;
            const accordionContent = document.getElementById(contentId);

            if (accordionContent) {
                accordionMenus.forEach(otherMenu => {
                    if (otherMenu !== this && otherMenu.classList.contains('active')) {
                        otherMenu.classList.remove('active');
                        const otherContent = document.getElementById(otherMenu.dataset.accordion);
                        if (otherContent) {
                            otherContent.style.display = 'none';
                        }
                    }
                });

                this.classList.toggle('active');
                if (accordionContent.style.display === 'block') {
                    accordionContent.style.display = 'none';
                } else {
                    accordionContent.style.display = 'block';
                }
            }
        });
    });


    // ================================================================
    // 3マッチパズルゲームのロジック
    // ================================================================

    // うさぎの絵文字の種類
    const rabbitTypes = ['🐰', '🐇', '🧸', '🥕', '🌸'];

    // レベル設定
    const levelSettings = [
        { level: 1, targetScore: 500, timeBonus: 10, rabbitTypeCount: 3 }, // レベル1
        { level: 2, targetScore: 1200, timeBonus: 15, rabbitTypeCount: 4 }, // レベル2
        { level: 3, targetScore: 2500, timeBonus: 20, rabbitTypeCount: 5 }, // レベル3
        { level: 4, targetScore: 4000, timeBonus: 25, rabbitTypeCount: 5 }, // レベル4 (絵文字の種類は最大に)
        { level: 5, targetScore: 6000, timeBonus: 30, rabbitTypeCount: 5 }  // レベル5 (以降はスコアのみ増やすなど)
        // 必要に応じてレベルを増やしていく
    ];
    const maxRabbitTypes = rabbitTypes.length; // オリジナルの絵文字の種類数を保存

    // ゲーム設定
    const boardSize = 6; // CSSに合わせてボードサイズを6x6に修正
    let currentLevel = 1; // 現在のレベル
    let gameBoard = [];
    let score = 0;
    let timeLeft = 60;
    let timer = null;
    let selectedCell = null;
    let gameActive = false; // ゲームがアクティブ状態かどうかのフラグ
    let currentCombo = 0; // 現在のコンボ数
    let highScore = 0; // 最高スコア
    let highCombo = 0; // 最高コンボ

    // DOM要素
    const boardElement = document.getElementById('board');
    // HTMLのIDに合わせて修正
    const scoreElement = document.getElementById('current-score'); // HTMLのID 'current-score' に修正
    const timeElement = document.getElementById('time');
    const startButton = document.getElementById('start-btn');
    const stopButton = document.getElementById('stop-btn');
    const resetButton = document.getElementById('reset-btn');
    const gameOverElement = document.getElementById('game-over');
    const finalScoreElement = document.getElementById('final-score');
    const playAgainButton = document.getElementById('play-again-btn');
    const timeDisplayElement = document.querySelector('.timer');
    const highScoreElement = document.getElementById('high-score');
    const highComboElement = document.getElementById('high-combo');
    const comboCountElement = document.querySelector('.combo-count');
    const levelElement = document.getElementById('level');

    // BGM関連DOM要素
    const bgmFileElement = document.getElementById('bgm-file');
    const playBgmButton = document.getElementById('play-bgm-btn');
    const pauseBgmButton = document.getElementById('pause-bgm-btn');
    const stopBgmButton = document.getElementById('stop-bgm-btn');
    let audioPlayer = new Audio(); // Audioオブジェクトを作成

    // ローカルストレージから最高スコアと最高コンボを読み込む
    function loadHighScores() {
        const savedHighScore = localStorage.getItem('matchPuzzleHighScore');
        const savedHighCombo = localStorage.getItem('matchPuzzleHighCombo');
        if (savedHighScore) {
            highScore = parseInt(savedHighScore, 10);
            highScoreElement.textContent = highScore;
        }
        if (savedHighCombo) {
            highCombo = parseInt(savedHighCombo, 10);
            highComboElement.textContent = highCombo;
        }
    }

    // ゲームの初期化
    function initGame() {
        score = 0;
        scoreElement.textContent = score;
        currentCombo = 0;
        comboCountElement.style.display = 'none';

        timeLeft = 60;
        timeElement.textContent = timeLeft;
        timeDisplayElement.style.display = 'none'; // 初期状態ではタイマー表示を非表示にする

        gameOverElement.style.display = 'none';

        currentLevel = 1;
        levelElement.textContent = `👑 Level: ${currentLevel}`;

        setupBoardForLevel(currentLevel); // 初期ボードを生成
    }

    // ゲームボードの作成とレベルに応じた絵文字の設定
    function setupBoardForLevel(level) {
        gameBoard = [];
        boardElement.innerHTML = ''; // ボードをクリア

        const currentLevelSetting = levelSettings.find(setting => setting.level === level) || levelSettings[0];
        // 現在のレベル設定で利用可能な絵文字の種類を決定
        const availableRabbitTypes = rabbitTypes.slice(0, Math.min(currentLevelSetting.rabbitTypeCount, maxRabbitTypes));

        for (let row = 0; row < boardSize; row++) {
            gameBoard[row] = [];
            for (let col = 0; col < boardSize; col++) {
                let rabbitType;
                do {
                    // ランダムな絵文字を選択
                    rabbitType = availableRabbitTypes[Math.floor(Math.random() * availableRabbitTypes.length)];
                } while (isInitialMatch(row, col, rabbitType, gameBoard)); // 初期配置でマッチングが発生しないかチェック

                gameBoard[row][col] = rabbitType;

                const cell = document.createElement('div');
                cell.className = 'game-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.textContent = rabbitType;
                cell.addEventListener('click', () => cellClick(row, col));
                boardElement.appendChild(cell);
            }
        }
    }

    // 初期配置でマッチングが発生しないかチェック
    // 新しい絵文字がすでに2つ並んでいる場所に配置されるのを防ぐ
    function isInitialMatch(row, col, type, board) {
        if (col >= 2 && board[row][col - 1] === type && board[row][col - 2] === type) {
            return true;
        }
        if (row >= 2 && board[row - 1][col] === type && board[row - 2][col] === type) {
            return true;
        }
        return false;
    }

    // ゲーム開始
    function startGame() {
        if (gameActive) return; // すでにゲーム中の場合は何もしない
        gameActive = true;
        timeDisplayElement.style.display = 'block'; // タイマー表示

        // ゲームオーバー表示を非表示にする
        gameOverElement.style.display = 'none';

        // ゲーム開始時にinitGameを呼ぶ代わりに、ここで値をリセットするようにする
        // initGame() はDOMContentLoadedで一度呼ばれるので、ゲーム開始時は状態をリセットする
        score = 0;
        scoreElement.textContent = score;
        currentCombo = 0;
        comboCountElement.style.display = 'none';
        timeLeft = 60; // 時間をリセット
        timeElement.textContent = timeLeft;
        currentLevel = 1;
        levelElement.textContent = `👑 Level: ${currentLevel}`;
        setupBoardForLevel(currentLevel); // 新しいボードを生成

        if (timer) clearInterval(timer); // 既存のタイマーがあればクリア
        timer = setInterval(() => {
            timeLeft--;
            timeElement.textContent = timeLeft;
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    // ゲーム中断
    function stopGame() {
        if (!gameActive) return; // ゲーム中でない場合は何もしない
        gameActive = false;
        if (timer) clearInterval(timer); // タイマーを停止
        console.log("ゲーム中断");
    }

    // ゲームリセット
    function resetGame() {
        endGame(); // 現在のゲームを終了（タイマー停止、ゲームオーバー表示など）
        initGame(); // 新しいゲームを初期化（スコア、時間、レベル、ボードをリセット）
        stopBGM(); // BGMも停止する
    }

    // ゲーム終了
    function endGame() {
        gameActive = false;
        if (timer) clearInterval(timer);
        gameOverElement.style.display = 'flex'; // ゲームオーバー画面を表示
        finalScoreElement.textContent = score; // 最終スコアを表示

        // 最高スコアの更新
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('matchPuzzleHighScore', highScore);
            highScoreElement.textContent = highScore;
        }
        // 最高コンボの更新 (ゲーム終了時にも最新のcurrentComboを比較する)
        if (currentCombo > highCombo) { // ゲーム終了時の最後のコンボがハイスコアを超える可能性がある
            highCombo = currentCombo;
            localStorage.setItem('matchPuzzleHighCombo', highCombo);
            highComboElement.textContent = highCombo;
        }
        stopBGM(); // BGMを停止する
    }

    // 隣接チェック
    function isAdjacent(r1, c1, r2, c2) {
        const rowDiff = Math.abs(r1 - r2);
        const colDiff = Math.abs(c1 - c2);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }

    // セルを入れ替える
    function swapCells(r1, c1, r2, c2) {
        const temp = gameBoard[r1][c1];
        gameBoard[r1][c1] = gameBoard[r2][c2];
        gameBoard[r2][c2] = temp;
        renderBoard(); // 盤面を再描画
    }

    // 盤面を描画
    function renderBoard() {
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const cell = boardElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                cell.textContent = gameBoard[row][col];
                cell.style.backgroundColor = ''; // 背景色をリセット
            }
        }
    }

    // マッチを探す
    function findMatches() {
        const matches = [];
        // 行方向のマッチ
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize - 2; col++) {
                const type = gameBoard[row][col];
                if (type && type === gameBoard[row][col + 1] && type === gameBoard[row][col + 2]) {
                    matches.push({ row, col });
                    matches.push({ row, col: col + 1 });
                    matches.push({ row, col: col + 2 });
                }
            }
        }
        // 列方向のマッチ
        for (let col = 0; col < boardSize; col++) {
            for (let row = 0; row < boardSize - 2; row++) {
                const type = gameBoard[row][col];
                if (type && type === gameBoard[row + 1][col] && type === gameBoard[row + 2][col]) {
                    matches.push({ row, col });
                    matches.push({ row: row + 1, col });
                    matches.push({ row: row + 2, col });
                }
            }
        }
        // 重複を削除してユニークなマッチの配列を返す
        const uniqueMatches = Array.from(new Set(matches.map(m => `${m.row}-${m.col}`)))
                                 .map(s => {
                                     const [row, col] = s.split('-').map(Number);
                                     return { row, col };
                                 });
        return uniqueMatches;
    }

    // マッチしたセルを消す
    function removeMatches(matches) {
        matches.forEach(({ row, col }) => {
            gameBoard[row][col] = null; // セルを空にする
            const cellElement = boardElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cellElement.textContent = '';
            cellElement.style.backgroundColor = '#d3d3d3'; // 消えたセルをグレーにする (CSSでアニメーションを適用すると良い)
        });
    }

    // 盤面を埋める（空いたセルに新しいうさぎを落とす）
    function fillBoard() {
        const currentLevelSetting = levelSettings.find(setting => setting.level === currentLevel) || levelSettings[0];
        const availableRabbitTypes = rabbitTypes.slice(0, Math.min(currentLevelSetting.rabbitTypeCount, maxRabbitTypes));

        for (let col = 0; col < boardSize; col++) {
            let emptyCount = 0;
            // 下から上に空のセルを探し、上にある絵文字を落とす
            for (let row = boardSize - 1; row >= 0; row--) {
                if (gameBoard[row][col] === null) {
                    emptyCount++;
                } else if (emptyCount > 0) {
                    gameBoard[row + emptyCount][col] = gameBoard[row][col];
                    gameBoard[row][col] = null;

                    // DOM要素のtextContentを即座に入れ替える（アニメーションはCSSで）
                    const oldCell = boardElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    const newCell = boardElement.querySelector(`[data-row="${row + emptyCount}"][data-col="${col}"]`);

                    newCell.textContent = oldCell.textContent;
                    oldCell.textContent = '';
                    oldCell.style.backgroundColor = ''; // 背景色をリセット
                }
            }
            // 空いた上部のセルに新しい絵文字を補充
            for (let i = 0; i < emptyCount; i++) {
                const rabbitType = availableRabbitTypes[Math.floor(Math.random() * availableRabbitTypes.length)];
                gameBoard[i][col] = rabbitType;

                const cell = boardElement.querySelector(`[data-row="${i}"][data-col="${col}"]`);
                cell.textContent = rabbitType;
                cell.style.backgroundColor = ''; // 背景色をリセット
            }
        }
        renderBoard(); // 最終的な盤面状態をレンダリング
    }

    // セルのクリック処理
    async function cellClick(row, col) {
        if (!gameActive) return; // ゲームがアクティブでない場合は何もしない

        const clickedCellElement = boardElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);

        if (!selectedCell) {
            // 最初のセル選択
            selectedCell = { row, col };
            clickedCellElement.classList.add('selected'); // 選択状態のスタイルを適用
            return;
        }

        if (selectedCell.row === row && selectedCell.col === col) {
            // 同じセルを再度クリックした場合、選択解除
            clickedCellElement.classList.remove('selected');
            selectedCell = null;
            return;
        }

        // ここでselectedCellの値を保持しておく
        const prevSelectedRow = selectedCell.row;
        const prevSelectedCol = selectedCell.col;

        // 隣接セルかどうかをチェック
        if (isAdjacent(prevSelectedRow, prevSelectedCol, row, col)) {
            swapCells(prevSelectedRow, prevSelectedCol, row, col); // セルを入れ替える

            // 選択状態を解除
            boardElement.querySelector(`[data-row="${prevSelectedRow}"][data-col="${prevSelectedCol}"]`).classList.remove('selected');
            selectedCell = null;

            await new Promise(resolve => setTimeout(resolve, 300)); // アニメーション待ち (CSSアニメーションと同期させる)

            const initialMatches = findMatches();
            if (initialMatches.length === 0) {
                // マッチがなければ元に戻す
                swapCells(row, col, prevSelectedRow, prevSelectedCol);
                console.log("No match, swapping back.");
                currentCombo = 0; // マッチしなかったのでコンボをリセット
                hideCombo();
                return;
            }

            let comboCount = 0;
            let matchesFound;
            do {
                matchesFound = findMatches(); // マッチを探す
                if (matchesFound.length > 0) {
                    comboCount++; // コンボ数をインクリメント
                    currentCombo = comboCount; // 現在のコンボ数を更新

                    // 最高コンボの更新
                    if (currentCombo > highCombo) {
                        highCombo = currentCombo;
                        localStorage.setItem('matchPuzzleHighCombo', highCombo);
                        highComboElement.textContent = highCombo;
                    }

                    showCombo(comboCount); // コンボ表示
                    removeMatches(matchesFound); // マッチしたセルを消す

                    const matchScore = matchesFound.length; // 消したセルの数
                    // コンボボーナスを適用
                    let bonusMultiplier = 1;
                    if (comboCount > 1) {
                        bonusMultiplier = 1 + (comboCount - 1) * 0.2; // 2コンボ目で1.2倍、3コンボ目で1.4倍...
                    }
                    score += Math.round(matchScore * 10 * bonusMultiplier); // ボーナスをかけたスコアを加算
                    scoreElement.textContent = score;

                    // スコア更新後にレベルアップチェック
                    checkLevelUp();

                    await new Promise(resolve => setTimeout(resolve, 300)); // 消去アニメーション待ち
                    fillBoard(); // 新しい絵文字の落下と補充
                    await new Promise(resolve => setTimeout(resolve, 300)); // 落下アニメーション待ち
                }
            } while (matchesFound.length > 0); // マッチがなくなるまで繰り返す (連鎖)

            currentCombo = 0; // コンボが途切れたのでリセット
            hideCombo();

            // 有効な手がなくなった場合のチェック
            if (!hasValidMoves()) {
                alert('有効な手がありません。盤面を再生成します。');
                reshuffleBoard();
            }

        } else {
            // 隣接していないセルを選択した場合、選択セルを更新
            boardElement.querySelector(`[data-row="${prevSelectedRow}"][data-col="${prevSelectedCol}"]`).classList.remove('selected');
            selectedCell = { row, col };
            clickedCellElement.classList.add('selected');
        }
    }

    // 有効な手があるかチェック
    // 盤面上のあらゆる可能な入れ替えを試行し、マッチが発生するかを確認
    function hasValidMoves() {
        // 現在のボードの状態を一時的にコピー
        const originalBoard = JSON.parse(JSON.stringify(gameBoard));

        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++) {
                // 右隣のセルと交換を試す
                if (c + 1 < boardSize) {
                    // 実際に交換
                    [gameBoard[r][c], gameBoard[r][c + 1]] = [gameBoard[r][c + 1], gameBoard[r][c]];
                    if (findMatches().length > 0) {
                        // マッチが見つかったら元に戻してtrueを返す
                        gameBoard = JSON.parse(JSON.stringify(originalBoard)); // 元に戻す
                        return true;
                    }
                    gameBoard = JSON.parse(JSON.stringify(originalBoard)); // 元に戻す
                }
                // 下隣のセルと交換を試す
                if (r + 1 < boardSize) {
                    // 実際に交換
                    [gameBoard[r][c], gameBoard[r + 1][c]] = [gameBoard[r + 1][c], gameBoard[r][c]];
                    if (findMatches().length > 0) {
                        // マッチが見つかったら元に戻してtrueを返す
                        gameBoard = JSON.parse(JSON.stringify(originalBoard)); // 元に戻す
                        return true;
                    }
                    gameBoard = JSON.parse(JSON.stringify(originalBoard)); // 元に戻す
                }
            }
        }
        return false; // 有効な手が見つからなかった
    }

    // 盤面を再シャッフル
    function reshuffleBoard() {
        const currentLevelSetting = levelSettings.find(setting => setting.level === currentLevel) || levelSettings[0];
        const availableRabbitTypes = rabbitTypes.slice(0, Math.min(currentLevelSetting.rabbitTypeCount, maxRabbitTypes));

        let attempts = 0;
        const maxAttempts = 100; // 無限ループを防ぐための試行回数制限

        do {
            gameBoard = []; // ボードをリセット
            for (let row = 0; row < boardSize; row++) {
                gameBoard[row] = [];
                for (let col = 0; col < boardSize; col++) {
                    let rabbitType;
                    do {
                        rabbitType = availableRabbitTypes[Math.floor(Math.random() * availableRabbitTypes.length)];
                    } while (isInitialMatch(row, col, rabbitType, gameBoard)); // 初期マッチを避ける

                    gameBoard[row][col] = rabbitType;
                }
            }
            attempts++;
            if (attempts > maxAttempts) {
                console.error("有効な手を持つボードの生成に失敗しました。");
                break; // 試行回数を超えたらループを抜ける
            }
        } while (!hasValidMoves()); // 有効な手が見つかるまで繰り返す

        renderBoard(); // 新しいボードをレンダリング
    }

    // コンボ表示の関数
    function showCombo(count) {
        comboCountElement.textContent = `${count} COMBO!!`;
        comboCountElement.style.display = 'block';
        comboCountElement.style.opacity = '1';
        comboCountElement.style.transform = 'scale(1)';
        comboCountElement.style.transition = 'all 0.3s ease-out';

        clearTimeout(comboCountElement.hideTimer); // 既存のタイマーがあればクリア
        comboCountElement.hideTimer = setTimeout(() => {
            hideCombo();
        }, 1000); // 1秒後に消える
    }

    function hideCombo() {
        comboCountElement.style.opacity = '0';
        comboCountElement.style.transform = 'scale(0.8)';
        setTimeout(() => {
            comboCountElement.style.display = 'none';
        }, 300); // フェードアウトアニメーション後に非表示
    }

    // BGMコントロール
    function playBGM() {
        if (audioPlayer.src) { // 音源が設定されていれば再生
            audioPlayer.play().catch(e => console.error("BGM再生エラー:", e)); // プロミスをキャッチ
            console.log("BGM再生");
        } else {
            alert("BGMファイルが選択されていません。");
        }
    }

    function pauseBGM() {
        audioPlayer.pause();
        console.log("BGM一時停止");
    }

    function stopBGM() {
        audioPlayer.pause();
        audioPlayer.currentTime = 0; // 再生位置を最初に戻す
        console.log("BGM停止");
    }

    // BGMファイル選択時の処理
    bgmFileElement.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            audioPlayer.src = URL.createObjectURL(file);
            audioPlayer.loop = true; // ループ再生
            console.log("BGMファイルが選択されました:", file.name);
            // ファイル選択後すぐに再生を開始するかはゲームデザインによる
            // playBGM(); // 例えば、ここで自動再生させる
        }
    });

    // レベルアップのチェック
    function checkLevelUp() {
        const currentLevelSetting = levelSettings.find(setting => setting.level === currentLevel);

        if (currentLevelSetting && score >= currentLevelSetting.targetScore) {
            // 次のレベル設定があるか確認
            const nextLevelSetting = levelSettings.find(setting => setting.level === currentLevel + 1);

            if (nextLevelSetting) {
                currentLevel++;
                levelElement.textContent = `👑 Level: ${currentLevel}`;
                timeLeft += currentLevelSetting.timeBonus; // 時間ボーナス
                timeElement.textContent = timeLeft;

                alert(`レベルアップ！レベル${currentLevel}に到達しました！時間ボーナス+${currentLevelSetting.timeBonus}秒！`);

                // レベルアップ後の盤面更新（絵文字の種類が増える場合など）
                // fillBoard() が新しい種類の絵文字を自動的に補充するように調整済みなので、
                // 新しい絵文字が自然に降ってくるのを待つだけでも良いです。
                // 必要に応じて、ここで setupBoardForLevel(currentLevel); を呼び出して、完全に新しいボードを生成することも検討できます。
                // しかし、現在の実装では、マッチが連鎖的に解消され、新しい絵文字が補充される過程で、
                // 次のレベルで追加された種類の絵文字も登場するようになるため、即座のボードリセットは必須ではないでしょう。
            } else {
                // 全てのレベルをクリアした場合の処理
                alert("おめでとうございます！全てのレベルをクリアしました！");
                endGame(); // ゲームを終了
            }
        }
    }

    // イベントリスナーの設定
    startButton.addEventListener('click', startGame);
    stopButton.addEventListener('click', stopGame);
    resetButton.addEventListener('click', resetGame);
    playAgainButton.addEventListener('click', resetGame);

    // BGMボタンのイベントリスナー
    playBgmButton.addEventListener('click', playBGM);
    pauseBgmButton.addEventListener('click', pauseBGM);
    stopBgmButton.addEventListener('click', stopBGM);

    // 初期化時にハイスコアとハイスコアを読み込む
    loadHighScores();
    initGame(); // ゲームが読み込まれた時に一度初期化
});