// ===== MFL Enhanced Script — All Phases =====

document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initStatCounters();
    initMapPins();
    initRevealObserver();
    initScrollTopBtn();
    initScrollSpy();
    initScrollProgress();
    initLiveActivity();
});


// =========================================================
// PHASE 4 — Navbar: transparent → navy+blur on scroll
// =========================================================
function initNavbar() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    function handleNavScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    }

    // Run immediately in case page is loaded already scrolled
    handleNavScroll();
    window.addEventListener('scroll', handleNavScroll, { passive: true });
}


// =========================================================
// PHASE 4 — Mobile hamburger menu
// =========================================================
function initMobileMenu() {
    var toggle   = document.getElementById('mobileToggle');
    var navLinks = document.getElementById('navLinks');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', function() {
        var isOpen = navLinks.classList.toggle('open');
        // Swap icon
        var icon = toggle.querySelector('i');
        if (icon) {
            icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        }
    });

    // Close when a link is clicked
    navLinks.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            navLinks.classList.remove('open');
            var icon = toggle.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        });
    });
}


// =========================================================
// Smooth Scroll
// =========================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            var target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}


// =========================================================
// PHASE 6 — Stat Counters
// Only "20+" counts up. 2001, Family, Pan India fade in only.
// =========================================================
function initStatCounters() {
    // --- Fade-in stats (2001, Family, Pan India) ---
    var fadeStats = document.querySelectorAll('.stat-fade');
    if (fadeStats.length === 0) return;

    var fadeObserver = new IntersectionObserver(function(entries, obs) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    fadeStats.forEach(function(el) {
        fadeObserver.observe(el);
    });

    // --- Count-up for "20+" routes ---
    var routeCounter = document.getElementById('routeCounter');
    var routePlus    = document.getElementById('routePlus');
    if (!routeCounter) return;

    var hasRun = false;

    var countObserver = new IntersectionObserver(function(entries, obs) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !hasRun) {
                hasRun = true;
                obs.unobserve(entry.target);

                var target    = 20;
                var duration  = 1500; // ms
                var startTime = null;

                function step(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var progress = Math.min((timestamp - startTime) / duration, 1);
                    // Ease-out cubic
                    var eased = 1 - Math.pow(1 - progress, 3);
                    var current = Math.floor(eased * target);
                    routeCounter.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        routeCounter.textContent = target;
                        // Show the "+" suffix
                        if (routePlus) {
                            routePlus.style.opacity = '1';
                        }
                    }
                }

                requestAnimationFrame(step);
            }
        });
    }, { threshold: 0.5 });

    countObserver.observe(routeCounter);
}


// =========================================================
// PHASE 10 — Quote Form: validation, success state, reset
// =========================================================
var quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Clear previous errors
        document.querySelectorAll('.field-error').forEach(function(el) { el.remove(); });
        document.querySelectorAll('#quoteForm input').forEach(function(el) {
            el.style.borderColor = '';
        });

        var name   = document.getElementById('clientName');
        var phone  = document.getElementById('clientPhone');
        var origin = document.getElementById('originCity');
        var dest   = document.getElementById('destCity');
        var valid  = true;

        if (!name || !name.value.trim()) {
            showFormError('clientName', 'Please enter your name');
            valid = false;
        }

        var indianMobile = /^[6-9][0-9]{9}$/;
        if (!phone || !indianMobile.test(phone.value.trim())) {
            showFormError('clientPhone', 'Enter a valid 10-digit Indian mobile number (starts with 6–9)');
            valid = false;
        }

        if (!origin || !origin.value.trim()) {
            showFormError('originCity', 'Please enter the origin city');
            valid = false;
        }

        if (!dest || !dest.value.trim()) {
            showFormError('destCity', 'Please enter the destination city');
            valid = false;
        }

        if (!valid) return;

        // Prevent double submission
        var btn = document.getElementById('submitBtn');
        if (btn) {
            btn.disabled    = true;
            btn.textContent = 'Sending\u2026';
        }

        // Submit form via FormSubmit AJAX endpoint directly to user's email
        fetch('https://formsubmit.co/ajax/anujkhanna1029@gmail.com', {
            method: 'POST',
            body: new FormData(quoteForm),
            headers: { 'Accept': 'application/json' }
        })
        .then(function() {
            var wrap    = document.getElementById('quoteFormWrap');
            var success = document.getElementById('quoteSuccess');
            if (wrap)    wrap.style.display    = 'none';
            if (success) success.style.display = 'block';
        })
        .catch(function() {
            // Fallback success state in case of connection errors
            var wrap    = document.getElementById('quoteFormWrap');
            var success = document.getElementById('quoteSuccess');
            if (wrap)    wrap.style.display    = 'none';
            if (success) success.style.display = 'block';
        });
    });
}

