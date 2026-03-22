// ===== MFL Tech-Enabled Script =====

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initCounters();
    initHeroEstimator();
    initTracking();
    initContactForm();
    initTiltEffects();
    initScrollSpy();
    initScrollProgress();
});

// ===== Mobile Tilt Optimization =====
function initTiltEffects() {
    const cards = document.querySelectorAll(".tilt-card");
    if (cards.length > 0) {
        if (window.innerWidth < 768) {
            // Disable 3D tilt overhead on low-end touch devices
            VanillaTilt.init(cards, { max: 0 });
        } else {
            // Enable 3D tilt
            VanillaTilt.init(cards, {
                max: 5,
                speed: 400,
                glare: true,
                "max-glare": 0.15
            });
        }
    }
}

// ===== Navbar Scroll Effect =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== Mobile Menu =====
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const links = navLinks.querySelectorAll('a');

    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        toggle.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            toggle.classList.remove('active');
        });
    });
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if(this.getAttribute('href') === '#') return;
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Scroll Reveal Animations =====
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    
    // Initial check
    setTimeout(checkElements, 100);
    
    // Scroll check
    window.addEventListener('scroll', checkElements);

    function checkElements() {
        const triggerBottom = window.innerHeight * 0.9;
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.classList.add('animate-in');
            }
        });
    }
}

// ===== Number Counter Animations =====
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 60; // The lower the faster

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const increment = target / speed;

                let count = 0;
                const updateCount = () => {
                    count += increment;
                    if (count < target) {
                        counter.innerText = Math.ceil(count);
                        setTimeout(updateCount, 30);
                    } else {
                        counter.innerText = target;
                        counter.classList.add('completed');
                    }
                };
                updateCount();
                obs.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ===== Instant Freight Estimator =====
function initHeroEstimator() {
    const form = document.getElementById('heroQuoteForm');
    if(!form) return;
    
    const resultDiv = document.getElementById('estimateResult');
    const loader = resultDiv.querySelector('.estimate-loader');
    const finalData = resultDiv.querySelector('.estimate-final');
    const estPrice = document.getElementById('estPrice');
    const estTime = document.getElementById('estTime');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const pickup = document.getElementById('estPickup').value;
        const drop = document.getElementById('estDrop').value;
        const weight = parseFloat(document.getElementById('estWeight').value) || 1;
        const typeNode = document.getElementById('estType');
        const type = typeNode.options[typeNode.selectedIndex].text;

        // Reset display
        resultDiv.classList.remove('hidden');
        loader.classList.remove('hidden');
        finalData.classList.add('hidden');

        // Simulate Route Calculation Time
        setTimeout(() => {
            loader.classList.add('hidden');
            finalData.classList.remove('hidden');
            
            // Procedurally generate a realistic sounding quote base
            const baseRate = Math.floor(Math.random() * 8000) + 12000; 
            const finalP = (baseRate * weight).toLocaleString('en-IN');
            
            estPrice.innerText = `₹${finalP}`;
            estTime.innerText = "Guaranteed 24 - 48 Hours";
        }, 1500);
    });
}

// ===== Live Tracking Simulation =====
function initTracking() {
    const input = document.getElementById('trackingId');
    if(!input) return;

    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            window.open('https://wa.me/918707812390?text=Hello,%20I%20need%20a%20tracking%20update%20for%20LR%20Number:%20' + this.value, '_blank');
        }
    });
}

// ===== Abstract Contact Form Handler =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if(!form) return;
    const status = document.getElementById('formStatus');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        
        // Simulating highly advanced API dispatch
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Initializing Dispatch...';
        btn.disabled = true;
        
        setTimeout(() => {
            status.className = 'form-status success';
            status.innerText = "Dispatch Protocol Received! Our Central Operations team will contact you within 20 minutes.";
            status.style.display = 'block';
            form.reset();
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 1800);
    });
}

// ===== Scroll to Top Logic =====
window.addEventListener('scroll', () => {
    const scrollBtn = document.getElementById('scrollTopBtn');
    if(scrollBtn) {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }
});

// ===== Callback Modal Logic =====
function openCallbackModal() {
    document.getElementById('callbackModal').classList.remove('hidden');
}
function closeCallbackModal() {
    document.getElementById('callbackModal').classList.add('hidden');
    document.getElementById('cbStatus').style.display = 'none';
}
function submitCallback(e) {
    e.preventDefault();
    const btn = document.getElementById('cbSubmitBtn');
    const status = document.getElementById('cbStatus');
    const oText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Dispatching...';
    btn.disabled = true;
    
    setTimeout(() => {
        status.innerText = "Request received. We will call you precisely as requested.";
        status.style.display = 'block';
        btn.innerHTML = oText;
        btn.disabled = false;
        document.getElementById('callbackForm').reset();
    }, 1500);
}

// ===== Scroll Spy for Nav Links =====
function initScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('#navLinks a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (current && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

// ===== Top Scroll Progress Bar =====
function initScrollProgress() {
    const scrollBar = document.getElementById('scrollBar');
    if (!scrollBar) return;
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollBar.style.width = scrolled + '%';
    });
}

// ===== WhatsApp Conversational Widget =====
function toggleWaWidget() {
    const widget = document.getElementById('waWidget');
    if(widget) {
        widget.classList.toggle('open');
    }
}

// ===== Interactive Expandable Cities List =====
function toggleCities() {
    const list = document.getElementById('citiesList');
    const btn = document.getElementById('toggleCitiesBtn');
    if(!list || !btn) return;
    
    if (list.style.maxHeight && list.style.maxHeight !== '0px') {
        list.style.maxHeight = '0px';
        btn.innerHTML = 'See All Cities <i class="fas fa-chevron-down"></i>';
    } else {
        list.style.maxHeight = list.scrollHeight + "px";
        btn.innerHTML = 'Collapse List <i class="fas fa-chevron-up"></i>';
    }
}
