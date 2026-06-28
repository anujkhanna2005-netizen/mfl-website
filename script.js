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
    initFaqAccordion();
    initWaFloat(); // Bootstrapped for lazy-loading
    initEmailObfuscation();
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
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        if (!isOpen) closeServicesDropdown();
    });

    // Auto-close when any nav link (not dropdown toggle) is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('open');
            var icon = toggle.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Open navigation menu');
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
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.setAttribute('aria-label', 'Open navigation menu');
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
// Stat 1 "Since 2003"      → static, no animation
// Stat 2 "20+"             → count-up 0→20
// Stat 3 "6"               → count-up 0→6
// Stat 4 "FTL·PTL·Express" → static, no animation
// =========================================================
function initStatCounters() {
  var hasRun = false;
  var fallbackTimer = null;

  function animateCounter(el, target, duration) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = target + (el.dataset.suffix || '');
      return;
    }
    var start = 0;
    var step = target / (duration / 16);
    var timer = setInterval(function() {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(start) + (el.dataset.suffix || '');
    }, 16);
  }

  function runCounters() {
    if (hasRun) return;
    hasRun = true;
    if (fallbackTimer) clearTimeout(fallbackTimer);
    var counters = document.querySelectorAll('[data-count]');
    counters.forEach(function(el) {
      el.classList.add('is-visible');
      var target = parseInt(el.dataset.count, 10);
      animateCounter(el, target, 1500);
    });
  }

  // Fallback: run animation after 2 seconds if IntersectionObserver hasn't fired
  fallbackTimer = setTimeout(function() {
    runCounters();
  }, 2000);

  // Try IntersectionObserver first
  var statsSection = document.querySelector('.stats-bar, .stats-section, .stat-counter-section, .metrics-grid');
  if (statsSection && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          runCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });
    observer.observe(statsSection);
    // Fallback if already in viewport on load
    var rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      runCounters();
    }
  } else {
    // No observer support — run immediately
    runCounters();
  }
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
        setupProgressiveForm(modalForm);
        attachFormHandler(modalForm, 'submitBtn', 'quoteFormWrap', 'quoteSuccess');
    }
    if (contactForm) {
        attachFormHandler(contactForm, 'contactSubmitBtn', 'contactFormWrap', 'contactFormSuccess');
    }
}

function setupProgressiveForm(form) {
    var step1 = form.querySelector('#qFormStep1');
    var step2 = form.querySelector('#qFormStep2');
    var nextBtn = form.querySelector('#qFormNextBtn');
    var backBtn = form.querySelector('#qFormBackBtn');
    var indicator = form.querySelector('#qFormStepIndicator');

    if (!step1 || !step2 || !nextBtn || !backBtn || !indicator) return;

    nextBtn.addEventListener('click', function () {
        if (validateStep1(form)) {
            step1.style.display = 'none';
            step2.style.display = 'block';
            indicator.textContent = 'Step 2 of 2 — Shipment Details';
            indicator.setAttribute('aria-label', 'Form progress: Step 2 of 2');
            var wrap = document.getElementById('quoteFormWrap');
            if (wrap) wrap.scrollTop = 0;
        }
    });

    backBtn.addEventListener('click', function () {
        step2.style.display = 'none';
        step1.style.display = 'block';
        indicator.textContent = 'Step 1 of 2 — Contact Details';
        indicator.setAttribute('aria-label', 'Form progress: Step 1 of 2');
    });

    form.addEventListener('reset', function () {
        step2.style.display = 'none';
        step1.style.display = 'block';
        indicator.textContent = 'Step 1 of 2 — Contact Details';
        indicator.setAttribute('aria-label', 'Form progress: Step 1 of 2');
    });
}

function validateStep1(form) {
    form.querySelectorAll('.field-error').forEach(function (el) { el.remove(); });
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
        el.style.borderColor = '';
        el.removeAttribute('aria-describedby');
    });

    var valid = true;
    var phoneRegex = /^[6-9][0-9]{9}$/;

    var fullName  = form.querySelector('[name="full_name"]');
    var company   = form.querySelector('[name="company_name"]');
    var phone     = form.querySelector('[name="phone"]');
    var service   = form.querySelector('[name="required_service"]');
    var origin    = form.querySelector('[name="pickup_city"]');
    var dest      = form.querySelector('[name="delivery_city"]');

    if (!fullName || !fullName.value.trim())                         { showFieldError(fullName,  'Full name is required'); valid = false; }
    if (!company  || !company.value.trim())                          { showFieldError(company,   'Company name is required'); valid = false; }
    if (!phone    || !phoneRegex.test(phone.value.trim()))           { showFieldError(phone,     'Enter a valid 10-digit mobile number starting with 6–9'); valid = false; }
    if (!origin   || !origin.value.trim())                           { showFieldError(origin,    'Pickup city is required'); valid = false; }
    if (!dest     || !dest.value.trim())                             { showFieldError(dest,      'Delivery city is required'); valid = false; }
    if (!service  || !service.value)                                 { showFieldError(service,   'Please select a required service'); valid = false; }

    return valid;
}

