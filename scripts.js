/**
 * Great Destinations Vacations — 2026 Award-Winning Redesign
 * Cinematic Editorial Travel · Warm Luxury
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initCursorGlow();
        initHeader();
        initMobileMenu();
        initSmoothScroll();
        initRevealAnimations();
        initParallax();
        initFormValidation();
    }

    /* ======================================================================
       Cursor Glow — subtle warm follow on desktop
       ====================================================================== */
    function initCursorGlow() {
        const glow = document.querySelector('.cursor-glow');
        if (!glow || !window.matchMedia('(hover: hover)').matches) return;

        let x = 0, y = 0, cx = 0, cy = 0;
        document.addEventListener('mousemove', function (e) {
            x = e.clientX;
            y = e.clientY;
        }, { passive: true });

        function tick() {
            cx += (x - cx) * 0.08;
            cy += (y - cy) * 0.08;
            glow.style.transform = 'translate(' + (cx - 160) + 'px,' + (cy - 160) + 'px)';
            requestAnimationFrame(tick);
        }
        tick();
    }

    /* ======================================================================
       Header — glass morphism on scroll
       ====================================================================== */
    function initHeader() {
        const header = document.querySelector('.header');
        if (!header) return;

        let ticking = false;

        function update() {
            if (window.scrollY > 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) { requestAnimationFrame(update); ticking = true; }
        }, { passive: true });

        update();
    }

    /* ======================================================================
       Mobile Menu
       ====================================================================== */
    function initMobileMenu() {
        const toggle = document.querySelector('.mobile-toggle');
        const menu = document.querySelector('.nav-links');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', function () {
            const open = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !open);
            menu.classList.toggle('open');
            document.body.style.overflow = !open ? 'hidden' : '';

            // Update toggle bar colour when menu open on scrolled header
            if (!open) {
                toggle.querySelectorAll('.toggle-bar').forEach(function (b) { b.style.background = 'var(--ink)'; });
            } else {
                toggle.querySelectorAll('.toggle-bar').forEach(function (b) { b.style.background = ''; });
            }
        });

        menu.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                toggle.setAttribute('aria-expanded', 'false');
                menu.classList.remove('open');
                document.body.style.overflow = '';
                toggle.querySelectorAll('.toggle-bar').forEach(function (b) { b.style.background = ''; });
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('open')) {
                toggle.setAttribute('aria-expanded', 'false');
                menu.classList.remove('open');
                document.body.style.overflow = '';
                toggle.querySelectorAll('.toggle-bar').forEach(function (b) { b.style.background = ''; });
                toggle.focus();
            }
        });
    }

    /* ======================================================================
       Smooth Scroll
       ====================================================================== */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                var id = this.getAttribute('href');
                if (id === '#') return;
                var el = document.querySelector(id);
                if (!el) return;
                e.preventDefault();
                var offset = document.querySelector('.header').offsetHeight || 76;
                var top = el.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
                history.pushState(null, null, id);
                el.setAttribute('tabindex', '-1');
                el.focus({ preventScroll: true });
            });
        });
    }

    /* ======================================================================
       Scroll Reveal — IntersectionObserver
       ====================================================================== */
    function initRevealAnimations() {
        var items = document.querySelectorAll('[data-reveal]');
        if (!items.length) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            items.forEach(function (el) { el.classList.add('visible'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });

        items.forEach(function (el) { observer.observe(el); });
    }

    /* ======================================================================
       Lightweight Parallax for hero
       ====================================================================== */
    function initParallax() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var heroImg = document.querySelector('.hero-img');
        if (!heroImg) return;

        var ticking = false;

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    var scrollY = window.scrollY;
                    if (scrollY < window.innerHeight) {
                        heroImg.style.transform = 'scale(' + (1 + scrollY * 0.00015) + ') translateY(' + (scrollY * 0.25) + 'px)';
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* ======================================================================
       Form Validation & Submission
       ====================================================================== */
    function initFormValidation() {
        var form = document.querySelector('.contact-form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = form.querySelector('button[type="submit"]');
            var original = btn.innerHTML;
            var valid = true;

            form.querySelectorAll('[required]').forEach(function (f) {
                clearError(f);
                if (!f.value.trim()) { setError(f, 'This field is required'); valid = false; }
                else if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) { setError(f, 'Please enter a valid email'); valid = false; }
            });

            if (!valid) {
                var first = form.querySelector('.has-error');
                if (first) first.focus();
                return;
            }

            btn.disabled = true;
            btn.innerHTML = '<svg class="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" opacity=".25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/></svg><span>Sending...</span>';

            setTimeout(function () {
                btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>Message Sent!</span>';
                btn.style.background = '#5cb882';

                setTimeout(function () {
                    form.reset();
                    btn.disabled = false;
                    btn.innerHTML = original;
                    btn.style.background = '';
                }, 3000);
            }, 1500);
        });

        form.querySelectorAll('.form-input').forEach(function (inp) {
            inp.addEventListener('blur', function () { validateField(this); });
            inp.addEventListener('input', function () { if (this.classList.contains('has-error')) validateField(this); });
        });
    }

    function validateField(f) {
        clearError(f);
        if (f.hasAttribute('required') && !f.value.trim()) { setError(f, 'Required'); return false; }
        if (f.type === 'email' && f.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) { setError(f, 'Invalid email'); return false; }
        return true;
    }

    function setError(f, msg) {
        f.classList.add('has-error');
        f.style.borderColor = '#d45';
        if (!f.parentNode.querySelector('.form-err')) {
            var s = document.createElement('span');
            s.className = 'form-err';
            s.textContent = msg;
            s.style.cssText = 'color:#d45;font-size:.75rem;margin-top:.2rem;display:block';
            f.parentNode.appendChild(s);
        }
    }

    function clearError(f) {
        f.classList.remove('has-error');
        f.style.borderColor = '';
        var err = f.parentNode.querySelector('.form-err');
        if (err) err.remove();
    }

    /* ======================================================================
       Spinner CSS (injected)
       ====================================================================== */
    var style = document.createElement('style');
    style.textContent = '.spin{animation:sp .8s linear infinite}@keyframes sp{to{transform:rotate(360deg)}}';
    document.head.appendChild(style);

})();
