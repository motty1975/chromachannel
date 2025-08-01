document.addEventListener('DOMContentLoaded', () => {

    // --- サイト共通の機能 ---

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
    
    const initGalleryToggle = () => {
        const toggleButtons = document.querySelectorAll('.gallery-toggle-btn');
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const portfolioCard = button.closest('.portfolio-card');
                const galleryWrapper = portfolioCard.querySelector('.thumbnail-gallery-wrapper');
                if (galleryWrapper) {
                    galleryWrapper.classList.toggle('open');
                    button.innerHTML = galleryWrapper.classList.contains('open') ?
                        '<i class="fas fa-times-circle"></i> ギャラリーを閉じる' :
                        '<i class="fas fa-images"></i> ギャラリーを見る';
                }
            });
        });
    };

    const initPromptCopy = () => {
        const promptList = document.querySelector('.prompt-list');
        if (!promptList) return;
        promptList.addEventListener('click', (e) => {
            const copyButton = e.target.closest('.copy-btn');
            if (!copyButton || copyButton.classList.contains('copied')) return;
            const promptBox = copyButton.closest('.prompt-box');
            if (!promptBox) return;
            const titleElement = promptBox.querySelector('.prompt-title');
            const textElement = promptBox.querySelector('.prompt-text');
            if (!textElement) return;
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
    
    const initPortfolioModal = () => {
        const modal = document.getElementById('portfolio-modal');
        if (!modal) return;
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
        
        const openModal = (clickedItem) => {
            currentGalleryItems = Array.from(document.querySelectorAll('.portfolio-item:not([style*="display: none"]) .thumbnail-img'));
            currentIndex = currentGalleryItems.indexOf(clickedItem);
            if (currentIndex === -1) return;
            updateModalContent(clickedItem);
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        };
        
        const navigateGallery = (direction) => {
            if (currentGalleryItems.length <= 1) return;
            currentIndex = (currentIndex + direction + currentGalleryItems.length) % currentGalleryItems.length;
            updateModalContent(currentGalleryItems[currentIndex]);
        };
        
        const grid = document.querySelector('.portfolio-grid');
        if(grid){
            grid.addEventListener('click', (e) => {
                const thumbnail = e.target.closest('.thumbnail-img');
                if (thumbnail) openModal(thumbnail);
            });
        }
        
        if(closeBtn) closeBtn.addEventListener('click', closeModal);
        if(modal) modal.addEventListener('click', (e) => (e.target === modal) && closeModal());
        if(prevBtn) prevBtn.addEventListener('click', () => navigateGallery(-1));
        if(nextBtn) nextBtn.addEventListener('click', () => navigateGallery(1));
        
        document.addEventListener('keydown', (e) => {
            if (!modal || !modal.classList.contains('show')) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') navigateGallery(-1);
            if (e.key === 'ArrowRight') navigateGallery(1);
        });
    };

    const initLearnModal = () => {
        const modal = document.getElementById('learn-modal');
        if (!modal) return;
        const openButtons = document.querySelectorAll('.open-learn-modal-btn');
        const closeButton = document.querySelector('.learn-modal-close-btn');
        const modalTitle = document.getElementById('learn-modal-title');
        const modalChapters = document.getElementById('learn-modal-chapters');

        openButtons.forEach(button => {
            button.addEventListener('click', () => {
                const title = button.dataset.title || '講座';
                const chapters = button.dataset.chapters ? button.dataset.chapters.split('|') : [];
                
                modalTitle.textContent = title;
                modalChapters.innerHTML = '';
                chapters.forEach(chapter => {
                    const li = document.createElement('li');
                    li.textContent = chapter;
                    modalChapters.appendChild(li);
                });

                modal.style.display = 'flex';
            });
        });

        const closeModal = () => {
            modal.style.display = 'none';
        };

        closeButton.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    };

    const initFilter = () => {
        const filterContainer = document.querySelector('.portfolio-categories');
        if (!filterContainer) return;

        const filterButtons = filterContainer.querySelectorAll('.category-btn');
        const items = document.querySelectorAll('.portfolio-item');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;

                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                items.forEach(item => {
                    const itemCategories = item.dataset.category ? item.dataset.category.split(' ') : [];
                    
                    if (category === 'all' || itemCategories.includes(category)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    };

    // --- サイト全体の機能を初期化して実行 ---
    initMobileMenu();
    initScrollAnimation();
    initHeaderScrollEffect();
    initGalleryToggle();
    initPromptCopy();
    initPortfolioModal();
    initLearnModal();
    initFilter();
});