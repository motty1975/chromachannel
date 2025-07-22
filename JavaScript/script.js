// DOMが完全に読み込まれてから、全ての処理を開始する安全なおまじない
document.addEventListener('DOMContentLoaded', () => {

    /**
     * スムーススクロール機能を初期化する
     */
    const initSmoothScroll = () => {
        // (この中のコードは変更なし)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                if (this.getAttribute('href') === '#') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
                const targetId = this.getAttribute('href');
                if (document.querySelector(targetId)) {
                    e.preventDefault();
                    document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    };

    /**
     * スクロールに応じたフェードインアニメーション機能を初期化する
     */
    const initScrollAnimation = () => {
        // (この中のコードは変更なし)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    };

    /**
     * ヘッダーの背景変更機能を初期化する
     */
    const initHeaderScroll = () => {
        // (この中のコードは変更なし)
        const header = document.querySelector('header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            header.style.background = window.scrollY > 50 ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.9)';
        });
    };
    
    /**
     * ポートフォリオのカテゴリフィルター機能を初期化する
     * ★★★ ここを修正・整理しました ★★★
     */
    const initPortfolioFilter = () => {
        // 全てのフィルターボタンとポートフォリオアイテムを取得
        const categoryButtons = document.querySelectorAll('.category-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        // ボタンやアイテムが存在しない場合は、処理を中断
        if (categoryButtons.length === 0 || portfolioItems.length === 0) {
            return;
        }

        // 各ボタンにクリックイベントを設定
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;

                // 1. ボタンのアクティブ状態を切り替え
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // 2. ポートフォリオアイテムの表示/非表示を切り替え
                portfolioItems.forEach(item => {
                    // アイテムが持つカテゴリを配列で取得（スペース区切り対応）
                    const itemCategories = item.dataset.category.split(' '); 

                    // カテゴリが一致するかどうかを判定
                    const shouldShow = (category === 'all' || itemCategories.includes(category));
                    
                    // hideクラスを付けたり外したりする
                    item.classList.toggle('hide', !shouldShow);
                });
            });
        });
    };
    
    /**
     * サムネイルギャラリーの開閉機能を初期化する
     */
    const initThumbnailToggle = () => {
        // (この中のコードは変更なし)
        document.querySelectorAll('.gallery-toggle-btn').forEach(button => {
            const portfolioItem = button.closest('.portfolio-item');
            if (!portfolioItem) return;
            const thumbnailWrapper = portfolioItem.querySelector('.thumbnail-gallery-wrapper');

            if (thumbnailWrapper) {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    thumbnailWrapper.classList.toggle('open');
                    button.innerHTML = thumbnailWrapper.classList.contains('open') 
                        ? '<i class="fas fa-times"></i> 閉じる' 
                        : '<i class="fas fa-images"></i> ギャラリーを見る';
                });
            }
        });
    };
    
    /**
     * モーダルウィンドウ機能を初期化する
     */
    const initModal = () => {
        // (この中のコードは変更なし)
        const modal = document.getElementById('modal');
        if (!modal) return;
        
        // ...モーダル関連のコード...
    };


    // --- 全ての機能を初期化して実行 ---
    initSmoothScroll();
    initScrollAnimation();
    initHeaderScroll();
    initPortfolioFilter();
    initThumbnailToggle();
    initModal();
});