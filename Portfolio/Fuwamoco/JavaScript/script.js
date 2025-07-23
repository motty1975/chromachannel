// DOM（HTMLの構造）が完全に読み込まれてから、全ての処理を開始するという、最も安全なおまじない
document.addEventListener('DOMContentLoaded', () => {

    /**
     * スムーススクロール機能を初期化する関数
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
     * スクロールに応じたフェードインアニメーション機能を初期化する関数
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
     * スクロールに応じたヘッダー背景変更機能を初期化する関数
     */
    const initHeaderScroll = () => {
        const header = document.querySelector('header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            header.style.background = window.scrollY > 50 ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.9)';
        });
    };
    
    /**
     * ポートフォリオのカテゴリフィルター機能を初期化する関数
     */
    const initPortfolioFilter = () => {
        const categoryBtns = document.querySelectorAll('.category-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        if (categoryBtns.length === 0 || portfolioItems.length === 0) return;
        
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
     * サムネイルギャラリーの開閉機能を初期化する関数
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
     * モーダルウィンドウ機能を初期化する関数
     */
    const initModal = () => {
        const modal = document.getElementById('modal');
        if (!modal) return;

        const elements = {
            image: document.getElementById('modal-image'),
            title: document.getElementById('modal-title'),
            description: document.getElementById('modal-description'),
            checkpoint: document.getElementById('modal-checkpoint'),
            positive: document.getElementById('modal-positive'),
            negative: document.getElementById('modal-negative'),
            settings: document.getElementById('modal-settings'),
            closeBtn: modal.querySelector('.close-btn'),
            prevBtn: document.getElementById('modal-prev'),
            nextBtn: document.getElementById('modal-next'),
        };
        
        let currentGallery = [];
        let currentIndex = -1;

        const updateModalContent = (thumbnail) => {
            elements.image.src = thumbnail.dataset.largeSrc || '';
            elements.title.textContent = thumbnail.dataset.title || '無題';
            elements.description.textContent = thumbnail.dataset.description || '';
            elements.checkpoint.textContent = thumbnail.dataset.checkpoint || 'N/A';
            elements.positive.textContent = thumbnail.dataset.positive || 'N/A';
            elements.negative.textContent = thumbnail.dataset.negative || 'N/A';
            elements.settings.textContent = thumbnail.dataset.settings || 'N/A';
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

        const closeModal = () => modal.classList.remove('show');

        elements.closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
        elements.prevBtn.addEventListener('click', showPrevImage);
        elements.nextBtn.addEventListener('click', showNextImage);
        
        document.addEventListener('keydown', e => {
            if (modal.classList.contains('show')) {
                if (e.key === 'Escape') closeModal();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    };

    /**
     * セクション別 音声再生機能を初期化する関数
     */
    const initSectionSpeech = () => {
        const audioPlayer = new Audio();
        let currentlyPlayingBtn = null;

        document.querySelectorAll('.speech-play-btn').forEach(button => {
            button.addEventListener('click', () => {
                const audioSrc = button.dataset.audioSrc;
                if (!audioSrc) return;

                if (currentlyPlayingBtn === button && !audioPlayer.paused) {
                    audioPlayer.pause();
                } else {
                    if (currentlyPlayingBtn) {
                        currentlyPlayingBtn.classList.remove('playing');
                        currentlyPlayingBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                    }
                    audioPlayer.src = audioSrc;
                    audioPlayer.play();
                    button.classList.add('playing');
                    button.innerHTML = '<i class="fas fa-stop-circle"></i>';
                    currentlyPlayingBtn = button;
                }
            });
        });

        audioPlayer.addEventListener('ended', () => {
            if (currentlyPlayingBtn) {
                currentlyPlayingBtn.classList.remove('playing');
                currentlyPlayingBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                currentlyPlayingBtn = null;
            }
        });

        audioPlayer.addEventListener('pause', () => {
             if (currentlyPlayingBtn) {
                currentlyPlayingBtn.classList.remove('playing');
                currentlyPlayingBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                currentlyPlayingBtn = null;
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
    initSectionSpeech(); // 音声再生機能も呼び出す
});