function showFormError(fieldId, message) {
    var field = document.getElementById(fieldId);
    if (!field) return;
    field.style.borderColor = '#E24B4A';

    // Remove existing error for this field
    var existingErr = field.nextElementSibling;
    if (existingErr && existingErr.classList.contains('field-error')) {
        existingErr.remove();
    }

    var err = document.createElement('span');
    err.className  = 'field-error';
    err.style.cssText = 'color:#E24B4A; font-size:12px; display:block; margin-top:4px; margin-bottom:8px;';
    err.textContent   = message;
    field.parentNode.insertBefore(err, field.nextSibling);
    field.focus();
}

function resetQuoteModal() {
    var form    = document.getElementById('quoteForm');
    var wrap    = document.getElementById('quoteFormWrap');
    var success = document.getElementById('quoteSuccess');
    var btn     = document.getElementById('submitBtn');
    var svc     = document.getElementById('serviceType');

    if (form)    form.reset();
    if (wrap)    wrap.style.display    = 'block';
    if (success) success.style.display = 'none';
    if (btn)     { btn.disabled = false; btn.textContent = 'Submit Request'; }
    if (svc)     svc.value = '';

    document.querySelectorAll('.field-error').forEach(function(el) { el.remove(); });
    document.querySelectorAll('#quoteForm input').forEach(function(el) {
        el.style.borderColor = '';
    });
}


// =========================================================
// Modal open/close
// =========================================================
function openContactModal() {
    var overlay = document.getElementById('contactOverlay');
    var panel   = document.getElementById('contactPanel');
    if (overlay) overlay.classList.add('active');
    if (panel)   panel.classList.add('active');

    // Phase 11 — Hide WhatsApp float when modal is open
    if (window._waFloatBtn) window._waFloatBtn.classList.add('hidden');
}

function closeContactModal() {
    var overlay = document.getElementById('contactOverlay');
    var panel   = document.getElementById('contactPanel');
    if (overlay) overlay.classList.remove('active');
    if (panel)   panel.classList.remove('active');

    // Reset the quote form
    resetQuoteModal();

    // Phase 11 — Show WhatsApp float again
    if (window._waFloatBtn) window._waFloatBtn.classList.remove('hidden');
}

function toggleQuoteForm() {
    var outer = document.getElementById('quoteFormOuter');
    if (outer) outer.classList.toggle('active');
}


// =========================================================
// PHASE 11 — WhatsApp Floating Button (injected dynamically)
// =========================================================
setTimeout(function() {
    var wa = document.createElement('a');
    wa.href   = 'https://wa.me/918707812390';
    wa.target = '_blank';
    wa.rel    = 'noopener noreferrer';
    wa.className = 'wa-float';
    wa.setAttribute('aria-label', 'Chat with MFL on WhatsApp');
    wa.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12a11.9 11.9 0 0 0 1.64 6.07L0 24l6.14-1.61A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.22-3.48-8.52zm-8.52 18.4a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98.99-3.65-.23-.37A9.87 9.87 0 0 1 2.1 12c0-5.46 4.44-9.9 9.9-9.9 2.65 0 5.13 1.03 7 2.9a9.86 9.86 0 0 1 2.9 7c0 5.46-4.44 9.88-9.9 9.88zm5.42-7.42c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.66-1.6-.91-2.19-.24-.57-.48-.5-.66-.5-.17 0-.37-.02-.57-.02s-.52.07-.8.37c-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.09 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35z"/></svg>';

    document.body.appendChild(wa);

    setTimeout(function() { wa.classList.add('visible'); }, 100);

    window._waFloatBtn = wa;
}, 2000);


// =========================================================
// PHASE 12 — Map pin tooltips
// =========================================================
function initMapPins() {
    document.querySelectorAll('.map-pin').forEach(function(pin) {
        var tip = document.createElement('div');
        tip.className = 'map-tooltip';
        tip.innerHTML = '<strong>' + pin.dataset.city + '</strong><br>' + pin.dataset.info;
        pin.appendChild(tip);
    });
}


