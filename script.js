// ===== MFL — Fully Upgraded Script =====
// All phases: nav dropdown, stat counters, quote form (11 fields),
// WhatsApp float, back-to-top, scroll reveal, modal focus trap, toast

document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initMobileMenu();
    initServicesDropdown();
    initSmoothScroll();
    initScrollAnimations();
    initStatCounters();
    initMapPins();
    initRevealObserver();
    initScrollTopBtn();
    initScrollSpy();
    initScrollProgress();
    initQuoteForm();
    initModalAccessibility();
    initDateInputs();
    initWaFloat();
});


// =========================================================
// Navbar: transparent → navy+blur on scroll,
// compact padding when scrolled > 80px
// =========================================================
function initNavbar() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    function handleNavScroll() {
        if (window.scrollY > 80) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    }

    handleNavScroll();
    window.addEventListener('scroll', handleNavScroll, { passive: true });
}


// =========================================================
// Mobile hamburger menu
// =========================================================
function initMobileMenu() {
    var toggle   = document.getElementById('mobileToggle');
    var navLinks = document.getElementById('navLinks');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', function () {
        var isOpen = navLinks.classList.toggle('open');
        var icon   = toggle.querySelector('i');
        if (icon) icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        if (!isOpen) closeServicesDropdown();
    });

    // Auto-close when any nav link (not dropdown toggle) is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('open');
            var icon = toggle.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
            closeServicesDropdown();
        });
    });
}


// =========================================================
// Services dropdown — hover (desktop) + click (mobile/keyboard)
// =========================================================
function initServicesDropdown() {
    var servicesToggle   = document.getElementById('servicesToggle');
    var servicesDropdown = document.getElementById('servicesDropdown');
    if (!servicesToggle || !servicesDropdown) return;

    var parentLi = servicesToggle.parentElement;
    var closeTimer = null;

    function handleMouseEnter() {
        if (window.innerWidth <= 768) return; // Only hover on desktop
        if (closeTimer) {
            clearTimeout(closeTimer);
            closeTimer = null;
        }
        openServicesDropdown();
    }

    function handleMouseLeave() {
        if (window.innerWidth <= 768) return; // Only hover on desktop
        if (closeTimer) clearTimeout(closeTimer);
        closeTimer = setTimeout(function () {
            closeServicesDropdown();
        }, 300); // 300ms delay to prevent closing during hover gaps or click registration
    }

    // Desktop hover bindings on parent <li> and the dropdown menu itself
    parentLi.addEventListener('mouseenter', handleMouseEnter);
    parentLi.addEventListener('mouseleave', handleMouseLeave);
    servicesDropdown.addEventListener('mouseenter', handleMouseEnter);
    servicesDropdown.addEventListener('mouseleave', handleMouseLeave);

    // Click / tap toggle (mobile + keyboard users)
    servicesToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        if (closeTimer) {
            clearTimeout(closeTimer);
            closeTimer = null;
        }
        if (servicesDropdown.classList.contains('open')) {
            closeServicesDropdown();
        } else {
            openServicesDropdown();
        }
    });

    // Dropdown links — close nav completely after selecting a service (with a delay so navigation registers)
    servicesDropdown.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
            setTimeout(function () {
                closeServicesDropdown();
                var navLinks = document.getElementById('navLinks');
                var toggle   = document.getElementById('mobileToggle');
                if (navLinks) navLinks.classList.remove('open');
                if (toggle) {
                    var icon = toggle.querySelector('i');
                    if (icon) icon.className = 'fas fa-bars';
                }
            }, 150);
        });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
        if (!parentLi.contains(e.target)) closeServicesDropdown();
    });
}

function openServicesDropdown() {
    var toggle   = document.getElementById('servicesToggle');
    var dropdown = document.getElementById('servicesDropdown');
    if (!toggle || !dropdown) return;
    dropdown.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
}

function closeServicesDropdown() {
    var toggle   = document.getElementById('servicesToggle');
    var dropdown = document.getElementById('servicesDropdown');
    if (!toggle || !dropdown) return;
    dropdown.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
}


// =========================================================
// Smooth scroll for anchor links
// =========================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            var target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}