function attachFormHandler(form, submitBtnId, wrapId, successId) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Clear previous errors
        form.querySelectorAll('.field-error').forEach(function (el) { el.remove(); });
        form.querySelectorAll('input, select, textarea').forEach(function (el) {
            el.style.borderColor = '';
            el.removeAttribute('aria-describedby');
        });

        var valid = true;
        var phoneRegex = /^[6-9][0-9]{9}$/;

        var fullName  = form.querySelector('[name="full_name"]');
        var company   = form.querySelector('[name="company_name"]');
        var phone     = form.querySelector('[name="phone"]');
        var service   = form.querySelector('[name="required_service"]');
        var origin    = form.querySelector('[name="pickup_city"]');
        var dest      = form.querySelector('[name="delivery_city"]');
        var weight    = form.querySelector('[name="estimated_weight"]');
        var cargo     = form.querySelector('[name="cargo_type"]');
        var volume    = form.querySelector('[name="monthly_volume"]');
        var date      = form.querySelector('[name="pickup_date"]');

        if (!fullName || !fullName.value.trim())                         { showFieldError(fullName,  'Full name is required'); valid = false; }
        if (!company  || !company.value.trim())                          { showFieldError(company,   'Company name is required'); valid = false; }
        if (!phone    || !phoneRegex.test(phone.value.trim()))           { showFieldError(phone,     'Enter a valid 10-digit mobile number starting with 6–9'); valid = false; }
        if (!origin   || !origin.value.trim())                           { showFieldError(origin,    'Pickup city is required'); valid = false; }
        if (!dest     || !dest.value.trim())                             { showFieldError(dest,      'Delivery city is required'); valid = false; }
        if (!service  || !service.value)                                 { showFieldError(service,   'Please select a required service'); valid = false; }
        if (!cargo    || !cargo.value)                                   { showFieldError(cargo,     'Please select a cargo type'); valid = false; }
        if (!weight   || !weight.value)                                  { showFieldError(weight,    'Please select an estimated weight'); valid = false; }
        if (date      && !date.value)                                    { showFieldError(date,      'Please select a pickup date'); valid = false; }
        if (!volume   || !volume.value)                                  { showFieldError(volume,    'Please select an approximate monthly shipment volume'); valid = false; }

        if (!valid) {
            var firstInvalid = form.querySelector('.field-error');
            if (firstInvalid) {
                var isStep1 = firstInvalid.parentNode.closest('#qFormStep1');
                if (isStep1) {
                    var s1 = form.querySelector('#qFormStep1');
                    var s2 = form.querySelector('#qFormStep2');
                    var ind = form.querySelector('#qFormStepIndicator');
                    if (s1) s1.style.display = 'block';
                    if (s2) s2.style.display = 'none';
                    if (ind) {
                        ind.textContent = 'Step 1 of 2 — Contact Details';
                        ind.setAttribute('aria-label', 'Form progress: Step 1 of 2');
                    }
                }
            }
            return;
        }

        // Structured payload object for future backend/CRM integration
        var payload = {
            fullName: fullName.value.trim(),
            companyName: company.value.trim(),
            phone: phone.value.trim(),
            email: form.querySelector('[name="email"]') ? form.querySelector('[name="email"]').value.trim() : '',
            requiredService: service.value,
            pickupCity: origin.value.trim(),
            deliveryCity: dest.value.trim(),
            estimatedWeight: weight.value,
            cargoType: cargo.value,
            monthlyVolume: volume.value,
            pickupDate: date ? date.value : '',
            additionalNotes: form.querySelector('[name="additional_notes"]') ? form.querySelector('[name="additional_notes"]').value.trim() : ''
        };
        console.log("MFL Enquiry Submitted Payload:", payload);

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

    var errorId = field.id + '-error';
    var err = document.createElement('span');
    err.className   = 'field-error';
    err.id          = errorId;
    err.setAttribute('role', 'alert');
    err.textContent = message;
    field.parentNode.appendChild(err);
    field.setAttribute('aria-describedby', errorId);

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
        el.removeAttribute('aria-describedby');
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


