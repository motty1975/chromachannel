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
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
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
     * ヘッダーの背景変更機能を初期化する
     */
    const initHeaderScroll = () => {
        const header = document.querySelector('header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            const isScrolled = window.scrollY > 50;
            header.style.background = isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.9)';
        });
    };

    // --- 全ての機能を初期化して実行 ---
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimation();
    initHeaderScroll();
});