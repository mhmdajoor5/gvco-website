/**
 * Golden Vision Website - Premium JavaScript v2.0
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
    initHeroVideo();
    initNavbar();
    initMobileMenu();
    initCounters();
    initSmoothScroll();
    initContactForm();
    initLanguageToggle();
    initAiBot();
    requestAnimationFrame(() => restartHeroTypewriter());
    initParallax();
    initActiveNavHighlight();
});

let heroTypewriterTimers = [];

function restartHeroTypewriter() {
    const targets = Array.from(document.querySelectorAll('#home [data-typewriter]'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const langKey = document.documentElement.getAttribute('dir') === 'rtl' ? 'ar' : 'en';

    heroTypewriterTimers.forEach(timer => window.clearTimeout(timer));
    heroTypewriterTimers = [];

    targets.forEach(target => {
        const fullText = target.getAttribute(`data-${langKey}`) || target.textContent.trim();
        target.setAttribute('aria-label', fullText);
        target.textContent = fullText;
        target.classList.remove('is-typing');
    });

    const visibleTargets = targets.filter(target => {
        const rect = target.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    });

    if (reduceMotion || visibleTargets.length === 0) return;

    visibleTargets.forEach(target => {
        target.textContent = '';
    });

    let sequenceDelay = 80;

    visibleTargets.forEach(target => {
        const fullText = target.getAttribute(`data-${langKey}`) || '';
        const startTimer = window.setTimeout(() => {
            target.classList.add('is-typing');
            typeText(target, fullText, 0, () => {
                target.classList.remove('is-typing');
            });
        }, sequenceDelay);

        heroTypewriterTimers.push(startTimer);

        const finishTimer = window.setTimeout(() => {
            target.textContent = fullText;
            target.classList.remove('is-typing');
        }, sequenceDelay + Math.max(900, fullText.length * 70 + 360));

        heroTypewriterTimers.push(finishTimer);
        sequenceDelay += Math.max(480, fullText.length * 44 + 160);
    });
}

function typeText(element, text, index, onComplete) {
    if (index > 0 && !element.classList.contains('is-typing')) {
        return;
    }

    if (index > text.length) {
        onComplete();
        return;
    }

    element.textContent = text.slice(0, index);

    const delay = text[index - 1] === ' ' ? 22 : 38;
    const timer = window.setTimeout(() => {
        typeText(element, text, index + 1, onComplete);
    }, delay);

    heroTypewriterTimers.push(timer);
}

/**
 * Autoplay hero background videos when muted playback is allowed.
 */
function initHeroVideo() {
    const videos = document.querySelectorAll('.hero-video, .service-detail-video');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    videos.forEach(video => {
        if (reduceMotion) {
            video.pause();
            return;
        }

        video.muted = true;
        video.playsInline = true;

        const markReady = () => {
            video.classList.add('is-ready');
        };

        const playVideo = () => {
            if (video.readyState >= 2) {
                markReady();
            }

            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {
                    // Keep the poster/image fallback if autoplay is blocked.
                });
            }
        };

        if (video.readyState >= 2) {
            markReady();
            playVideo();
        } else {
            video.addEventListener('loadedmetadata', playVideo, { once: true });
            video.addEventListener('loadeddata', markReady, { once: true });
            video.addEventListener('loadeddata', playVideo, { once: true });
        }

        video.addEventListener('pause', () => {
            if (!document.hidden && !reduceMotion) {
                window.setTimeout(playVideo, 150);
            }
        });

        video.addEventListener('ended', () => {
            video.currentTime = 0;
            playVideo();
        });

        video.addEventListener('canplay', markReady);
        video.addEventListener('canplay', playVideo);
        video.addEventListener('stalled', playVideo);
        window.addEventListener('pointerdown', playVideo, { once: true });
        window.addEventListener('keydown', playVideo, { once: true });
    });

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !reduceMotion) {
            videos.forEach(video => video.play().catch(() => {}));
        }
    });

    window.setInterval(() => {
        if (document.hidden || reduceMotion) return;
        videos.forEach(video => {
            if (video.paused && video.readyState >= 2) {
                video.classList.add('is-ready');
                video.play().catch(() => {});
            }
        });
    }, 2500);
}

/**
 * Premium Loading Screen
 */
