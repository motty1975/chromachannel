// DOMが完全に読み込まれてから、全ての処理を開始する安全なおまじない
document.addEventListener('DOMContentLoaded', () => {

    /**
     * モバイル用ハンバーガーメニューを初期化する
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
     * スクロールに応じたフェードインアニメーション機能を初期化する
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
     * ポートフォリオのカテゴリフィルター機能を初期化する
     * ★★★ ここを「詰めて表示する」ロジックに更新しました ★★★
     */
    const initPortfolioFilter = () => {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        if (categoryButtons.length === 0 || portfolioItems.length === 0) {
            return;
        }

        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;

                // 1. ボタンのアクティブ状態を切り替え
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // 2. アイテムの表示/非表示を切り替え
                portfolioItems.forEach(item => {
                    const itemCategories = item.dataset.category.split(' ');
                    const shouldShow = (category === 'all' || itemCategories.includes(category));
                    
                    // 表示すべきでないアイテムに 'hide' クラスを付け外しする
                    item.classList.toggle('hide', !shouldShow);
                });
            });
        });
    };
    
    /**
     * サムネイルギャラリーの開閉機能を初期化する
     */
    const initThumbnailToggle = () => {
        document.querySelectorAll('.gallery-toggle-btn').forEach(button => {
            const portfolioItem = button.closest('.portfolio-item');
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
    
    /**
     * モーダルウィンドウ機能を初期化する
     */
    const initModal = () => {
        // (この部分は変更なし)
    };

    // --- 全ての機能を初期化して実行 ---
    initMobileMenu();
    initScrollAnimation();
    initPortfolioFilter();
    initThumbnailToggle();
    initModal();
});