// =========================================================
// Stat Counters (IntersectionObserver, no external libs)
// Stat 1 "Since 2001"      → static, no animation
// Stat 2 "20+"             → count-up 0→20
// Stat 3 "6"               → count-up 0→6
// Stat 4 "FTL·PTL·Express" → static, no animation
// =========================================================
function initStatCounters() {
    // Count-up helper
    function animateCount(el, target, duration, onComplete) {
        if (!el) return;
        var hasRun = false;
        var obs = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !hasRun) {
                    hasRun = true;
                    observer.unobserve(entry.target);
                    el.classList.add('is-visible');

                    var startTime = null;
                    function step(timestamp) {
                        if (!startTime) startTime = timestamp;
                        var progress = Math.min((timestamp - startTime) / duration, 1);
                        var eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                        el.textContent = Math.floor(eased * target);
                        if (progress < 1) {
                            requestAnimationFrame(step);
                        } else {
                            el.textContent = target;
                            if (onComplete) onComplete();
                        }
                    }
                    requestAnimationFrame(step);
                }
            });
        }, { threshold: 0.5 });
        obs.observe(el);
    }

    // Active Routes: 0 → 20, then reveal "+"
    var routesEl   = document.getElementById('statRoutes');
    var routesPlus = document.getElementById('statRoutesPlus');
    animateCount(routesEl, 20, 1500, function () {
        if (routesPlus) routesPlus.style.opacity = '1';
    });

    // Industries Served: 0 → 6
    var industEl = document.getElementById('statIndustries');
    animateCount(industEl, 6, 900, null);

    // Fade-in for any remaining .stat-fade elements (used on other sections)
    var fadeObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('.stat-fade').forEach(function (el) {
        // Skip stat counter elements already handled above
        if (el.id === 'statRoutes' || el.id === 'statIndustries') return;
        fadeObs.observe(el);
    });
}


// =========================================================
// Upgraded Quote Form — 11 fields, FormSubmit AJAX
// Handles both: modal form (#quoteForm) and
// contact page form (#contactPageForm)
// =========================================================
function initQuoteForm() {
    var modalForm   = document.getElementById('quoteForm');
    var contactForm = document.getElementById('contactPageForm');

    if (modalForm) {
        attachFormHandler(modalForm, 'submitBtn', 'quoteFormWrap', 'quoteSuccess');
    }
    if (contactForm) {
        attachFormHandler(contactForm, 'contactSubmitBtn', 'contactFormWrap', 'contactFormSuccess');
    }
}

function attachFormHandler(form, submitBtnId, wrapId, successId) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Clear previous errors
        form.querySelectorAll('.field-error').forEach(function (el) { el.remove(); });
        form.querySelectorAll('input, select, textarea').forEach(function (el) {
            el.style.borderColor = '';
        });

        var valid = true;
        var phoneRegex = /^[6-9][0-9]{9}$/;

        var fullName  = form.querySelector('[name="full_name"]');
        var company   = form.querySelector('[name="company_name"]');
        var phone     = form.querySelector('[name="phone"]');
        var service   = form.querySelector('[name="service_type"]');
        var origin    = form.querySelector('[name="origin_city"]');
        var dest      = form.querySelector('[name="destination_city"]');
        var weight    = form.querySelector('[name="approx_weight"]');
        var cargo     = form.querySelector('[name="cargo_type"]');

        if (!fullName || !fullName.value.trim())                         { showFieldError(fullName,  'Full name is required'); valid = false; }
        if (!company  || !company.value.trim())                          { showFieldError(company,   'Company name is required'); valid = false; }
        if (!phone    || !phoneRegex.test(phone.value.trim()))           { showFieldError(phone,     'Enter a valid 10-digit mobile number starting with 6–9'); valid = false; }
        if (!service  || !service.value)                                 { showFieldError(service,   'Please select a service type'); valid = false; }
        if (!origin   || !origin.value.trim())                           { showFieldError(origin,    'Origin city is required'); valid = false; }
        if (!dest     || !dest.value.trim())                             { showFieldError(dest,      'Destination city is required'); valid = false; }
        if (!weight   || !weight.value)                                  { showFieldError(weight,    'Please select an approximate weight'); valid = false; }
        if (!cargo    || !cargo.value)                                   { showFieldError(cargo,     'Please select a cargo type'); valid = false; }

        if (!valid) return;

        var btn = document.getElementById(submitBtnId);
        if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

        // OWNER: Form submits via FormSubmit AJAX to anujkhanna1029@gmail.com.
        // To change the recipient email, update the URL in the fetch() call below.
        fetch('https://formsubmit.co/ajax/anujkhanna1029@gmail.com', {
            method:  'POST',
            body:    new FormData(form),
            headers: { 'Accept': 'application/json' }
        })
        .then(function ()  { handleFormSuccess(form, wrapId, successId, btn); })
        .catch(function () { handleFormSuccess(form, wrapId, successId, btn); });
    });
}

