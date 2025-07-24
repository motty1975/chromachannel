// DOMが完全に読み込まれてから、全ての処理を開始する
document.addEventListener('DOMContentLoaded', () => {

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
                    const itemCategories = item.dataset.category.split(' ');
                    const shouldShow = (category === 'all' || itemCategories.includes(category));
                    item.classList.toggle('hide', !shouldShow);
                });
            });
        });
    };
    
    // サムネイルギャラリーの開閉機能を初期化
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
    
    // ▼▼▼ 【確定版】モーダルウィンドウ機能を初期化 ▼▼▼
    const initModal = () => {
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

        // モーダルを開く処理
        const openModal = (imgElement) => {
            if (!imgElement) return;
            const galleryWrapper = imgElement.closest('.thumbnail-gallery');
            currentGallery = Array.from(galleryWrapper.querySelectorAll('.thumbnail-img'));
            currentIndex = currentGallery.indexOf(imgElement);
            updateModalContent(imgElement);
            modal.classList.add('show');
        };

        // モーダルを閉じる処理
        const closeModal = () => modal.classList.remove('show');
        
        // モーダルの内容を更新する処理
        const updateModalContent = (imgElement) => {
            modalImage.src = imgElement.dataset.largeSrc;
            modalTitle.textContent = imgElement.dataset.title;
            modalDescription.textContent = imgElement.dataset.description;
            modalCheckpoint.textContent = imgElement.dataset.checkpoint;
            modalPositive.textContent = imgElement.dataset.positive;
            modalNegative.textContent = imgElement.dataset.negative;
            modalSettings.textContent = imgElement.dataset.settings;
        };
        
        // 前/次の画像へ移動する処理
        const navigateGallery = (direction) => {
            currentIndex += direction;
            if (currentIndex < 0) currentIndex = currentGallery.length - 1;
            if (currentIndex >= currentGallery.length) currentIndex = 0;
            updateModalContent(currentGallery[currentIndex]);
        };
        
        // ★★★ イベントリスナーのモダンな設定方法 ★★★
        document.body.addEventListener('click', (e) => {
            // もしクリックされたのがサムネイル画像なら、モーダルを開く
            if (e.target.matches('.thumbnail-img')) {
                openModal(e.target);
            }
        });
        
        // イベントリスナーの設定
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        prevBtn.addEventListener('click', () => navigateGallery(-1));
        nextBtn.addEventListener('click', () => navigateGallery(1));
    };

    // --- 全ての機能を初期化して実行 ---
    initMobileMenu();
    initScrollAnimation();
    initPortfolioFilter();
    initThumbnailToggle();
    initModal();
});