// =========================================================
// PHASE 13 — Scroll Reveal with stagger
// =========================================================
function initRevealObserver() {
    var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var siblings = entry.target.parentElement.querySelectorAll('.reveal');
                var i = 0;
                siblings.forEach(function(sib) {
                    if (!sib.classList.contains('is-visible')) {
                        sib.style.transitionDelay = (i * 0.08) + 's';
                        i++;
                    }
                });
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(function(el) {
        revealObserver.observe(el);
    });
}


// =========================================================
// PHASE 14 — Back to Top Button
// =========================================================
function initScrollTopBtn() {
    var scrollTopBtn = document.getElementById('scrollTopBtn');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


// =========================================================
// Scroll Animations (data-animate attribute legacy)
// =========================================================
function initScrollAnimations() {
    var elements = document.querySelectorAll('[data-animate]');
    if (elements.length === 0) return;

    function checkElements() {
        var triggerBottom = window.innerHeight * 0.9;
        elements.forEach(function(element) {
            var elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.classList.add('animate-in');
            }
        });
    }

    setTimeout(checkElements, 100);
    window.addEventListener('scroll', checkElements, { passive: true });
}


// =========================================================
// Scroll Spy for Nav Links
// =========================================================
function initScrollSpy() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('#navLinks a');
    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', function() {
        var current = '';
        sections.forEach(function(section) {
            var sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (current && link.getAttribute('href') && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}


// =========================================================
// Top Scroll Progress Bar
// =========================================================
function initScrollProgress() {
    var scrollBar = document.getElementById('scrollBar');
    if (!scrollBar) return;

    window.addEventListener('scroll', function() {
        var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        var height    = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var scrolled  = (winScroll / height) * 100;
        scrollBar.style.width = scrolled + '%';
    }, { passive: true });
}


// =========================================================
// Live Activity Signal Rotation (legacy)
// =========================================================
function initLiveActivity() {
    var activity = document.getElementById('liveActivity');
    if (!activity) return;

    var messages = [
        '🚚 Shipment booked: Kanpur → Indore',
        '📦 Quote requested from Ahmedabad',
        '🚛 Truck dispatched: Indore',
        '📍 Transit: Mumbai Corridor',
        '⚡ New rate inquiry: Gwalior Steel trader'
    ];

    var index = 0;
    function showMessage() {
        var span = activity.querySelector('span');
        if (span) span.innerText = messages[index];
        activity.classList.add('visible');

        setTimeout(function() {
            activity.classList.remove('visible');
            index = (index + 1) % messages.length;
            setTimeout(showMessage, 6000);
        }, 3500);
    }

    setTimeout(showMessage, 3000);
}


// =========================================================
// Tilt Effects (if VanillaTilt library present)
// =========================================================
function initTiltEffects() {
    var cards = document.querySelectorAll('.tilt-card');
    if (cards.length > 0 && typeof VanillaTilt !== 'undefined') {
        if (window.innerWidth < 768) {
            VanillaTilt.init(cards, { max: 0 });
        } else {
            VanillaTilt.init(cards, { max: 5, speed: 400, glare: true, 'max-glare': 0.15 });
        }
    }
}


// =========================================================
// Callback Modal Logic (legacy — kept for compatibility)
// =========================================================
function openCallbackModal() {
    var modal = document.getElementById('callbackModal');
    if (modal) modal.classList.remove('hidden');
}

function closeCallbackModal() {
    var modal  = document.getElementById('callbackModal');
    var status = document.getElementById('cbStatus');
    if (modal)  modal.classList.add('hidden');
    if (status) status.style.display = 'none';
}

function submitCallback(e) {
    e.preventDefault();
    var btn    = document.getElementById('cbSubmitBtn');
    var status = document.getElementById('cbStatus');
    if (!btn || !status) return;

    var oText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Dispatching\u2026';
    btn.disabled  = true;

    setTimeout(function() {
        status.innerText      = 'Request received. We will call you precisely as requested.';
        status.style.display  = 'block';
        btn.innerHTML         = oText;
        btn.disabled          = false;
        var form = document.getElementById('callbackForm');
        if (form) form.reset();
    }, 1500);
}


// =========================================================
// WhatsApp widget toggle (legacy)
// =========================================================
function toggleWaWidget() {
    var widget = document.getElementById('waWidget');
    if (widget) widget.classList.toggle('open');
}


// =========================================================
// Toggle Cities list (legacy)
// =========================================================
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