function handleFormSuccess(form, wrapId, successId, btn) {
    var wrap    = document.getElementById(wrapId);
    var success = document.getElementById(successId);
    if (wrap)    wrap.style.display    = 'none';
    if (success) success.style.display = 'block';

    showToast('Thank you! Our team will contact you within 2 business hours.');

    // Auto-reset after 7 seconds
    setTimeout(function () {
        if (form)    form.reset();
        if (wrap)    wrap.style.display    = 'block';
        if (success) success.style.display = 'none';
        if (btn)     { btn.disabled = false; btn.textContent = 'Submit Request'; }
        form.querySelectorAll('.field-error').forEach(function (el) { el.remove(); });
    }, 7000);
}

function showFieldError(field, message) {
    if (!field) return;
    field.style.borderColor = '#E24B4A';

    var existing = field.parentNode.querySelector('.field-error');
    if (existing) existing.remove();

    var err = document.createElement('span');
    err.className   = 'field-error';
    err.textContent = message;
    field.parentNode.appendChild(err);
    if (!document.querySelector('.field-error:first-of-type') || field === document.querySelector('[style*="E24B4A"]')) {
        field.focus();
    }
}

// =========================================================
// Toast Snackbar
// =========================================================
function showToast(message) {
    var toast = document.getElementById('toastSnackbar');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 5000);
}

// =========================================================
// Reset quote form (used when modal closes)
// =========================================================
function resetQuoteModal() {
    var form    = document.getElementById('quoteForm');
    var wrap    = document.getElementById('quoteFormWrap');
    var success = document.getElementById('quoteSuccess');
    var btn     = document.getElementById('submitBtn');

    if (form)    form.reset();
    if (wrap)    wrap.style.display    = 'block';
    if (success) success.style.display = 'none';
    if (btn)     { btn.disabled = false; btn.textContent = 'Submit Request'; }

    document.querySelectorAll('#quoteForm .field-error').forEach(function (el) { el.remove(); });
    document.querySelectorAll('#quoteForm input, #quoteForm select, #quoteForm textarea').forEach(function (el) {
        el.style.borderColor = '';
    });
}


// =========================================================
// Modal open / close / toggle
// =========================================================
function openContactModal() {
    var overlay = document.getElementById('contactOverlay');
    var panel   = document.getElementById('contactPanel');
    if (overlay) overlay.classList.add('active');
    if (panel)   {
        panel.classList.add('active');
        // Move focus to close button for accessibility
        var closeBtn = panel.querySelector('.close-modal');
        if (closeBtn) setTimeout(function () { closeBtn.focus(); }, 100);
    }
    if (window._waFloatBtn) window._waFloatBtn.classList.add('hidden');
    document.body.style.overflow = 'hidden';
}

// =========================================================
// Close Modal
// =========================================================
function closeContactModal() {
    var overlay = document.getElementById('contactOverlay');
    var panel   = document.getElementById('contactPanel');
    if (overlay) overlay.classList.remove('active');
    if (panel)   panel.classList.remove('active');
    resetQuoteModal();
    if (window._waFloatBtn) window._waFloatBtn.classList.remove('hidden');
    document.body.style.overflow = '';
}

function toggleQuoteForm() {
    var outer = document.getElementById('quoteFormOuter');
    if (outer) outer.classList.toggle('active');
}


// =========================================================
// Modal accessibility: Escape key close + focus trap
// =========================================================
function initModalAccessibility() {
    // Escape to close
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            var panel = document.getElementById('contactPanel');
            if (panel && panel.classList.contains('active')) {
                closeContactModal();
            }
        }
    });

    // Focus trap inside modal
    var panel = document.getElementById('contactPanel');
    if (!panel) return;

    panel.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab') return;
        var focusable = panel.querySelectorAll(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        var first = focusable[0];
        var last  = focusable[focusable.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
            if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
        }
    });
}


// =========================================================
// Set minimum date on all date inputs to today
// =========================================================
function initDateInputs() {
    var today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(function (input) {
        input.setAttribute('min', today);
    });
}


