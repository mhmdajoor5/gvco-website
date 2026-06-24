/**
 * GVCO Website - Premium JavaScript v2.0
 * Ultra-Premium Industrial Corporate Website
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with premium settings
    AOS.init({
        duration: 1000,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        once: true,
        offset: 80,
        disable: window.innerWidth < 768 ? 'mobile' : false
    });

    // Initialize all components
    initLoadingScreen();
    initNavbar();
    initMobileMenu();
    initCounters();
    initSmoothScroll();
    initContactForm();
    initLanguageToggle();
    initParallax();
    initActiveNavHighlight();
});

/**
 * Premium Loading Screen
 */
function initLoadingScreen() {
    const loader = document.querySelector('.loading');

    if (loader) {
        // Hide loader after content loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');

                // Refresh AOS after loader hides
                setTimeout(() => {
                    AOS.refresh();
                }, 300);
            }, 800);
        });

        // Fallback: hide loader after 3 seconds max
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 3000);
    }
}

/**
 * Premium Navbar with Glass Effect
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    let ticking = false;

    const updateNavbar = () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class with smooth transition
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Optional: Hide/show navbar on scroll direction
        // if (currentScroll > lastScroll && currentScroll > 500) {
        //     navbar.style.transform = 'translateY(-100%)';
        // } else {
        //     navbar.style.transform = 'translateY(0)';
        // }

        lastScroll = currentScroll;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
}

/**
 * Mobile Menu with Smooth Animation
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    let isOpen = false;

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            isOpen = !isOpen;

            if (isOpen) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.style.opacity = '0';
                mobileMenu.style.transform = 'translateY(-10px)';

                requestAnimationFrame(() => {
                    mobileMenu.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    mobileMenu.style.opacity = '1';
                    mobileMenu.style.transform = 'translateY(0)';
                });
            } else {
                mobileMenu.style.opacity = '0';
                mobileMenu.style.transform = 'translateY(-10px)';

                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
            }

            // Animate hamburger to X
            const icon = mobileMenuBtn.querySelector('svg');
            if (isOpen) {
                icon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                `;
            } else {
                icon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                `;
            }
        });

        // Close menu when clicking on a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                isOpen = false;
                mobileMenu.style.opacity = '0';
                mobileMenu.style.transform = 'translateY(-10px)';

                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);

                mobileMenuBtn.querySelector('svg').innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                `;
            });
        });
    }
}

/**
 * Premium Animated Counters
 */
function initCounters() {
    const counters = document.querySelectorAll('.counter');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2500;
    const start = 0;
    const startTime = performance.now();

    // Easing function for smooth animation
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const current = Math.floor(start + (target - start) * easedProgress);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = target;
        }
    };

    requestAnimationFrame(animate);
}

/**
 * Smooth Scroll with Offset
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Premium Contact Form with Animations
 */
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (form) {
        // Add focus effects to inputs
        const inputs = form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = `
                <svg class="animate-spin w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Sending...</span>
            `;
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success state
            submitBtn.innerHTML = `
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>Message Sent!</span>
            `;
            submitBtn.style.background = 'linear-gradient(135deg, #059669 0%, #10B981 100%)';
            submitBtn.style.opacity = '1';

            // Reset form
            form.reset();

            // Reset button after delay
            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        });
    }
}

/**
 * Language Toggle (Arabic/English)
 * Arabic is the PRIMARY language - loads first by default
 */
function initLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    const mobileLangToggle = document.getElementById('mobileLangToggle');
    const html = document.documentElement;

    // Initialize Arabic as default on page load
    document.body.classList.add('font-arabic');
    if (langToggle) {
        langToggle.textContent = 'English';
    }
    if (mobileLangToggle) {
        mobileLangToggle.textContent = 'English';
    }

    // Apply Arabic content on initial load
    updateContentToArabic();

    // Toggle language function
    function toggleLanguage() {
        const isRTL = html.getAttribute('dir') === 'rtl';

        // Add transition
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '0.5';

        setTimeout(() => {
            if (isRTL) {
                // Switch to English
                html.setAttribute('dir', 'ltr');
                html.setAttribute('lang', 'en');
                if (langToggle) langToggle.textContent = 'العربية';
                if (mobileLangToggle) mobileLangToggle.textContent = 'العربية';
                document.body.classList.remove('font-arabic');
                updateContentToEnglish();
            } else {
                // Switch to Arabic
                html.setAttribute('dir', 'rtl');
                html.setAttribute('lang', 'ar');
                if (langToggle) langToggle.textContent = 'English';
                if (mobileLangToggle) mobileLangToggle.textContent = 'English';
                document.body.classList.add('font-arabic');
                updateContentToArabic();
            }

            document.body.style.opacity = '1';

            // Refresh AOS animations
            setTimeout(() => {
                AOS.refresh();
            }, 100);
        }, 300);
    }

    // Add event listeners
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }
    if (mobileLangToggle) {
        mobileLangToggle.addEventListener('click', toggleLanguage);
    }
}