function initLoadingScreen() {
    const loader = document.querySelector('.loading');

    if (loader) {
        loader.classList.add('hidden');
        loader.setAttribute('aria-hidden', 'true');
        requestAnimationFrame(() => AOS.refresh());
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
            const isArabic = document.documentElement.getAttribute('dir') === 'rtl';

            submitBtn.innerHTML = `
                <svg class="animate-spin w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>${isArabic ? 'جار الإرسال...' : 'Sending...'}</span>
            `;
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            try {
                const endpoint = form.getAttribute('data-form-endpoint');
                const formData = new FormData(form);
                const emailInput = form.querySelector('input[type="email"]');
                formData.set('_url', window.location.href);
                formData.set('_replyto', emailInput ? emailInput.value : '');

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData
                });
                const result = await response.json().catch(() => ({}));

                if (!response.ok || result.success === 'false' || result.success === false) {
                    throw new Error(result.message || 'Form submission failed');
                }

                submitBtn.innerHTML = `
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>${isArabic ? 'تم إرسال الرسالة' : 'Message Sent!'}</span>
                `;
                submitBtn.style.background = 'linear-gradient(135deg, #059669 0%, #10B981 100%)';
                form.reset();
            } catch (error) {
                const fileProtocolError = window.location.protocol === 'file:';
                const errorMessage = fileProtocolError
                    ? (isArabic ? 'افتح الموقع من سيرفر لتفعيل الإرسال' : 'Open the site from a web server to send')
                    : (isArabic ? 'تعذر الإرسال، حاول مرة أخرى' : 'Could not send, try again');

                submitBtn.innerHTML = `
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"/>
                    </svg>
                    <span>${errorMessage}</span>
                `;
                submitBtn.style.background = 'linear-gradient(135deg, #B91C1C 0%, #DC2626 100%)';
            } finally {
                submitBtn.style.opacity = '1';

                setTimeout(() => {
                    submitBtn.innerHTML = originalContent;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3500);
            }
        });
    }
}

/**
 * Golden Vision Assistant
 * Front-end guided assistant for common visitor questions.
 */
