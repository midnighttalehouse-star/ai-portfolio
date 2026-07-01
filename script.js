/* ============================================================
   Saddam Hussain — Portfolio interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---- Current year ---- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---- Navbar: shrink on scroll + scroll progress bar ---- */
    const navbar = document.getElementById('navbar');
    const progress = document.getElementById('scrollProgress');

    const onScroll = () => {
        const y = window.scrollY;
        if (navbar) navbar.classList.toggle('scrolled', y > 24);

        if (progress) {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.width = h > 0 ? `${(y / h) * 100}%` : '0%';
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---- Mobile menu ---- */
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');

    const closeMenu = () => {
        toggle?.classList.remove('open');
        menu?.classList.remove('open');
        toggle?.setAttribute('aria-expanded', 'false');
    };

    toggle?.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
    });

    menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    /* ---- Scroll reveal ---- */
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // small stagger for siblings
                    entry.target.style.transitionDelay = `${Math.min(i * 60, 180)}ms`;
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(el => io.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('visible'));
    }

    /* ---- Animated stat counters ---- */
    const counters = document.querySelectorAll('.stat-num');
    const animateCount = (el) => {
        const target = parseInt(el.dataset.target, 10) || 0;
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();

        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            // easeOutCubic
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window && counters.length) {
        const co = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    co.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });
        counters.forEach(el => co.observe(el));
    } else {
        counters.forEach(el => el.textContent = (el.dataset.target || '') + (el.dataset.suffix || ''));
    }
});
