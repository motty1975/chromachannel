document.addEventListener('DOMContentLoaded', () => {

    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                if (this.getAttribute('href') === '#') return;
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
            });
        });
    };

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

    const initHeaderScroll = () => {
        const header = document.querySelector('header');
        window.addEventListener('scroll', () => {
            header.style.background = window.scrollY > 50 ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)';
        });
    };
    
    const initPortfolioFilter = () => {
        const categoryBtns = document.querySelectorAll('.category-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        const portfolioGrid = document.querySelector('.portfolio-grid');

        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const targetCategory = btn.dataset.category;

                portfolioGrid.style.height = portfolioGrid.offsetHeight + 'px';

                portfolioItems.forEach(item => {
                    const itemIsVisible = targetCategory === 'all' || item.dataset.category === targetCategory;
                    item.classList.toggle('hidden', !itemIsVisible);
                });
                
                setTimeout(() => {
                        portfolioGrid.style.height = '';
                }, 500);
            });
        });
    };

    const initThumbnailToggle = () => {
        document.querySelectorAll('.clickable-card .portfolio-content').forEach(contentArea => {
            const card = contentArea.closest('.portfolio-card');
            const thumbnailWrapper = card.querySelector('.thumbnail-gallery-wrapper');
            if (thumbnailWrapper) {
                contentArea.addEventListener('click', (e) => {
                    e.stopPropagation();
                    thumbnailWrapper.classList.toggle('open');
                });
            }
        });
    };
    
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
        const closeModalBtn = document.querySelector('.close-btn');
        const prevBtn = document.getElementById('modal-prev');
        const nextBtn = document.getElementById('modal-next');
        
        let currentGallery = [];
        let currentIndex = -1;

        const updateModalContent = (thumbnail) => {
            modalImage.src = thumbnail.dataset.largeSrc || '';
            modalTitle.textContent = thumbnail.dataset.title || 'No Title';
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
        document.addEventListener('keydown', e => {
            if (modal.classList.contains('show')) {
                if (e.key === 'Escape') closeModal();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
    };

    // --- すべての機能を初期化 ---
    initSmoothScroll();
    initScrollAnimation();
    initHeaderScroll();
    initPortfolioFilter();
    initThumbnailToggle();
    initModal();
});