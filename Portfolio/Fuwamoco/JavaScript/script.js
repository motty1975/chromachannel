document.addEventListener('DOMContentLoaded', () => {
    // ヘッダーのスクロール表示/非表示機能
    let lastScrollTop = 0;
    const header = document.getElementById('header');
    const floatingHamburger = document.getElementById('floating-hamburger');

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.classList.add('hidden');
            if (floatingHamburger) floatingHamburger.classList.add('visible');
        } else {
            header.classList.remove('hidden');
            if (floatingHamburger) floatingHamburger.classList.remove('visible');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // ハンバーガーメニュー機能 (フローティングも含む)
    const hamburgerNav = document.getElementById('hamburger-nav');
    const headerHamburger = document.getElementById('header-hamburger');

    const openNav = () => {
        hamburgerNav.classList.add('active');
        document.body.classList.add('no-scroll');
    };

    const closeNav = () => {
        hamburgerNav.classList.remove('active');
        document.body.classList.remove('no-scroll');
    };

    if (headerHamburger) headerHamburger.addEventListener('click', openNav);
    if (floatingHamburger) floatingHamburger.addEventListener('click', openNav);

    const closeBtn = document.createElement('div');
    closeBtn.classList.add('close-btn');
    closeBtn.innerHTML = '<button class="close-button">×</button>';
    if (hamburgerNav) {
        hamburgerNav.prepend(closeBtn);
        closeBtn.querySelector('.close-button').addEventListener('click', closeNav);
    }
    
    // アコーディオンメニュー機能
    document.querySelectorAll('.accordion-menu').forEach(menu => {
        menu.addEventListener('click', () => {
            const content = document.getElementById(menu.dataset.accordion);
            if (content) {
                menu.classList.toggle('active');
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
            }
        });
    });
});