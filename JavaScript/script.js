// DOM（HTMLの構造）が完全に読み込まれてから、全ての処理を開始するという、最も安全なおまじない
document.addEventListener('DOMContentLoaded', () => {

    // --- スムーススクロール機能 ---
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                if (this.getAttribute('href') === '#') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    };

    // --- スクロールに応じたフェードインアニメーション機能 ---
    const initScrollAnimation = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // 一度表示されたら監視を解除
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    };

    // --- ヘッダー背景変更機能 ---
    const initHeaderScroll = () => {
        const header = document.querySelector('header');
        window.addEventListener('scroll', () => {
            header.style.background = window.scrollY > 50 ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.9)';
        });
    };
    
    // --- ポートフォリオのカテゴリフィルター機能 ---
    const initPortfolioFilter = () => {
        const categoryBtns = document.querySelectorAll('.category-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
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
    
    // --- サムネイルギャラリー開閉機能（最終修正版） ---
    const initThumbnailToggle = () => {
        document.querySelectorAll('.gallery-toggle-btn').forEach(button => {
            // ボタンの親である「portfolio-item」全体を探す
            const portfolioItem = button.closest('.portfolio-item');
            if (!portfolioItem) {
                console.error("ボタンの親.portfolio-itemが見つかりません", button);
                return; // 親が見つからなければ、このボタンの処理は中断
            }

            // その「portfolio-item」の中から、ギャラリーラッパーを探す
            const thumbnailWrapper = portfolioItem.querySelector('.thumbnail-gallery-wrapper');

            // ボタンとラッパーが両方見つかった場合のみ、イベントを設定
            if (button && thumbnailWrapper) {
                button.addEventListener('click', (e) => {
                    e.stopPropagation(); // 他のクリックイベントとの干渉を防ぐ
                    
                    thumbnailWrapper.classList.toggle('open');
                    
                    const isOpen = thumbnailWrapper.classList.contains('open');
                    button.innerHTML = isOpen 
                        ? '<i class="fas fa-times"></i> 閉じる' 
                        : '<i class="fas fa-images"></i> ギャラリーを見る';
                });
            } else {
                console.error("ギャラリーラッパー.thumbnail-gallery-wrapperが見つかりません", portfolioItem);
            }
        });
    };
    
    // --- モーダルウィンドウ機能 ---
    const initModal = () => {
        const modal = document.getElementById('modal');
        if (!modal) return;

        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const modalCheckpoint = document.getElementById('modal-checkpoint');
        const modalPositive = document.getElementById('modal-positive');
        const modalNegative = document.getElementById('modal-negative');
        const modalSettings = document.getElementById('modal-settings');
        const closeModalBtn = modal.querySelector('.close-btn');
        const prevBtn = document.getElementById('modal-prev');
        const nextBtn = document.getElementById('modal-next');
        
        let currentGallery = [];
        let currentIndex = -1;

        const updateModalContent = (thumbnail) => {
            modalImage.src = thumbnail.dataset.largeSrc || '';
            modalTitle.textContent = thumbnail.dataset.title || '無題';
            modalDescription.textContent = thumbnail.dataset.description || '';
            modalCheckpoint.textContent = thumbnail.dataset.checkpoint || 'N/A';
            modalPositive.textContent = thumbnail.dataset.positive || 'N/A';
            modalNegative.textContent = thumbnail.dataset.negative || 'N/A';
            modalSettings.textContent = thumbnail.dataset.settings || 'N/A';
        };
        
        document.querySelectorAll('.thumbnail-gallery').forEach(gallery => {
            gallery.addEventListener('click', e => {
                if (e.target.classList.contains('thumbnail-img')) {
                    currentGallery = Array.from(gallery.querySelectorAll('.thumbnail-img'));
                    currentIndex = currentGallery.indexOf(e.target);
                    updateModalContent(currentGallery[currentIndex]);
                    modal.classList.add('show');
                }
            });
        });
        
        const showPrevImage = () => {
            if (currentGallery.length === 0) return;
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            updateModalContent(currentGallery[currentIndex]);
        };

        const showNextImage = () => {
            if (currentGallery.length === 0) return;
            currentIndex = (currentIndex + 1) % currentGallery.length;
            updateModalContent(currentGallery[currentIndex]);
        };

        const closeModal = () => {
            modal.classList.remove('show');
        };

        closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
        
        document.addEventListener('keydown', e => {
            if (modal.classList.contains('show')) {
                if (e.key === 'Escape') closeModal();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    };

    // --- 全ての機能を初期化して実行 ---
    initSmoothScroll();
    initScrollAnimation();
    initHeaderScroll();
    initPortfolioFilter();
    initThumbnailToggle();
    initModal();
});