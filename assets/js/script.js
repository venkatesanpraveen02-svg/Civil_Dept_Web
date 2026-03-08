/*
 * Main JavaScript for GCEE Civil Department Website
 */

document.addEventListener("DOMContentLoaded", function () {

    // 1. Current Year for Copyright
    const yearSpan = document.getElementById("currentYear");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Navbar Scroll Effect
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navbar.classList.add("scrolled", "shadow-sm");
            } else {
                navbar.classList.remove("scrolled", "shadow-sm");
            }
        });
    }

    // --- Dynamic Data Fetching for Notices and Events ---
    async function loadDynamicData() {
        try {
            const res = await fetch('http://localhost:8000/api/data');
            const data = await res.json();
            
            // Render Notices
            const noticeContainer = document.getElementById('notice-list');
            const noticeLoading = document.getElementById('notice-loading');
            
            if (noticeContainer && noticeLoading) {
                if (!data.notices || data.notices.length === 0) {
                    noticeLoading.innerText = "No new notices at the moment.";
                } else {
                    noticeContainer.innerHTML = ''; // clear loading
                    // Sort newest first
                    const notices = [...data.notices].sort((a,b) => new Date(b.date) - new Date(a.date));
                    
                    notices.forEach(n => {
                        const div = document.createElement('div');
                        div.className = "d-flex align-items-start border-bottom py-3";
                        div.innerHTML = `
                            <div class="bg-primary-light text-primary rounded text-center me-3 px-2 py-1 shadow-sm" style="min-width: 60px;">
                                <span class="d-block fw-bold fs-5 mb-n1">${new Date(n.date).getDate()}</span>
                                <span class="small text-uppercase fw-semibold" style="font-size: 0.7rem;">${new Date(n.date).toLocaleString('default', { month: 'short' })}</span>
                            </div>
                            <div>
                                <p class="mb-0 text-dark fw-medium lh-sm" style="font-size: 0.95rem;">${n.text}</p>
                                <span class="badge bg-light text-muted border border-dashed mt-2" style="font-size: 0.7rem;">New Update</span>
                            </div>
                        `;
                        noticeContainer.appendChild(div);
                    });
                }
            }

            // Render Events
            const eventContainer = document.getElementById('event-list');
            const eventLoading = document.getElementById('event-loading');
            
            if (eventContainer && eventLoading) {
                if (!data.events || data.events.length === 0) {
                    eventLoading.innerText = "No upcoming events scheduled.";
                } else {
                    eventContainer.innerHTML = ''; // clear loading
                    // Sort newest first
                    const events = [...data.events].sort((a,b) => new Date(b.date) - new Date(a.date));
                    
                    events.forEach(e => {
                        const div = document.createElement('div');
                        div.className = "d-flex align-items-start border-bottom py-3";
                        div.innerHTML = `
                            <div class="bg-accent text-dark rounded text-center me-3 px-2 py-1 shadow-sm" style="min-width: 60px;">
                                <span class="d-block fw-bold fs-5 mb-n1">${new Date(e.date).getDate()}</span>
                                <span class="small text-uppercase fw-semibold" style="font-size: 0.7rem;">${new Date(e.date).toLocaleString('default', { month: 'short' })}</span>
                            </div>
                            <div>
                                <p class="mb-0 text-dark fw-bold lh-sm" style="font-size: 0.95rem;">${e.title}</p>
                                ${e.time ? `<small class="text-muted d-block mt-1" style="font-size: 0.75rem;"><i class="fa-regular fa-clock text-accent me-1"></i> ${e.time}</small>` : ''}
                                ${e.location ? `<small class="text-muted d-block mt-1" style="font-size: 0.75rem;"><i class="fa-solid fa-location-dot text-danger me-1"></i> ${e.location}</small>` : ''}
                            </div>
                        `;
                        eventContainer.appendChild(div);
                    });
                }
            }

        } catch (err) {
            console.error("Failed to load events/notices", err);
            const nl = document.getElementById('notice-loading');
            const el = document.getElementById('event-loading');
            if(nl) nl.innerText = "Unable to load notices.";
            if(el) el.innerText = "Unable to load events.";
        }
    }
    
    // Call the load function
    loadDynamicData();

    // 3. Smooth Scrolling for Navigation Links & Active State
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = document.querySelectorAll('section');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            if (this.hash !== "") {
                e.preventDefault();
                const hash = this.hash;
                const targetEl = document.querySelector(hash);

                if (targetEl) {
                    // Close mobile menu if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }

                    // Scroll
                    const headerOffset = 70;
                    const elementPosition = targetEl.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = document.documentElement.scrollTop;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= (sectionTop - 120)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 4. Statistics Counter Animation
    const counters = document.querySelectorAll('.counter');
    let hasAnimated = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // ms
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
        hasAnimated = true;
    };

    // Use Intersection Observer to trigger counter animation when stats section is visible
    const statsSection = document.querySelector('.stats-section');
    if (statsSection && window.IntersectionObserver) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimated) {
                animateCounters();
            }
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    } else if (statsSection) {
        // Fallback for older browsers
        animateCounters();
    }

    // 5. Initialize Bootstrap Tooltips
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        });
    }

    // 6. Simple scroll reveal animation for cards
    const fadeElements = document.querySelectorAll('.card, .section-title, .d-flex.align-items-start');
    
    // Initial add
    fadeElements.forEach(el => el.classList.add('fade-up'));

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        fadeElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load
});
