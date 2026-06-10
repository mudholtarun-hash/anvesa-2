// ============================================
// ANVESA - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ====== THEME TOGGLE (Dark Mode) ======
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const savedTheme = localStorage.getItem('anvesa-theme');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('anvesa-theme', isDark ? 'dark' : 'light');
        themeIcon.classList.toggle('fa-moon', !isDark);
        themeIcon.classList.toggle('fa-sun', isDark);
    });

    // ====== MOBILE MENU ======
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
        menuToggle.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-open');
            menuToggle.classList.remove('open');
        });
    });

    // ====== STICKY NAVBAR ======
    const navbar = document.getElementById('navbar');
    const onScrollNav = () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScrollNav);
    onScrollNav();

    // ====== SMOOTH SCROLLING ======
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 70;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ====== ACTIVE LINK ON SCROLL ======
    const sections = document.querySelectorAll('section[id]');
    const navLinkEls = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 100;
            if (window.scrollY >= top) current = sec.id;
        });
        navLinkEls.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
        });
    });

    // ====== SCROLL REVEAL ======
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 60);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObserver.observe(el));

    // ====== ANIMATED COUNTERS ======
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;
    const animateCounters = () => {
        if (countersAnimated) return;
        const statsSection = document.querySelector('.stats');
        if (!statsSection) return;
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            countersAnimated = true;
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const prefix = counter.getAttribute('data-prefix') || '';
                const duration = 2000;
                const start = performance.now();

                const formatNum = n => {
                    if (n >= 10000000) return (n / 10000000).toFixed(1) + 'Cr';
                    if (n >= 100000) return (n / 100000).toFixed(1) + 'L';
                    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
                    return Math.floor(n).toString();
                };

                const tick = (now) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const value = eased * target;
                    counter.textContent = prefix + formatNum(value);
                    if (progress < 1) {
                        requestAnimationFrame(tick);
                    } else {
                        counter.textContent = prefix + formatNum(target);
                    }
                };
                requestAnimationFrame(tick);
            });
        }
    };
    window.addEventListener('scroll', animateCounters);
    animateCounters();

    // ====== FAQ ACCORDION ======
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const q = item.querySelector('.faq-q');
        q.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            faqItems.forEach(i => i.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });

    // ====== BACK TO TOP ======
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ====== CONTACT FORM VALIDATION ======
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    const showErr = (id, msg) => {
        const el = document.getElementById(id);
        if (el) el.textContent = msg;
    };
    const clearErrs = () => {
        ['errName', 'errEmail', 'errMsg'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '';
        });
    };

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrs();
        formSuccess.classList.remove('show');

        const name = document.getElementById('cName').value.trim();
        const email = document.getElementById('cEmail').value.trim();
        const msg = document.getElementById('cMsg').value.trim();

        let valid = true;
        if (name.length < 2) { showErr('errName', 'Please enter your full name'); valid = false; }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) { showErr('errEmail', 'Please enter a valid email address'); valid = false; }
        if (msg.length < 10) { showErr('errMsg', 'Message must be at least 10 characters'); valid = false; }

        if (valid) {
            formSuccess.classList.add('show');
            contactForm.reset();
            setTimeout(() => formSuccess.classList.remove('show'), 5000);
        }
    });

    // ====== NEWSLETTER ======
    const newsForm = document.getElementById('newsForm');
    const newsSuccess = document.getElementById('newsSuccess');
    newsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('newsEmail').value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailPattern.test(email)) {
            newsSuccess.classList.add('show');
            newsForm.reset();
            setTimeout(() => newsSuccess.classList.remove('show'), 4000);
        }
    });

    // ====== PARALLAX-LIKE HERO BLOBS ======
    const blobs = document.querySelectorAll('.blob');
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;
        blobs.forEach((blob, i) => {
            const factor = (i + 1) * 0.5;
            blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    });

});
