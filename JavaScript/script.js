// DOMが完全に読み込まれてから、全ての処理を開始する
document.addEventListener('DOMContentLoaded', () => {

    // --- サイト共通の機能 ---

    // モバイル用ハンバーガーメニューを初期化
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

    // スクロールに応じたフェードインアニメーションを初期化
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

    // ヘッダーのスクロール効果を初期化
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

    // --- 「読む」ページ共通の機能 ---

    // ポートフォリオのカテゴリフィルターを初期化
    const initPortfolioFilter = () => {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        if (categoryButtons.length === 0 || portfolioItems.length === 0) return;

        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                portfolioItems.forEach(item => {
                    const itemCategories = item.dataset.category ? item.dataset.category.split(' ') : [];
                    const shouldShow = (category === 'all' || itemCategories.includes(category));
                    if(shouldShow) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    };
    
    // サムネイルギャラリーの開閉機能を初期化
    const initThumbnailToggle = () => {
        document.querySelectorAll('.gallery-toggle-btn').forEach(button => {
            const portfolioItem = button.closest('.portfolio-card');
            if (!portfolioItem) return;
            const thumbnailWrapper = portfolioItem.querySelector('.thumbnail-gallery-wrapper');
            if (thumbnailWrapper) {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    thumbnailWrapper.classList.toggle('open');
                    button.innerHTML = thumbnailWrapper.classList.contains('open') 
                        ? '<i class="fas fa-times"></i> ギャラリーを閉じる' 
                        : '<i class="fas fa-images"></i> ギャラリーを見る';
                });
            }
        });
    };
    
    // ポートフォリオ用モーダルウィンドウ機能を初期化
    const initPortfolioModal = () => {
        const modal = document.getElementById('modal');
        if (!modal) return;
        
        const closeBtn = modal.querySelector('.close-btn');
        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const modalCheckpoint = document.getElementById('modal-checkpoint');
        const modalPositive = document.getElementById('modal-positive');
        const modalNegative = document.getElementById('modal-negative');
        const modalSettings = document.getElementById('modal-settings');
        const prevBtn = document.getElementById('modal-prev');
        const nextBtn = document.getElementById('modal-next');

        let currentGallery = [];
        let currentIndex = -1;

        const openModal = (imgElement) => {
            if (!imgElement) return;
            const galleryWrapper = imgElement.closest('.thumbnail-gallery');
            if (!galleryWrapper) return;
            currentGallery = Array.from(galleryWrapper.querySelectorAll('.thumbnail-img'));
            currentIndex = currentGallery.indexOf(imgElement);
            updateModalContent(imgElement);
            modal.classList.add('show');
        };

        const closeModal = () => modal.classList.remove('show');
        
        const updateModalContent = (imgElement) => {
            modalImage.src = imgElement.dataset.largeSrc || '';
            modalTitle.textContent = imgElement.dataset.title || '';
            modalDescription.textContent = imgElement.dataset.description || '';
            modalCheckpoint.textContent = imgElement.dataset.checkpoint || '';
            modalPositive.textContent = imgElement.dataset.positive || '';
            modalNegative.textContent = imgElement.dataset.negative || '';
            modalSettings.textContent = imgElement.dataset.settings || '';
        };
        
        const navigateGallery = (direction) => {
            if(currentGallery.length === 0) return;
            currentIndex += direction;
            if (currentIndex < 0) currentIndex = currentGallery.length - 1;
            if (currentIndex >= currentGallery.length) currentIndex = 0;
            updateModalContent(currentGallery[currentIndex]);
        };
        
        document.body.addEventListener('click', (e) => {
            if (e.target.matches('.thumbnail-img')) {
                openModal(e.target);
            }
        });
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        prevBtn.addEventListener('click', () => navigateGallery(-1));
        nextBtn.addEventListener('click', () => navigateGallery(1));

        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('show')) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') navigateGallery(-1);
            if (e.key === 'ArrowRight') navigateGallery(1);
        });
    };

    // 学習ページ用Coming Soonモーダルを初期化
    const initLearnModal = () => {
        const modal = document.getElementById('learn-modal');
        if (!modal) return;

        const openButtons = document.querySelectorAll('.open-learn-modal-btn');
        const closeBtn = modal.querySelector('.learn-modal-close-btn');
        const modalTitle = document.getElementById('learn-modal-title');
        const modalChapters = document.getElementById('learn-modal-chapters');

        const openModal = (button) => {
            const title = button.dataset.title;
            const chapters = button.dataset.chapters.split('|');

            modalTitle.textContent = title;
            modalChapters.innerHTML = '';
            chapters.forEach(chapter => {
                const li = document.createElement('li');
                li.textContent = chapter;
                modalChapters.appendChild(li);
            });

            modal.classList.add('show');
        };

        const closeModal = () => {
            modal.classList.remove('show');
        };

        openButtons.forEach(button => {
            button.addEventListener('click', () => openModal(button));
        });

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
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
});