/**
 * Update Content to Arabic - Using data-ar attributes
 */
function updateContentToArabic() {
    // Update all elements with data-ar attribute
    document.querySelectorAll('[data-ar]').forEach(element => {
        const arabicText = element.getAttribute('data-ar');
        if (arabicText) {
            // Check if element is an input with placeholder
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                const arabicPlaceholder = element.getAttribute('data-placeholder-ar');
                if (arabicPlaceholder) {
                    element.placeholder = arabicPlaceholder;
                }
            } else if (element.tagName === 'OPTION') {
                element.textContent = arabicText;
            } else {
                element.textContent = arabicText;
            }
        }
    });

    // Update form placeholders
    document.querySelectorAll('[data-placeholder-ar]').forEach(element => {
        const arabicPlaceholder = element.getAttribute('data-placeholder-ar');
        if (arabicPlaceholder) {
            element.placeholder = arabicPlaceholder;
        }
    });
}

/**
 * Update Content to English - Using data-en attributes
 */
function updateContentToEnglish() {
    // Update all elements with data-en attribute
    document.querySelectorAll('[data-en]').forEach(element => {
        const englishText = element.getAttribute('data-en');
        if (englishText) {
            // Check if element is an input with placeholder
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                const englishPlaceholder = element.getAttribute('data-placeholder-en');
                if (englishPlaceholder) {
                    element.placeholder = englishPlaceholder;
                }
            } else if (element.tagName === 'OPTION') {
                element.textContent = englishText;
            } else {
                element.textContent = englishText;
            }
        }
    });

    // Update form placeholders
    document.querySelectorAll('[data-placeholder-en]').forEach(element => {
        const englishPlaceholder = element.getAttribute('data-placeholder-en');
        if (englishPlaceholder) {
            element.placeholder = englishPlaceholder;
        }
    });
}

/**
 * Parallax Effect for Hero Section
 */
function initParallax() {
    let ticking = false;

    const parallaxElements = {
        heroContent: document.querySelector('#home .relative.z-10'),
        gears: document.querySelectorAll('.gear-element'),
        ambientLights: document.querySelectorAll('#home > div[class*="blur"]')
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;

                if (parallaxElements.heroContent && scrolled < window.innerHeight) {
                    const opacity = Math.max(0, 1 - (scrolled / (window.innerHeight * 0.8)));
                    const translateY = scrolled * 0.4;

                    parallaxElements.heroContent.style.transform = `translateY(${translateY}px)`;
                    parallaxElements.heroContent.style.opacity = opacity;
                }

                // Subtle parallax for gear elements
                parallaxElements.gears.forEach((gear, index) => {
                    const speed = 0.1 + (index * 0.05);
                    gear.style.transform = `rotate(${scrolled * speed}deg)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Active Navigation Link Highlighting
 */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let ticking = false;

    const updateActiveLink = () => {
        const navbarHeight = document.getElementById('navbar').offsetHeight;
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionHeight = section.offsetHeight;

            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-white', 'active');
            link.classList.add('text-white/70');

            if (link.getAttribute('href') === `#${current}`) {
                link.classList.remove('text-white/70');
                link.classList.add('text-white', 'active');
            }
        });

        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateActiveLink);
            ticking = true;
        }
    });
}

/**
 * Keyboard Navigation Support
 */
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');

        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.style.opacity = '0';
            mobileMenu.style.transform = 'translateY(-10px)';

            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);

            if (mobileMenuBtn) {
                mobileMenuBtn.querySelector('svg').innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                `;
            }
        }
    }
});

/**
 * Intersection Observer for Lazy Animations
 */
const observeElements = () => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
};

observeElements();

/**
 * Magnetic Button Effect (Premium)
 */
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
    });
});

/**
 * Card Tilt Effect (Premium)
 */
document.querySelectorAll('.service-card, .industry-card, .leader-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/**
 * Mobile Language Toggle Function (global)
 */
window.toggleLanguage = function() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.click();
    }
};

/**
 * Console Easter Egg
 */
console.log(`
%c GVCO - Golden Vision Company
%c شركة الرؤيا الذهبية المحدودة

%c Precision Engineering | Industrial Excellence
%c Since 2008 | Jeddah, Saudi Arabia

%c ⚙️ Website crafted with precision and care.
`,
'color: #2E7DD1; font-size: 24px; font-weight: bold;',
'color: #D4AF37; font-size: 16px;',
'color: #C4D0DC; font-size: 14px;',
'color: #718096; font-size: 12px;',
'color: #4A5568; font-size: 11px;'
);