// =========================================================
// Map pin tooltips
// =========================================================
function initMapPins() {
    document.querySelectorAll('.map-pin').forEach(function (pin) {
        if (!pin.dataset.city) return;
        var tip = document.createElement('div');
        tip.className = 'map-tooltip';
        tip.innerHTML = '<strong>' + pin.dataset.city + '</strong><br>' + (pin.dataset.info || '');
        pin.appendChild(tip);
    });
}


// =========================================================
// Scroll Reveal with stagger (service cards, timeline, industry tiles)
// =========================================================
function initRevealObserver() {
    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var siblings = entry.target.parentElement.querySelectorAll('.reveal');
                var i = 0;
                siblings.forEach(function (sib) {
                    if (!sib.classList.contains('is-visible')) {
                        sib.style.transitionDelay = (i * 0.07) + 's';
                        i++;
                    }
                });
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(function (el) {
        revealObserver.observe(el);
    });
}


// =========================================================
// Back to Top Button (bottom-LEFT)
// =========================================================
function initScrollTopBtn() {
    var scrollTopBtn = document.getElementById('scrollTopBtn');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


// =========================================================
// Scroll Spy for Nav Active State
// =========================================================
function initScrollSpy() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('#navLinks a');
    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', function () {
        var current = '';
        sections.forEach(function (section) {
            if (window.scrollY >= (section.offsetTop - 160)) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(function (link) {
            link.classList.remove('active');
            var href = link.getAttribute('href') || '';
            if (current && href.includes(current)) link.classList.add('active');
        });
    }, { passive: true });
}


// =========================================================
// Scroll Progress Bar (if element exists)
// =========================================================
function initScrollProgress() {
    var scrollBar = document.getElementById('scrollBar');
    if (!scrollBar) return;
    window.addEventListener('scroll', function () {
        var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        var height    = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        scrollBar.style.width = ((winScroll / height) * 100) + '%';
    }, { passive: true });
}


// =========================================================
// Scroll Animations (legacy data-animate support)
// =========================================================
function initScrollAnimations() {
    var elements = document.querySelectorAll('[data-animate]');
    if (!elements.length) return;

    function checkElements() {
        var triggerBottom = window.innerHeight * 0.9;
        elements.forEach(function (element) {
            if (element.getBoundingClientRect().top < triggerBottom) {
                element.classList.add('animate-in');
            }
        });
    }
    setTimeout(checkElements, 100);
    window.addEventListener('scroll', checkElements, { passive: true });
}


// =========================================================
// WhatsApp Floating Button (injected, bottom-RIGHT)
// =========================================================
function initWaFloat() {
    setTimeout(function () {
        var wa = document.createElement('a');
        wa.href      = 'https://wa.me/918707812390';
        wa.target    = '_blank';
        wa.rel       = 'noopener noreferrer';
        wa.className = 'wa-float';
        wa.setAttribute('aria-label', 'Chat with MFL on WhatsApp');
        wa.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12a11.9 11.9 0 0 0 1.64 6.07L0 24l6.14-1.61A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.22-3.48-8.52zm-8.52 18.4a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98.99-3.65-.23-.37A9.87 9.87 0 0 1 2.1 12c0-5.46 4.44-9.9 9.9-9.9 2.65 0 5.13 1.03 7 2.9a9.86 9.86 0 0 1 2.9 7c0 5.46-4.44 9.88-9.9 9.88zm5.42-7.42c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.66-1.6-.91-2.19-.24-.57-.48-.5-.66-.5-.17 0-.37-.02-.57-.02s-.52.07-.8.37c-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.09 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35z"/></svg>';

        document.body.appendChild(wa);
        setTimeout(function () { wa.classList.add('visible'); }, 200);
        window._waFloatBtn = wa;
    }, 2000);
}


// =========================================================
// Legacy / compatibility stubs (kept to avoid console errors
// if any inline onclick still references old function names)
// =========================================================
function openCallbackModal()  { openContactModal(); }
function closeCallbackModal() { closeContactModal(); }
function toggleWaWidget()     {}
function toggleCities() {
    var list = document.getElementById('citiesList');
    var btn  = document.getElementById('toggleCitiesBtn');
    if (!list || !btn) return;
    if (list.style.maxHeight && list.style.maxHeight !== '0px') {
        list.style.maxHeight = '0px';
        btn.innerHTML = 'See All Cities <i class="fas fa-chevron-down"></i>';
    } else {
        list.style.maxHeight = list.scrollHeight + 'px';
        btn.innerHTML = 'Collapse List <i class="fas fa-chevron-up"></i>';
    }
}