function initAiBot() {
    const bot = document.getElementById('aiBot');
    if (!bot) return;

    const toggle = document.getElementById('aiBotToggle');
    const close = document.getElementById('aiBotClose');
    const form = document.getElementById('aiBotForm');
    const input = document.getElementById('aiBotInput');
    const messages = document.getElementById('aiBotMessages');
    const promptButtons = bot.querySelectorAll('[data-bot-prompt]');
    let hasWelcomed = false;

    const copy = {
        ar: {
            welcome: 'أهلًا، أنا مساعد مصنع الرؤيا الذهبية. اسألني عن الخدمات، طلب عرض سعر، الموقع، أو طريقة التواصل.',
            placeholder: 'اكتب استفسارك هنا...',
            empty: 'اكتب سؤالك أو اختر أحد الأسئلة السريعة.',
            services: 'نقدم خدمات التصنيع CNC، القطع بالليزر، الصفائح المعدنية، اللحام الصناعي، الصيانة، والمشاريع الصناعية المتكاملة. إذا عندك رسمة أو مواصفات، أرسلها عبر نموذج التواصل.',
            quote: 'لطلب عرض سعر، نحتاج نوع الخدمة، المادة، الكمية، الرسومات أو المقاسات، وموعد التسليم المطلوب. أقدر أوصلك مباشرة لنموذج طلب العرض.',
            contact: 'تقدر تتواصل معنا عبر الهاتف 920011054 أو البريد info@saudilathe.com. نموذج التواصل في نهاية الصفحة مناسب لإرسال تفاصيل المشروع.',
            location: 'مقر المصنع في جدة، المدينة الصناعية، المملكة العربية السعودية.',
            certifications: 'الموقع يعرض اعتماد ISO 9001:2015، واعتماد أرامكو، ومورد لدى سابك ضمن بيانات الموقع.',
            timeline: 'مدة التنفيذ تعتمد على نوع التصنيع، الكمية، توفر المواد، وتعقيد الرسومات. أفضل طريقة لتقديرها هي إرسال التفاصيل عبر نموذج طلب العرض.',
            fallback: 'أقدر أساعدك أكثر لو كتبت نوع الخدمة أو تفاصيل المشروع. للاستفسارات الدقيقة، استخدم نموذج التواصل وسيتم مراجعة الطلب من الفريق المختص.',
            cta: 'افتح نموذج التواصل'
        },
        en: {
            welcome: 'Hello, I am the Golden Vision Assistant. Ask me about services, quotes, location, or contact options.',
            placeholder: 'Type your question...',
            empty: 'Type your question or choose one of the quick prompts.',
            services: 'Golden Vision provides CNC machining, laser cutting, sheet metal fabrication, industrial welding, maintenance, and turnkey industrial projects. If you have drawings or specs, send them through the contact form.',
            quote: 'For a quote, share the required service, material, quantity, drawings or dimensions, and target delivery date. I can take you directly to the quote form.',
            contact: 'You can contact Golden Vision by phone at 920011054 or email info@saudilathe.com. The contact form is best for project details.',
            location: 'Golden Vision is located in Jeddah Industrial City, Saudi Arabia.',
            certifications: 'The website lists ISO 9001:2015, ARAMCO Approved, and SABIC Vendor credentials.',
            timeline: 'Lead time depends on service type, quantity, material availability, and drawing complexity. Send the details through the quote form for a proper estimate.',
            fallback: 'I can help better if you mention the service or project details. For precise requirements, use the contact form and the team will review it.',
            cta: 'Open contact form'
        }
    };

    const getLang = () => document.documentElement.getAttribute('dir') === 'rtl' ? 'ar' : 'en';

    const syncLanguage = () => {
        input.placeholder = copy[getLang()].placeholder;
    };

    const appendMessage = (role, text) => {
        const message = document.createElement('div');
        message.className = `ai-bot-message ${role === 'user' ? 'is-user' : 'is-assistant'}`;
        message.textContent = text;
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    };

    const addContactAction = () => {
        const lang = getLang();
        const action = document.createElement('a');
        action.href = '#contact';
        action.className = 'ai-bot-action';
        action.textContent = copy[lang].cta;
        messages.appendChild(action);
        messages.scrollTop = messages.scrollHeight;
    };

    const normalize = (text) => text
        .toLowerCase()
        .replace(/[أإآ]/g, 'ا')
        .replace(/ى/g, 'ي')
        .replace(/ة/g, 'ه')
        .trim();

    const answerQuestion = (question) => {
        const lang = getLang();
        const text = normalize(question);

        if (!text) return copy[lang].empty;

        if (/(خدم|cnc|سي ان سي|ليزر|لحام|صفائح|معادن|تصنيع|maintenance|welding|laser|sheet|service|fabrication)/i.test(text)) {
            return copy[lang].services;
        }

        if (/(سعر|عرض|تكلف|كوت|quote|price|cost|rfq|quotation)/i.test(text)) {
            return copy[lang].quote;
        }

        if (/(تواصل|اتصال|رقم|ايميل|بريد|contact|phone|email|call)/i.test(text)) {
            return copy[lang].contact;
        }

        if (/(موقع|عنوان|جده|جدة|location|address|jeddah|where)/i.test(text)) {
            return copy[lang].location;
        }

        if (/(اعتماد|ايزو|ارامكو|سابك|iso|aramco|sabic|certificate|certification|vendor)/i.test(text)) {
            return copy[lang].certifications;
        }

        if (/(مده|مدة|وقت|تسليم|timeline|lead time|delivery|duration)/i.test(text)) {
            return copy[lang].timeline;
        }

        return copy[lang].fallback;
    };

    const openBot = () => {
        bot.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        if (!hasWelcomed) {
            appendMessage('assistant', copy[getLang()].welcome);
            hasWelcomed = true;
        }
        window.setTimeout(() => input.focus(), 160);
    };

    const closeBot = () => {
        bot.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
    };

    const submitQuestion = (question) => {
        const cleanQuestion = question.trim();
        if (!cleanQuestion) {
            appendMessage('assistant', copy[getLang()].empty);
            return;
        }

        appendMessage('user', cleanQuestion);
        window.setTimeout(() => {
            const answer = answerQuestion(cleanQuestion);
            appendMessage('assistant', answer);
            if (/(سعر|عرض|quote|price|cost|contact|تواصل|اتصال)/i.test(normalize(cleanQuestion))) {
                addContactAction();
            }
        }, 280);
    };

    toggle.addEventListener('click', () => {
        if (bot.classList.contains('is-open')) {
            closeBot();
        } else {
            openBot();
        }
    });

    close.addEventListener('click', closeBot);

    promptButtons.forEach(button => {
        button.addEventListener('click', () => {
            openBot();
            const lang = getLang();
            const prompt = button.getAttribute(`data-bot-${lang}`) || button.getAttribute('data-bot-prompt') || '';
            submitQuestion(prompt);
        });
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        submitQuestion(input.value);
        input.value = '';
    });

    syncLanguage();
    document.addEventListener('gvco:languagechange', syncLanguage);
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
            restartHeroTypewriter();
            document.dispatchEvent(new CustomEvent('gvco:languagechange'));

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
    const navLinks = document.querySelectorAll('.nav-link-clean');

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
%c Golden Vision Metal Industry Factory
%c مصنع الرؤيا الذهبية للصناعات المعدنية

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