function initMapPins() {
    document.querySelectorAll('.map-pin').forEach(function (pin) {
        if (!pin.dataset.city) return;
        var tip = document.createElement('div');
        tip.className = 'map-tooltip';
        tip.innerHTML = '<strong>' + pin.dataset.city + '</strong><br>' + (pin.dataset.info || '');
        pin.appendChild(tip);

        // Toggle active class on click / touch
        pin.addEventListener('click', function (e) {
            e.stopPropagation();
            document.querySelectorAll('.map-pin').forEach(function (p) {
                if (p !== pin) p.classList.remove('is-active');
            });
            pin.classList.toggle('is-active');
        });

        // Keydown keyboard handler
        pin.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                pin.click();
            }
        });
    });

    // Dismiss tooltip on clicking elsewhere
    document.addEventListener('click', function () {
        document.querySelectorAll('.map-pin').forEach(function (pin) {
            pin.classList.remove('is-active');
        });
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
// WhatsApp Assistant Initialization (Bootstrapped / Lazy-Loaded)
// =========================================================
function initWaFloat() {
    var trigger = document.getElementById('mfl-wa-trigger');
    if (!trigger) return;
    
    // Bind click handler for lazy loading
    trigger.addEventListener('click', function(e) {
        e.preventDefault(); // Intercept progressive enhancement link navigation
        
        if (!MflLogisticsAssistant.isInitialized) {
            MflLogisticsAssistant.init();
        }
        MflLogisticsAssistant.UI.open();
    });
    
    // Delayed entrance animation for the trigger
    var entryDelay = MflLogisticsAssistant.CONFIG.CONSTANTS.TIMINGS.ENTRANCE_DELAY || 3000;
    setTimeout(function() {
        if (trigger) {
            trigger.classList.add('mfl-wa-entrance');
            MflLogisticsAssistant.Analytics.trackEvent({
                event: 'wa_trigger_entrance',
                timestamp: Date.now(),
                source: 'system'
            });
            MflLogisticsAssistant.Utilities.schedulePulses(trigger);
        }
    }, entryDelay);
}

var MflLogisticsAssistant = {
    isInitialized: false,
    IS_OPEN: false,
    isRedirecting: false,
    statusTimeout: null,
    pulseTimer1: null,
    pulseTimer2: null,
    pulseCancelTimer: null,
    quoteData: null,
    cache: {},
    observer: null,

    CONFIG: {
        whatsappNumber: "918707812390",
        businessHours: "Mon–Sat | 9 AM–7 PM",
        emergencyNumber: "919302115585",
        analyticsEnabled: true,
        freightTypes: ["FTL", "PTL", "Express"],
        cargoTypes: [
            "Industrial Machinery",
            "Construction Material",
            "Steel",
            "Cement",
            "Textiles",
            "FMCG",
            "Chemicals (Non Hazardous)",
            "Electronics",
            "Consumer Goods",
            "Other"
        ],
        weightRanges: [
            "Below 1 Ton",
            "1–5 Tons",
            "5–10 Tons",
            "10–20 Tons",
            "20+ Tons"
        ],
        cities: [
            "Indore",
            "Kanpur",
            "Mumbai",
            "Delhi (NCR)",
            "Ahmedabad",
            "Pune",
            "Jaipur",
            "Lucknow",
            "Agra",
            "Nagpur",
            "Surat",
            "Bhopal",
            "Vadodara",
            "Kolkata",
            "Hyderabad",
            "Chennai",
            "Other"
        ],
        locations: [
            {
                name: "INDORE HQ (Head Office)",
                address: "456 Scheme No. 78, Indore, MP – 452010",
                hours: "Mon–Sat | 9 AM–7 PM",
                phone: "+919302115585",
                mapsLink: "https://maps.google.com/?q=Mamta+Forwarding+Logistics+Scheme+78+Indore",
                waTrigger: "Indore"
            },
            {
                name: "KANPUR BRANCH",
                address: "123 Transport Nagar, Kanpur, UP – 208023",
                hours: "Mon–Sat | 9 AM–7 PM",
                phone: "+918707812390",
                mapsLink: "https://maps.google.com/?q=Transport+Nagar+Kanpur",
                waTrigger: "Kanpur"
            }
        ],
        templates: {
            quote: "Hello Mamta Forwarding Logistics,\n\n" +
                   "I would like to request a freight quotation.\n\n" +
                   "━━━━━━━━━━━━━━\n" +
                   "Pickup City:\n{{pickup}}\n\n" +
                   "Delivery City:\n{{delivery}}\n\n" +
                   "Freight Type:\n{{freightType}}\n\n" +
                   "Cargo:\n{{cargoType}}\n\n" +
                   "Approx Weight:\n{{weight}}\n" +
                   "━━━━━━━━━━━━━━\n\n" +
                   "Please connect me with a coordinator.",
            locations: "Hello Mamta Forwarding Logistics,\n\n" +
                       "I am requesting support for the {{hub}} office hub.\n\n" +
                       "Please connect me with a representative.",
            generic: "Hello Mamta Forwarding Logistics,\n\n" +
                     "I would like to speak with the operations team regarding logistics support."
        },
        CONSTANTS: {
            TIMINGS: {
                STATUS_CHECK_INTERVAL: 60000,
                PULSE_FIRST_DELAY: 9000,
                PULSE_SECOND_DELAY: 18000,
                PULSE_CANCEL_TIMEOUT: 120000,
                PULSE_DURATION: 1800,
                TRANSITION_DURATION: 400,
                REDIRECT_COOLDOWN: 2000,
                MODAL_CLOSE_DELAY: 500,
                ENTRANCE_DELAY: 3000
            },
            COLORS: {
                SUCCESS_GREEN: '#25D366',
                OFFLINE_RED: '#ef4444',
                GOLD: '#c8902a',
                DARK_EMERALD: '#0b261f'
            },
            BREAKPOINTS: {
                MOBILE: 767,
                TABLET: 991
            }
        }
    },

    // Hook point for future integration
    beforeSend: function(payload) {
        console.log("[MFL CRM Hook] beforeSend triggered with payload:", payload);
    },

    init: function() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        this.cacheDOM();
        this.Forms.populateDropdowns();
        this.WhatsApp.renderLocations();
        
        this.UI.bindEvents();
        this.Forms.bindEvents();
        this.Accessibility.bindEvents();
        this.Utilities.initVisibility();
        this.Utilities.initNetworkStatus();
        this.Utilities.scheduleStatusCheck();
        this.Utilities.setupMutationObserver();

        // Initial setup for accessibility
        if (this.cache.panel) {
            this.cache.panel.inert = true;
        }

        // Check session drafts
        var draft = sessionStorage.getItem('mfl-last-quote');
        if (draft) {
            this.Forms.showResumeBanner(JSON.parse(draft));
        } else {
            this.Views.showView('main');
        }

        // Set trigger expanded
        if (this.cache.trigger) {
            this.cache.trigger.setAttribute('aria-expanded', 'false');
        }
    },

    cacheDOM: function() {
        this.cache.container = document.getElementById('mfl-wa-assistant');
        this.cache.trigger = document.getElementById('mfl-wa-trigger');
        this.cache.panel = document.getElementById('mfl-wa-panel');
        this.cache.overlay = document.getElementById('mfl-wa-overlay');
        this.cache.closeBtn = document.getElementById('mfl-wa-close');
        this.cache.footer = document.querySelector('.mfl-wa-footer');
        this.cache.offlineAlerts = document.querySelectorAll('#mfl-wa-offline-alert');
        
        this.cache.views = {
            main: document.getElementById('mfl-wa-view-main'),
            quoteForm: document.getElementById('mfl-wa-view-quote-form'),
            confirm: document.getElementById('mfl-wa-view-confirm'),
            locations: document.getElementById('mfl-wa-view-locations')
        };
        
        this.cache.inputs = {
            pickup: document.getElementById('wa-q-pickup'),
            delivery: document.getElementById('wa-q-delivery'),
            freightType: document.getElementById('wa-q-freight-type'),
            cargo: document.getElementById('wa-q-cargo'),
            weight: document.getElementById('wa-q-weight'),
            form: document.getElementById('mfl-wa-quick-quote-form'),
            confirmBtn: document.getElementById('mfl-wa-confirm-submit-btn')
        };
    },

    UI: {
        bindEvents: function() {
            var self = MflLogisticsAssistant;
            
            if (self.cache.closeBtn) {
                self.cache.closeBtn.addEventListener('click', self.UI.closeBound);
            }
            
            if (self.cache.overlay) {
                self.cache.overlay.addEventListener('click', self.UI.closeBound);
            }
            
            // Action cards routing
            var cards = document.querySelectorAll('.mfl-wa-card');
            cards.forEach(function(card) {
                card.addEventListener('click', self.UI.cardClickBound);
            });
            
            // Back navigation buttons
            var backBtns = document.querySelectorAll('.mfl-wa-back-btn');
            backBtns.forEach(function(btn) {
                btn.addEventListener('click', self.UI.backClickBound);
            });
            
            // Dynamic scroll shadow hooks
            var scrollables = document.querySelectorAll('.mfl-wa-grid, .mfl-wa-form, .mfl-wa-view-body, .mfl-wa-locations-list');
            scrollables.forEach(function(el) {
                var view = el.closest('.mfl-wa-view');
                if (!view) return;
                
                el.addEventListener('scroll', function() {
                    self.UI.updateScrollShadows(view);
                });
            });
        },

        closeBound: function() { MflLogisticsAssistant.UI.close(); },
        
        cardClickBound: function(e) {
            var card = e.currentTarget;
            var action = card.getAttribute('data-action');
            MflLogisticsAssistant.UI.handleCardClick(action);
        },

        backClickBound: function(e) {
            var btn = e.currentTarget;
            var target = btn.getAttribute('data-back-to');
            MflLogisticsAssistant.Views.showView(target);
        },

        open: function() {
            var self = MflLogisticsAssistant;
            if (self.IS_OPEN) return;
            self.IS_OPEN = true;
            
            if (self.cache.trigger) {
                self.cache.trigger.setAttribute('aria-expanded', 'true');
            }
            
            if (self.cache.overlay) {
                self.cache.overlay.classList.add('mfl-wa-active');
            }
            
            if (self.cache.panel) {
                self.cache.panel.classList.add('mfl-wa-active');
                self.cache.panel.inert = false;
                document.body.style.overflow = 'hidden';
            }
            
            self.Analytics.trackEvent({
                event: 'wa_open',
                timestamp: Date.now(),
                source: 'floating_assistant'
            });
            
            // Update network status
            self.Utilities.updateNetworkStatus();

            // Check session drafts
            var draft = sessionStorage.getItem('mfl-last-quote');
            if (draft) {
                self.Forms.showResumeBanner(JSON.parse(draft));
            } else {
                self.Views.showView('main');
            }
            
            if (self.cache.closeBtn) {
                setTimeout(function() {
                    self.cache.closeBtn.focus();
                }, 100);
            }
        },

        close: function() {
            var self = MflLogisticsAssistant;
            if (!self.IS_OPEN) return;
            self.IS_OPEN = false;
            
            if (self.cache.trigger) {
                self.cache.trigger.setAttribute('aria-expanded', 'false');
            }
            
            if (self.cache.panel) {
                self.cache.panel.classList.remove('mfl-wa-active');
                self.cache.panel.inert = true;
                document.body.style.overflow = '';
            }
            
            if (self.cache.overlay) {
                self.cache.overlay.classList.remove('mfl-wa-active');
            }
            
            self.Analytics.trackEvent({
                event: 'wa_close',
                timestamp: Date.now(),
                source: 'modal_close'
            });
            
            if (self.cache.trigger) {
                self.cache.trigger.focus();
            }
        },

        handleCardClick: function(action) {
            var self = MflLogisticsAssistant;
            if (action === 'quick-quote') {
                self.Views.showView('quote-form');
            } else if (action === 'locations') {
                self.Views.showView('locations');
            } else {
                self.Analytics.trackEvent({
                    event: 'wa_coord_direct',
                    timestamp: Date.now(),
                    source: 'main_view_cards',
                    metadata: { type: action }
                });
                
                var payload = { type: action, source: 'main_view_cards' };
                self.beforeSend(payload);

                var text = self.WhatsApp.generateMessage('generic', null);
                self.WhatsApp.openWhatsApp(text, function() {
                    self.UI.close();
                });
            }
        },

        updateScrollShadows: function(view) {
            if (!view) return;
            
            var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) return;

            var el = view.querySelector('.mfl-wa-grid, .mfl-wa-form, .mfl-wa-view-body, .mfl-wa-locations-list');
            if (!el) return;
            
            var header = view.querySelector('.mfl-wa-header, .mfl-wa-view-header-wrap');
            var footer = MflLogisticsAssistant.cache.footer;
            
            if (header) {
                if (el.scrollTop > 5) {
                    header.classList.add('mfl-wa-scrolled-top');
                } else {
                    header.classList.remove('mfl-wa-scrolled-top');
                }
            }
            
            if (footer) {
                var remaining = el.scrollHeight - (el.scrollTop + el.clientHeight);
                if (remaining > 5) {
                    footer.classList.add('mfl-wa-scrolled-bottom');
                } else {
                    footer.classList.remove('mfl-wa-scrolled-bottom');
                }
            }
        }
    },

    Views: {
        getLevel: function(id) {
            if (id === 'mfl-wa-view-main') return 1;
            if (id === 'mfl-wa-view-quote-form' || id === 'mfl-wa-view-locations') return 2;
            if (id === 'mfl-wa-view-confirm') return 3;
            return 1;
        },

        showView: function(viewId) {
            var self = MflLogisticsAssistant;
            var currentActive = document.querySelector('.mfl-wa-view.active');
            
            var targetView = null;
            if (viewId === 'main') {
                targetView = self.cache.views.main;
            } else if (viewId === 'quote-form') {
                targetView = self.cache.views.quoteForm;
                self.Analytics.trackEvent({ event: 'wa_quote_start', timestamp: Date.now(), source: 'quick_quote_card' });
            } else if (viewId === 'confirm') {
                targetView = self.cache.views.confirm;
                self.Analytics.trackEvent({ event: 'wa_quote_review', timestamp: Date.now(), source: 'quote_form_next' });
            } else if (viewId === 'locations') {
                targetView = self.cache.views.locations;
                self.Analytics.trackEvent({ event: 'wa_locations', timestamp: Date.now(), source: 'locations_card' });
            }
            
            if (!targetView) return;
            
            var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (currentActive && targetView !== currentActive) {
                if (prefersReducedMotion) {
                    currentActive.classList.remove('active');
                    targetView.classList.add('active');
                } else {
                    var currentLevel = this.getLevel(currentActive.id);
                    var targetLevel = this.getLevel(targetView.id);
                    var isForward = targetLevel >= currentLevel;
                    
                    var allViews = document.querySelectorAll('.mfl-wa-view');
                    allViews.forEach(function(v) {
                        v.classList.remove('slide-left-out', 'slide-right-out');
                    });
                    
                    if (isForward) {
                        currentActive.classList.remove('active');
                        currentActive.classList.add('slide-left-out');
                        
                        targetView.style.transition = 'none';
                        targetView.style.transform = 'translateX(30px)';
                        targetView.style.opacity = '0';
                        targetView.style.visibility = 'hidden';
                        targetView.offsetHeight;
                        
                        targetView.style.transition = '';
                        targetView.classList.add('active');
                        targetView.style.transform = '';
                        targetView.style.opacity = '';
                        targetView.style.visibility = '';
                    } else {
                        currentActive.classList.remove('active');
                        currentActive.classList.add('slide-right-out');
                        
                        targetView.style.transition = 'none';
                        targetView.style.transform = 'translateX(-30px)';
                        targetView.style.opacity = '0';
                        targetView.style.visibility = 'hidden';
                        targetView.offsetHeight;
                        
                        targetView.style.transition = '';
                        targetView.classList.add('active');
                        targetView.style.transform = '';
                        targetView.style.opacity = '';
                        targetView.style.visibility = '';
                    }
                }
            } else {
                targetView.classList.add('active');
            }
            
            var allViews = document.querySelectorAll('.mfl-wa-view');
            allViews.forEach(function(v) {
                if (v === targetView) {
                    v.inert = false;
                } else {
                    v.inert = true;
                }
            });
            
            self.UI.updateScrollShadows(targetView);
            
            if (viewId === 'quote-form') {
                if (self.cache.inputs.pickup) {
                    setTimeout(function() {
                        self.cache.inputs.pickup.focus();
                    }, 150);
                }
            } else {
                var focusables = targetView.querySelectorAll('button, input, select, a');
                if (focusables.length > 0) {
                    setTimeout(function() {
                        focusables[0].focus();
                    }, 150);
                }
            }
        }
    },

    Forms: {
        bindEvents: function() {
            var self = MflLogisticsAssistant;
            
            if (self.cache.inputs.form) {
                self.cache.inputs.form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    self.Forms.handleFormSubmit();
                });
            }
            
            var inputs = [
                self.cache.inputs.pickup, 
                self.cache.inputs.delivery, 
                self.cache.inputs.freightType, 
                self.cache.inputs.cargo, 
                self.cache.inputs.weight
            ];
            
            inputs.forEach(function(input) {
                if (!input) return;
                
                input.addEventListener('change', function() {
                    self.Forms.saveDraft();
                    if (input.tagName === 'SELECT') {
                        self.Forms.updateSelectColor(input);
                    }
                });
                
                input.addEventListener('input', function() {
                    self.Forms.saveDraft();
                });
            });
            
            document.querySelectorAll('.form-group select').forEach(function(sel) {
                sel.addEventListener('change', function() {
                    if (sel.value === "") {
                        sel.style.color = '';
                    } else {
                        sel.style.color = '#0f1c2e';
                    }
                });
            });

            if (self.cache.inputs.confirmBtn) {
                self.cache.inputs.confirmBtn.addEventListener('click', function(e) {
                    if (!navigator.onLine) {
                        e.preventDefault();
                        if (typeof showToast === 'function') {
                            showToast('⚠ Internet connection unavailable. WhatsApp cannot be opened.');
                        }
                        return;
                    }
                    
                    self.WhatsApp.executeRedirect(e);
                });
            }
        },

        updateSelectColor: function(select) {
            if (select.value === "") {
                select.classList.add('placeholder-selected');
                select.style.color = 'rgba(255, 255, 255, 0.4)';
            } else {
                select.classList.remove('placeholder-selected');
                select.style.color = '#ffffff';
            }
        },

        populateDropdowns: function() {
            var self = MflLogisticsAssistant;
            
            var pk = self.cache.inputs.pickup;
            if (pk) {
                pk.innerHTML = '<option value="" disabled selected>Select Pickup City</option>';
                self.CONFIG.cities.forEach(function(city) {
                    var opt = document.createElement('option');
                    opt.value = city;
                    opt.textContent = city;
                    pk.appendChild(opt);
                });
                self.Forms.updateSelectColor(pk);
            }
            
            var dl = self.cache.inputs.delivery;
            if (dl) {
                dl.innerHTML = '<option value="" disabled selected>Select Delivery City</option>';
                self.CONFIG.cities.forEach(function(city) {
                    var opt = document.createElement('option');
                    opt.value = city;
                    opt.textContent = city;
                    dl.appendChild(opt);
                });
                self.Forms.updateSelectColor(dl);
            }
            
            var ft = self.cache.inputs.freightType;
            if (ft) {
                ft.innerHTML = '<option value="" disabled selected>Select Freight Type</option>';
                self.CONFIG.freightTypes.forEach(function(type) {
                    var opt = document.createElement('option');
                    opt.value = type;
                    opt.textContent = type === 'Express' ? 'Express Cargo' : (type === 'FTL' ? 'Full Truck Load (FTL)' : 'Part Truck Load (PTL)');
                    ft.appendChild(opt);
                });
                self.Forms.updateSelectColor(ft);
            }
            
            var ct = self.cache.inputs.cargo;
            if (ct) {
                ct.innerHTML = '<option value="" disabled selected>Select Cargo Type</option>';
                self.CONFIG.cargoTypes.forEach(function(type) {
                    var opt = document.createElement('option');
                    opt.value = type;
                    opt.textContent = type;
                    ct.appendChild(opt);
                });
                self.Forms.updateSelectColor(ct);
            }
            
            var wt = self.cache.inputs.weight;
            if (wt) {
                wt.innerHTML = '<option value="" disabled selected>Select Weight Range</option>';
                self.CONFIG.weightRanges.forEach(function(range) {
                    var opt = document.createElement('option');
                    opt.value = range;
                    opt.textContent = range;
                    wt.appendChild(opt);
                });
                self.Forms.updateSelectColor(wt);
            }
        },

        handleFormSubmit: function() {
            var self = MflLogisticsAssistant;
            
            var data = {
                pickup: self.cache.inputs.pickup.value.trim(),
                delivery: self.cache.inputs.delivery.value.trim(),
                freightType: self.cache.inputs.freightType.value,
                cargoType: self.cache.inputs.cargo.value,
                weight: self.cache.inputs.weight.value
            };
            
            if (!data.pickup || !data.delivery || !data.freightType || !data.cargoType || !data.weight) {
                if (typeof showToast === 'function') {
                    showToast('Please fill out all required fields.');
                }
                return;
            }
            
            self.quoteData = data;
            
            var ftDisplay = data.freightType === 'Express' ? 'Express Cargo' : (data.freightType === 'FTL' ? 'Full Truck Load (FTL)' : 'Part Truck Load (PTL)');
            document.getElementById('mfl-wa-confirm-pickup').textContent = data.pickup;
            document.getElementById('mfl-wa-confirm-delivery').textContent = data.delivery;
            document.getElementById('mfl-wa-confirm-freight-type').textContent = ftDisplay;
            document.getElementById('mfl-wa-confirm-cargo').textContent = data.cargoType;
            document.getElementById('mfl-wa-confirm-weight').textContent = data.weight;
            
            var text = self.WhatsApp.generateMessage('quote', data);
            var url = "https://wa.me/" + self.CONFIG.whatsappNumber + "?text=" + encodeURIComponent(text);
            
            if (self.cache.inputs.confirmBtn) {
                self.cache.inputs.confirmBtn.setAttribute('href', url);
            }
            
            self.Views.showView('confirm');
        },

        saveDraft: function() {
            var self = MflLogisticsAssistant;
            if (!self.cache.inputs.pickup) return;
            
            var draft = {
                pickup: self.cache.inputs.pickup.value,
                delivery: self.cache.inputs.delivery.value,
                freightType: self.cache.inputs.freightType.value,
                cargoType: self.cache.inputs.cargo.value,
                weight: self.cache.inputs.weight.value
            };
            
            if (draft.pickup || draft.delivery || draft.freightType || draft.cargoType || draft.weight) {
                sessionStorage.setItem('mfl-last-quote', JSON.stringify(draft));
            } else {
                sessionStorage.removeItem('mfl-last-quote');
            }
        },

        showResumeBanner: function(draft) {
            var self = MflLogisticsAssistant;
            var viewMain = self.cache.views.main;
            if (!viewMain) return;
            
            var existing = viewMain.querySelector('.mfl-wa-resume-banner');
            if (existing) existing.remove();
            
            var banner = document.createElement('div');
            banner.className = 'mfl-wa-resume-banner';
            banner.innerHTML = '<p>Continue your previous enquiry?</p>' +
                               '<div class="mfl-wa-resume-actions">' +
                               '  <button type="button" class="mfl-wa-resume-btn resume">Resume</button>' +
                               '  <button type="button" class="mfl-wa-resume-btn new">Start New</button>' +
                               '</div>';
            
            var grid = viewMain.querySelector('.mfl-wa-grid');
            if (grid) {
                viewMain.insertBefore(banner, grid);
                
                banner.querySelector('.resume').addEventListener('click', function() {
                    self.Forms.applyDraft(draft);
                    banner.remove();
                    self.Views.showView('quote-form');
                });
                
                banner.querySelector('.new').addEventListener('click', function() {
                    self.Forms.clearForm();
                    banner.remove();
                    self.Views.showView('main');
                });
            }
        },

        applyDraft: function(draft) {
            var self = MflLogisticsAssistant;
            if (draft.pickup && self.cache.inputs.pickup) {
                self.cache.inputs.pickup.value = draft.pickup;
                self.Forms.updateSelectColor(self.cache.inputs.pickup);
            }
            if (draft.delivery && self.cache.inputs.delivery) {
                self.cache.inputs.delivery.value = draft.delivery;
                self.Forms.updateSelectColor(self.cache.inputs.delivery);
            }
            if (draft.freightType && self.cache.inputs.freightType) {
                self.cache.inputs.freightType.value = draft.freightType;
                self.Forms.updateSelectColor(self.cache.inputs.freightType);
            }
            if (draft.cargoType && self.cache.inputs.cargo) {
                self.cache.inputs.cargo.value = draft.cargoType;
                self.Forms.updateSelectColor(self.cache.inputs.cargo);
            }
            if (draft.weight && self.cache.inputs.weight) {
                self.cache.inputs.weight.value = draft.weight;
                self.Forms.updateSelectColor(self.cache.inputs.weight);
            }
        },

        clearForm: function() {
            var self = MflLogisticsAssistant;
            if (self.cache.inputs.form) {
                self.cache.inputs.form.reset();
            }
            
            if (self.cache.inputs.pickup) self.Forms.updateSelectColor(self.cache.inputs.pickup);
            if (self.cache.inputs.delivery) self.Forms.updateSelectColor(self.cache.inputs.delivery);
            if (self.cache.inputs.freightType) self.Forms.updateSelectColor(self.cache.inputs.freightType);
            if (self.cache.inputs.cargo) self.Forms.updateSelectColor(self.cache.inputs.cargo);
            if (self.cache.inputs.weight) self.Forms.updateSelectColor(self.cache.inputs.weight);
            
            sessionStorage.removeItem('mfl-last-quote');
            self.quoteData = null;
        }
    },

    WhatsApp: {
        renderLocations: function() {
            var self = MflLogisticsAssistant;
            var container = document.getElementById('mfl-wa-locations-list');
            if (!container) return;
            
            var html = "";
            self.CONFIG.locations.forEach(function(loc) {
                html += '<div class="mfl-wa-location-card">' +
                        '  <h5>' + loc.name + '</h5>' +
                        '  <p class="mfl-wa-loc-address">' + loc.address + '</p>' +
                        '  <p class="mfl-wa-loc-hours"><i class="far fa-clock"></i> ' + loc.hours + '</p>' +
                        '  <div class="mfl-wa-location-actions">' +
                        '    <a href="tel:' + loc.phone.replace(/\s+/g, '') + '" class="mfl-wa-loc-btn call-btn"><i class="fas fa-phone-alt"></i> Call</a>' +
                        '    <a href="' + loc.mapsLink + '" target="_blank" rel="noopener noreferrer" class="mfl-wa-loc-btn maps-btn"><i class="fas fa-directions"></i> Directions</a>' +
                        '    <button type="button" class="mfl-wa-loc-btn wa-btn" data-loc-wa="' + loc.waTrigger + '"><i class="fab fa-whatsapp"></i> WhatsApp</button>' +
                        '  </div>' +
                        '</div>';
            });
            
            container.innerHTML = html;
            
            var btns = container.querySelectorAll('[data-loc-wa]');
            btns.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var hub = btn.getAttribute('data-loc-wa');
                    self.WhatsApp.sendLocation(hub);
                });
            });
        },

        executeRedirect: function(e) {
            var self = MflLogisticsAssistant;
            if (!self.quoteData) return;
            
            var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            self.beforeSend({
                type: 'freight_quote',
                data: self.quoteData
            });

            self.Analytics.trackEvent({
                event: 'wa_quote_send',
                timestamp: Date.now(),
                source: 'confirm_screen_submit',
                metadata: self.quoteData
            });

            if (prefersReducedMotion) {
                sessionStorage.removeItem('mfl-last-quote');
                self.Forms.clearForm();
                self.UI.close();
                self.Views.showView('main');
                return;
            }

            e.preventDefault();

            var confirmBtn = self.cache.inputs.confirmBtn;
            var loadingSpan = confirmBtn ? confirmBtn.querySelector('.mfl-wa-btn-loading') : null;
            var textSpan = confirmBtn ? confirmBtn.querySelector('.mfl-wa-btn-text') : null;
            
            if (confirmBtn && loadingSpan && textSpan) {
                confirmBtn.style.pointerEvents = 'none';
                textSpan.style.display = 'none';
                loadingSpan.style.display = 'inline-block';
                loadingSpan.innerHTML = '<i class="fas fa-check"></i> ✓ Redirecting...';
                confirmBtn.style.background = self.CONFIG.CONSTANTS.COLORS.SUCCESS_GREEN;
                confirmBtn.style.color = '#ffffff';
            }

            var url = confirmBtn ? confirmBtn.getAttribute('href') : '';
            if (url) {
                try {
                    var win = window.open(url, '_blank');
                    if (!win) {
                        throw new Error('Popup blocked');
                    }
                    win.focus();
                } catch (err) {
                    console.error("WhatsApp redirect failed:", err);
                    if (typeof showToast === 'function') {
                        showToast('⚠ Unable to open WhatsApp. Please call us directly.');
                    }
                }
            }

            var closeDelay = self.CONFIG.CONSTANTS.TIMINGS.MODAL_CLOSE_DELAY || 500;
            setTimeout(function() {
                if (confirmBtn) {
                    confirmBtn.style.pointerEvents = '';
                    confirmBtn.style.background = '';
                    confirmBtn.style.color = '';
                    if (textSpan) textSpan.style.display = 'inline';
                    if (loadingSpan) {
                        loadingSpan.style.display = 'none';
                        loadingSpan.innerHTML = '';
                    }
                }
                sessionStorage.removeItem('mfl-last-quote');
                self.Forms.clearForm();
                self.UI.close();
                self.Views.showView('main');
            }, closeDelay);
        },

        sendLocation: function(hubName) {
            var self = MflLogisticsAssistant;
            
            self.Analytics.trackEvent({
                event: 'wa_locations_whatsapp',
                timestamp: Date.now(),
                source: 'locations_view',
                metadata: { hub: hubName }
            });
            
            var payload = { type: 'location_support', hub: hubName };
            self.beforeSend(payload);

            if (typeof showToast === 'function') {
                showToast('Opening WhatsApp chat for ' + hubName + ' Hub...');
            }
            
            var text = self.WhatsApp.generateMessage('locations', { hub: hubName });
            self.WhatsApp.openWhatsApp(text, function() {
                self.UI.close();
            });
        },

        openWhatsApp: function(text, callback) {
            var self = MflLogisticsAssistant;
            if (self.isRedirecting) return;
            self.isRedirecting = true;
            
            var url = "https://wa.me/" + self.CONFIG.whatsappNumber + "?text=" + encodeURIComponent(text);
            
            try {
                var win = window.open(url, '_blank');
                if (!win) {
                    throw new Error('Popup blocked');
                }
                if (win) win.focus();
            } catch (err) {
                console.error("WhatsApp redirection failed:", err);
                if (typeof showToast === 'function') {
                    showToast('⚠ Unable to open WhatsApp. Please call us directly.');
                }
            }
            
            var cooldown = self.CONFIG.CONSTANTS.TIMINGS.REDIRECT_COOLDOWN || 2000;
            setTimeout(function() {
                self.isRedirecting = false;
                if (typeof callback === 'function') callback();
            }, cooldown);
        },

        generateMessage: function(action, data) {
            var self = MflLogisticsAssistant;
            var template = self.CONFIG.templates[action] || self.CONFIG.templates.generic;
            
            if (data) {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        template = template.replace(new RegExp('{{' + key + '}}', 'g'), data[key]);
                    }
                }
            }
            
            return template;
        }
    },

    Analytics: {
        trackEvent: function(data) {
            var self = MflLogisticsAssistant;
            if (!self.CONFIG.analyticsEnabled) return;
            
            var pageName = window.location.pathname.split('/').pop() || "index.html";
            var eventName = 'mfl-wa-' + data.event;
            
            var event = new CustomEvent(eventName, {
                detail: {
                    page: pageName,
                    timestamp: data.timestamp || Date.now(),
                    source: data.source || 'floating_assistant',
                    metadata: data.metadata || {}
                }
            });
            
            window.dispatchEvent(event);
            console.log("[MFL Analytics Event dispatched]", eventName, event.detail);
        }
    },

    Accessibility: {
        bindEvents: function() {
            var self = MflLogisticsAssistant;
            
            document.addEventListener('keydown', self.Accessibility.escCloseBound);
            
            if (self.cache.panel) {
                self.cache.panel.addEventListener('keydown', self.Accessibility.trapFocusBound);
            }
        },

        escCloseBound: function(e) {
            var self = MflLogisticsAssistant;
            if (e.key === 'Escape' && self.IS_OPEN) {
                self.UI.close();
            }
        },

        trapFocusBound: function(e) {
            MflLogisticsAssistant.Accessibility.trapFocus(e);
        },

        trapFocus: function(e) {
            var self = MflLogisticsAssistant;
            if (e.key !== 'Tab') return;
            
            var activeView = document.querySelector('.mfl-wa-view.active');
            if (!activeView) return;
            
            var closeBtn = self.cache.closeBtn;
            var elements = Array.prototype.slice.call(activeView.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), a:not([disabled])'));
            
            if (closeBtn) {
                elements.unshift(closeBtn);
            }
            
            var visibleFocusables = elements.filter(function(el) {
                return el.offsetWidth > 0 && el.offsetHeight > 0 && !el.disabled;
            });
            
            if (visibleFocusables.length === 0) return;
            
            var first = visibleFocusables[0];
            var last = visibleFocusables[visibleFocusables.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        }
    },

    Utilities: {
        getISTDateTime: function() {
            var d = new Date();
            var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
            var ist = new Date(utc + (3600000 * 5.5));
            return ist;
        },

        initNetworkStatus: function() {
            var self = MflLogisticsAssistant;
            window.addEventListener('online', self.Utilities.updateNetworkStatusBound);
            window.addEventListener('offline', self.Utilities.updateNetworkStatusBound);
            self.Utilities.updateNetworkStatus();
        },

        updateNetworkStatusBound: function() {
            MflLogisticsAssistant.Utilities.updateNetworkStatus();
        },

        updateNetworkStatus: function() {
            var self = MflLogisticsAssistant;
            var isOnline = navigator.onLine;
            
            var alertEls = self.cache.offlineAlerts;
            if (alertEls && alertEls.length) {
                alertEls.forEach(function(alertEl) {
                    alertEl.style.display = isOnline ? 'none' : 'flex';
                });
            }

            var btnsToToggle = document.querySelectorAll(
                '#mfl-wa-confirm-submit-btn, .mfl-wa-submit-btn, .mfl-wa-loc-btn.wa-btn'
            );
            
            btnsToToggle.forEach(function(btn) {
                if (isOnline) {
                    btn.classList.remove('mfl-wa-disabled');
                    btn.removeAttribute('disabled');
                } else {
                    btn.classList.add('mfl-wa-disabled');
                    btn.setAttribute('disabled', 'true');
                }
            });
        },

        scheduleStatusCheck: function() {
            var self = MflLogisticsAssistant;
            
            var ist = self.Utilities.getISTDateTime();
            var day = ist.getDay();
            var hour = ist.getHours();
            
            var isOpen = false;
            if (day >= 1 && day <= 6) {
                if (hour >= 9 && hour < 19) {
                    isOpen = true;
                }
            }
            
            var greeting = "Good Day 👋 How can we help with today's shipment?";
            if (hour >= 5 && hour < 12) {
                greeting = "Good Morning 👋 How can we help with today's shipment?";
            } else if (hour >= 12 && hour < 17) {
                greeting = "Good Afternoon 👋 How can we help with today's shipment?";
            } else if (hour >= 17 || hour < 5) {
                greeting = "Good Evening 👋 How can we help with today's shipment?";
            }
            
            var subtitle = document.getElementById('mfl-wa-subtitle');
            if (subtitle) {
                subtitle.textContent = greeting;
            }
            
            var statusBadge = document.getElementById('mfl-wa-status-badge');
            var statVals = document.querySelectorAll('.mfl-wa-stat-strip .stat-val');
            
            var responseText = isOpen 
                ? "Usually within 30 minutes" 
                : "Usually within 2–4 hours (next business day)";
            
            statVals.forEach(function(el) {
                el.textContent = responseText;
            });
            
            if (statusBadge) {
                var text = statusBadge.querySelector('.status-text');
                
                if (isOpen) {
                    statusBadge.className = 'mfl-wa-status-badge status-open';
                    if (text) text.textContent = 'Currently Available | Replies in 15–30 mins';
                } else {
                    statusBadge.className = 'mfl-wa-status-badge status-closed';
                    if (text) text.textContent = 'Outside Business Hours | Send WhatsApp message';
                }
            }
            
            var checkInterval = self.CONFIG.CONSTANTS.TIMINGS.STATUS_CHECK_INTERVAL || 60000;
            if (self.statusTimeout) clearTimeout(self.statusTimeout);
            self.statusTimeout = setTimeout(function() {
                self.Utilities.scheduleStatusCheck();
            }, checkInterval);
        },

        initVisibility: function() {
            var self = MflLogisticsAssistant;
            document.addEventListener('visibilitychange', self.Utilities.visibilityChangeBound);
        },

        visibilityChangeBound: function() {
            MflLogisticsAssistant.Utilities.handleVisibilityChange();
        },

        handleVisibilityChange: function() {
            var self = MflLogisticsAssistant;
            if (document.hidden) {
                self.Utilities.pausePulse();
            } else {
                self.Utilities.resumePulse();
            }
        },

        schedulePulses: function(triggerElement) {
            var self = MflLogisticsAssistant;
            var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) return;

            var t = self.CONFIG.CONSTANTS.TIMINGS;
            
            self.pulseTimer1 = setTimeout(function() {
                self.Utilities.animatePulse(triggerElement);
            }, t.PULSE_FIRST_DELAY || 9000);
            
            self.pulseTimer2 = setTimeout(function() {
                self.Utilities.animatePulse(triggerElement);
            }, t.PULSE_SECOND_DELAY || 18000);
            
            self.pulseCancelTimer = setTimeout(function() {
                clearTimeout(self.pulseTimer1);
                clearTimeout(self.pulseTimer2);
            }, t.PULSE_CANCEL_TIMEOUT || 120000);
        },

        animatePulse: function(triggerElement) {
            var self = MflLogisticsAssistant;
            var trigger = triggerElement || self.cache.trigger;
            if (trigger) {
                trigger.classList.add('mfl-wa-pulse');
                var duration = self.CONFIG.CONSTANTS.TIMINGS.PULSE_DURATION || 1800;
                setTimeout(function() {
                    if (trigger) trigger.classList.remove('mfl-wa-pulse');
                }, duration);
            }
        },

        pausePulse: function() {
            clearTimeout(this.pulseTimer1);
            clearTimeout(this.pulseTimer2);
            clearTimeout(this.pulseCancelTimer);
        },

        resumePulse: function() {
            var trigger = MflLogisticsAssistant.cache.trigger;
            if (trigger) {
                this.schedulePulses(trigger);
            }
        },

        setupMutationObserver: function() {
            var self = MflLogisticsAssistant;
            if (self.observer) return;
            
            self.observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    var removedNodes = Array.prototype.slice.call(mutation.removedNodes);
                    var wasRemoved = removedNodes.some(function(node) {
                        return node.id === 'mfl-wa-assistant' || (node.querySelector && node.querySelector('#mfl-wa-assistant'));
                    });
                    if (wasRemoved) {
                        self.destroy();
                    }
                });
            });
            
            self.observer.observe(document.body, { childList: true, subtree: true });
        }
    },

    destroy: function() {
        if (!this.isInitialized) return;
        this.isInitialized = false;

        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        clearTimeout(this.statusTimeout);
        clearTimeout(this.pulseTimer1);
        clearTimeout(this.pulseTimer2);
        clearTimeout(this.pulseCancelTimer);

        if (this.cache.closeBtn) {
            this.cache.closeBtn.removeEventListener('click', this.UI.closeBound);
        }
        
        if (this.cache.overlay) {
            this.cache.overlay.removeEventListener('click', this.UI.closeBound);
        }
        
        var cards = document.querySelectorAll('.mfl-wa-card');
        cards.forEach(function(card) {
            card.removeEventListener('click', this.UI.cardClickBound);
        }, this);
        
        var backBtns = document.querySelectorAll('.mfl-wa-back-btn');
        backBtns.forEach(function(btn) {
            btn.removeEventListener('click', this.UI.backClickBound);
        }, this);

        document.removeEventListener('keydown', this.Accessibility.escCloseBound);
        
        if (this.cache.panel) {
            this.cache.panel.removeEventListener('keydown', this.Accessibility.trapFocusBound);
        }

        window.removeEventListener('online', this.Utilities.updateNetworkStatusBound);
        window.removeEventListener('offline', this.Utilities.updateNetworkStatusBound);
        document.removeEventListener('visibilitychange', this.Utilities.visibilityChangeBound);

        console.log("[MFL Logistics Assistant] destroy() cleaned up successfully.");
    }
};
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

