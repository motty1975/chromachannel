// DOMが完全に読み込まれてから、全ての処理を開始する安全なおまじない
document.addEventListener('DOMContentLoaded', () => {

    /**
     * スムーススクロール機能を初期化する
     */
    const initSmoothScroll = () => {
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
        const header = document.querySelector('header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            header.style.background = window.scrollY > 50 ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.9)';
        });
    };
    
    /**
     * ポートフォリオのカテゴリフィルター機能を初期化する
     */
    const initPortfolioFilter = () => {
        const categoryBtns = document.querySelectorAll('.category-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        if (categoryBtns.length === 0) return;
        
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const targetCategory = btn.dataset.category;

                portfolioItems.forEach(item => {
                    const itemCategories = item.dataset.category ? item.dataset.category.split(' ') : [];
                    const itemIsVisible = targetCategory === 'all' || itemCategories.includes(targetCategory);
                    item.classList.toggle('hidden', !itemIsVisible);
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
        const modal = document.getElementById('modal');
        if (!modal) return;
        
        // (モーダル機能のコードは変更なしなので、ここにそのまま配置)
        // ...
    };


    // --- 全ての機能を初期化して実行 ---
    initSmoothScroll();
    initScrollAnimation();
    initHeaderScroll();
    initPortfolioFilter();
    initThumbnailToggle();
    initModal();
});