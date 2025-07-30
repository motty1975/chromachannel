document.addEventListener('DOMContentLoaded', () => {

    // --- サイト共通の機能 ---

    /**
     * モバイル用ハンバーガーメニューのクリックイベントを初期化します。
     */
    const initMobileMenu = () => {
        const toggleButton = document.querySelector('.mobile-nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        if (toggleButton && navLinks) {
            toggleButton.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                toggleButton.classList.toggle('active');
            });
        }
    };

    /**
     * ページスクロールに応じたフェードインアニメーションを初期化します。
     */
    const initScrollAnimation = () => {
        const fadeInElements = document.querySelectorAll('.fade-in');
        if (fadeInElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        fadeInElements.forEach(el => observer.observe(el));
    };

    /**
     * ヘッダーがスクロールされた際に影をつける効果を初期化します。
     */
    const initHeaderScrollEffect = () => {
        const header = document.querySelector('.site-header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    };
    
    /**
     * AIイラストカードの「ギャラリーを見る」ボタンの機能を初期化します。
     */
    const initGalleryToggle = () => {
        const toggleButtons = document.querySelectorAll('.gallery-toggle-btn');
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const portfolioCard = button.closest('.portfolio-card');
                const galleryWrapper = portfolioCard.querySelector('.thumbnail-gallery-wrapper');
                
                if (galleryWrapper) {
                    galleryWrapper.classList.toggle('open');
                    // ボタンのテキストとアイコンを変更
                    if (galleryWrapper.classList.contains('open')) {
                        button.innerHTML = '<i class="fas fa-times-circle"></i> ギャラリーを閉じる';
                    } else {
                        button.innerHTML = '<i class="fas fa-images"></i> ギャラリーを見る';
                    }
                }
            });
        });
    };

    /**
     * ポートフォリオページのカテゴリフィルター機能を初期化します。
     */
    const initPortfolioFilter = () => {
        const container = document.querySelector('.portfolio-categories');
        if (!container) return; // このページにフィルターがなければ何もしない

        const buttons = container.querySelectorAll('.category-btn');
        const items = document.querySelectorAll('.portfolio-item');
        const animationDuration = 300;

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // 既にアクティブなボタンは処理しない
                if(button.classList.contains('active')) return;

                container.querySelector('.active').classList.remove('active');
                button.classList.add('active');
                const category = button.dataset.category;

                items.forEach(item => {
                    const itemCategories = item.dataset.category ? item.dataset.category.split(' ') : [];
                    const shouldShow = category === 'all' || itemCategories.includes(category);

                    if (!shouldShow && !item.classList.contains('is-hidden')) {
                        item.classList.add('is-hiding');
                        setTimeout(() => item.classList.add('is-hidden'), animationDuration);
                    } else if (shouldShow && item.classList.contains('is-hidden')) {
                        item.classList.remove('is-hidden');
                        setTimeout(() => item.classList.remove('is-hiding'), 10);
                    }
                });
            });
        });
    };

    /**
     * プロンプトページのコピーボタン機能を初期化します。
     */
    const initPromptCopy = () => {
        const promptList = document.querySelector('.prompt-list');
        if (!promptList) return;

        promptList.addEventListener('click', (e) => {
            const copyButton = e.target.closest('.copy-btn');
            if (!copyButton || copyButton.classList.contains('copied')) return;

            // ボタンが所属するカードの一番外側の要素を探す
            const promptBox = copyButton.closest('.prompt-box');
            if (!promptBox) return;

            // 見出しと本文の要素を探す
            const titleElement = promptBox.querySelector('.prompt-title');
            const textElement = promptBox.querySelector('.prompt-text');

            if (!textElement) return;

            // 見出しのテキスト（存在すれば）と本文のテキストを結合
            const titleText = titleElement ? titleElement.innerText + '\n\n' : '';
            const bodyText = textElement.innerText;
            const textToCopy = titleText + bodyText;

            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = copyButton.innerHTML;
                copyButton.classList.add('copied');
                copyButton.innerHTML = '<i class="fas fa-check"></i> コピー完了';
                setTimeout(() => {
                    copyButton.classList.remove('copied');
                    copyButton.innerHTML = originalText;
                }, 2000);
            }).catch(err => {
                console.error('クリップボードへのコピーに失敗しました: ', err);
                alert('コピーに失敗しました。');
            });
        });
    };
    
    /**
     * ポートフォリオページの作品詳細モーダル機能を初期化します。
     */
    const initPortfolioModal = () => {
        const modal = document.getElementById('portfolio-modal');
        if (!modal) return;
        
        // モーダル内の要素を取得
        const closeBtn = document.getElementById('modal-close-btn');
        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const modalCheckpoint = document.getElementById('modal-checkpoint');
        const modalPositive = document.getElementById('modal-positive');
        const modalNegative = document.getElementById('modal-negative');
        const modalSettings = document.getElementById('modal-settings');
        const prevBtn = document.getElementById('modal-prev');
        const nextBtn = document.getElementById('modal-next');

        let currentGalleryItems = [];
        let currentIndex = -1;

        // サムネイル画像のデータに基づいてモーダルの内容を更新する
        const updateModalContent = (item) => {
            if (!item) return;
            modalImage.src = item.dataset.largeSrc || '';
            modalTitle.textContent = item.dataset.title || '無題';
            modalDescription.textContent = item.dataset.description || '説明がありません。';
            modalCheckpoint.textContent = item.dataset.checkpoint || '情報なし';
            modalPositive.textContent = item.dataset.positive || '情報なし';
            modalNegative.textContent = item.dataset.negative || '情報なし';
            modalSettings.textContent = item.dataset.settings || '情報なし';
        };
        
        // モーダルを開く
        const openModal = (clickedItem) => {
            // 現在表示されている（is-hiddenクラスを持たない）ポートフォリオ項目内のサムネイル画像のみをギャラリーの対象とする
            currentGalleryItems = Array.from(document.querySelectorAll('.portfolio-item:not(.is-hidden) .thumbnail-img'));
            currentIndex = currentGalleryItems.indexOf(clickedItem);
            
            if (currentIndex === -1) return; // 対象が見つからなければ何もしない

            updateModalContent(clickedItem);
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // 背景のスクロールを禁止
        };

        // モーダルを閉じる
        const closeModal = () => {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // スクロール禁止を解除
        };
        
        // ギャラリー内を移動する
        const navigateGallery = (direction) => {
            if (currentGalleryItems.length <= 1) return;
            currentIndex = (currentIndex + direction + currentGalleryItems.length) % currentGalleryItems.length;
            updateModalContent(currentGalleryItems[currentIndex]);
        };
        
        // イベントリスナーを設定
        // .portfolio-grid内のクリックを監視し、サムネイル画像がクリックされたらモーダルを開く（イベント委任）
        document.querySelector('.portfolio-grid').addEventListener('click', (e) => {
            const thumbnail = e.target.closest('.thumbnail-img');
            if (thumbnail) {
                openModal(thumbnail);
            }
        });
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => (e.target === modal) && closeModal()); // 背景クリックで閉じる
        prevBtn.addEventListener('click', () => navigateGallery(-1));
        nextBtn.addEventListener('click', () => navigateGallery(1));

        // キーボード操作
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('show')) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') navigateGallery(-1);
            if (e.key === 'ArrowRight') navigateGallery(1);
        });
    };


    // --- サイト全体の機能を初期化して実行 ---
    initMobileMenu();
    initScrollAnimation();
    initHeaderScrollEffect();
    initGalleryToggle(); // ★新規追加
    initPortfolioFilter();
    initPromptCopy();
    initPortfolioModal(); // ★更新
});