// =========================================================
// FAQ Accordion Handler (contact.html)
// Supports ARIA tags, height animation, and keyboard focus
// =========================================================
function initFaqAccordion() {
    var accordionItems = document.querySelectorAll('.faq-item');
    if (!accordionItems.length) return;

    accordionItems.forEach(function (item) {
        var trigger = item.querySelector('.faq-trigger');
        var panel   = item.querySelector('.faq-panel');
        if (!trigger || !panel) return;

        trigger.addEventListener('click', function () {
            var isActive = item.classList.contains('active');

            // Close other items
            accordionItems.forEach(function (otherItem) {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    var otherTrigger = otherItem.querySelector('.faq-trigger');
                    var otherPanel   = otherItem.querySelector('.faq-panel');
                    if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
                    if (otherPanel) otherPanel.style.maxHeight = '0px';
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                trigger.setAttribute('aria-expanded', 'false');
                panel.style.maxHeight = '0px';
            } else {
                item.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });
    });
}

// =========================================================
// Email Obfuscation Decoder
// =========================================================
function initEmailObfuscation() {
    document.querySelectorAll('.email-link').forEach(function(link) {
        var user = link.dataset.user;
        var domain = link.dataset.domain;
        if (!user || !domain) return;
        var email = user + '@' + domain;
        link.href = 'mailto:' + email;
        
        var icon = link.querySelector('i');
        if (icon) {
            link.innerHTML = '';
            link.appendChild(icon);
            link.appendChild(document.createTextNode(' ' + email));
        } else {
            link.textContent = email;
        }
    });
}
