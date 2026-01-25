/**
 * WAARFE Landing Page - Interactive JavaScript
 * Premium cinematic experience with scroll animations,
 * scent notes mini-game, and toast modal
 */

(function() {
    'use strict';

    // ========================================
    // DOM ELEMENTS
    // ========================================
    const elements = {
        cinematicIntro: document.getElementById('cinematicIntro'),
        bottleImage: document.getElementById('bottleImage'),
        heroBottle: document.getElementById('heroBottle'),
        scentGame: document.getElementById('scentGame'),
        scentNotes: document.querySelectorAll('.scent-note'),
        ctaButton: document.getElementById('ctaButton'),
        toastBackdrop: document.getElementById('toastBackdrop'),
        toastModal: document.getElementById('toastModal'),
        toastClose: document.getElementById('toastClose'),
        particlesContainer: document.getElementById('particles'),
        breezeContainer: document.getElementById('breezeContainer'),
        breezeTrails: document.querySelectorAll('.breeze-trail'),
        hero: document.getElementById('hero'),
        accordionItems: document.querySelectorAll('.accordion-item')
    };

    // ========================================
    // STATE
    // ========================================
    const state = {
        collectedNotes: 0,
        totalNotes: 3,
        introComplete: false,
        scrollY: 0,
        mouseX: 0,
        mouseY: 0,
        toastTimeout: null,
        particles: []
    };

    // ========================================
    // CINEMATIC INTRO
    // ========================================
    function initCinematicIntro() {
        if (!elements.cinematicIntro) return;

        // Check if intro was already shown this session
        if (sessionStorage.getItem('waarfeIntroShown')) {
            elements.cinematicIntro.classList.add('hidden');
            state.introComplete = true;
            revealBottle();
            return;
        }

        // Animate intro: 0.8-1.2s fade-in + zoom + mist effect
        setTimeout(() => {
            elements.cinematicIntro.classList.add('fade-out');
            
            setTimeout(() => {
                elements.cinematicIntro.classList.add('hidden');
                state.introComplete = true;
                sessionStorage.setItem('waarfeIntroShown', 'true');
                revealBottle();
            }, 500);
        }, 1000);
    }

    // ========================================
    // BOTTLE REVEAL - Keep bottle steady (no scroll zoom)
    // ========================================
    function revealBottle() {
        if (elements.bottleImage) {
            elements.bottleImage.classList.add('revealed');
        }
    }

    function handleScrollZoom() {
        // Disabled - bottle stays steady with only gentle idle CSS float
        // No scroll-based transform changes
    }

    // ========================================
    // PARTICLES SYSTEM
    // ========================================
    function createParticle() {
        if (!elements.particlesContainer) return;

        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position and animation
        const startX = Math.random() * 100;
        const startY = 100 + Math.random() * 20;
        const duration = 6 + Math.random() * 4;
        const size = 2 + Math.random() * 4;
        const delay = Math.random() * 2;

        particle.style.cssText = `
            left: ${startX}%;
            bottom: -20px;
            width: ${size}px;
            height: ${size}px;
            animation: particleRise ${duration}s ease-out ${delay}s infinite;
        `;

        elements.particlesContainer.appendChild(particle);
        state.particles.push(particle);

        // Limit particles
        if (state.particles.length > 30) {
            const oldParticle = state.particles.shift();
            oldParticle.remove();
        }
    }

    function initParticles() {
        // Create initial particles
        for (let i = 0; i < 15; i++) {
            setTimeout(createParticle, i * 200);
        }
        // Continue creating particles
        setInterval(createParticle, 800);
    }

    // ========================================
    // BREEZE EFFECT
    // ========================================
    function handleBreeze(e) {
        if (!elements.breezeTrails.length) return;

        const x = e ? (e.clientX / window.innerWidth) : 0.5;
        const y = e ? (e.clientY / window.innerHeight) : 0.5;

        elements.breezeTrails.forEach((trail, index) => {
            const offset = (index - 1) * 10;
            const translateX = (x - 0.5) * 50 + offset;
            const rotate = (x - 0.5) * 10;
            trail.style.transform = `translateX(${translateX}px) rotate(${rotate}deg)`;
        });
    }

    function handleScrollBreeze() {
        const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        
        elements.breezeTrails.forEach((trail, index) => {
            const offset = (index - 1) * 15;
            const translateX = scrollProgress * 100 + offset;
            trail.style.transform = `translateX(${translateX}px)`;
        });
    }

    // ========================================
    // SCENT NOTES - Interactive Icons
    // ========================================
    function initScentGame() {
        if (!elements.scentNotes.length) return;

        elements.scentNotes.forEach(note => {
            note.addEventListener('click', handleNoteClick);
        });
    }

    function handleNoteClick(e) {
        const note = e.currentTarget;
        
        // Toggle collected state
        if (note.classList.contains('collected')) {
            note.classList.remove('collected');
            state.collectedNotes--;
        } else {
            note.classList.add('collected');
            state.collectedNotes++;
        }

        // Check if all notes collected - add glow to CTA
        if (state.collectedNotes >= state.totalNotes) {
            if (elements.ctaButton) {
                elements.ctaButton.classList.add('glow-active');
            }
        } else {
            if (elements.ctaButton) {
                elements.ctaButton.classList.remove('glow-active');
            }
        }
    }

    // ========================================
    // ACCORDION FAQ
    // ========================================
    function initAccordion() {
        if (!elements.accordionItems.length) return;

        elements.accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            if (header) {
                header.addEventListener('click', () => {
                    toggleAccordion(item);
                });
            }
        });
    }

    function toggleAccordion(clickedItem) {
        const isActive = clickedItem.classList.contains('active');
        
        // Close all accordion items
        elements.accordionItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // If clicked item wasn't active, open it
        if (!isActive) {
            clickedItem.classList.add('active');
        }
    }

    // ========================================
    // TOAST MODAL
    // ========================================
    function showToast() {
        if (!elements.toastModal || !elements.toastBackdrop) return;

        elements.toastBackdrop.classList.add('active');
        elements.toastModal.classList.add('active');

        // Auto-close after 5 seconds
        state.toastTimeout = setTimeout(hideToast, 5000);
    }

    function hideToast() {
        if (!elements.toastModal || !elements.toastBackdrop) return;

        elements.toastBackdrop.classList.remove('active');
        elements.toastModal.classList.remove('active');

        if (state.toastTimeout) {
            clearTimeout(state.toastTimeout);
            state.toastTimeout = null;
        }
    }

    function initToast() {
        // CTA button shows toast (no redirect)
        if (elements.ctaButton) {
            elements.ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                showToast();
            });
        }

        // Close button
        if (elements.toastClose) {
            elements.toastClose.addEventListener('click', hideToast);
        }

        // Click backdrop to close
        if (elements.toastBackdrop) {
            elements.toastBackdrop.addEventListener('click', hideToast);
        }

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.toastModal?.classList.contains('active')) {
                hideToast();
            }
        });
    }

    // ========================================
    // SECTION FADE-IN ANIMATIONS
    // ========================================
    function initSectionAnimations() {
        const sections = document.querySelectorAll('.features-section, .description-section, .about-demo-section, .policy-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        sections.forEach(section => {
            section.classList.add('fade-section');
            observer.observe(section);
        });
    }

    // ========================================
    // TYPEWRITER EFFECT FOR "عن العطر" SECTION
    // ========================================
    function initTypewriterEffect() {
        const typewriterElement = document.getElementById('typewriterText');
        if (!typewriterElement) return;

        const fullText = typewriterElement.getAttribute('data-text');
        if (!fullText) return;

        const cursor = typewriterElement.querySelector('.typewriter-cursor');
        let hasTyped = false;
        let charIndex = 0;
        let textSpan = null;

        function typeCharacter() {
            if (charIndex < fullText.length) {
                // Add character by character (RTL-safe: just append, CSS handles direction)
                textSpan.textContent = fullText.substring(0, charIndex + 1);
                charIndex++;
                // Variable speed for natural feel
                const speed = 25 + Math.random() * 20;
                setTimeout(typeCharacter, speed);
            } else {
                // Typing complete - hide cursor after short delay
                setTimeout(() => {
                    if (cursor) {
                        cursor.classList.add('hidden');
                    }
                }, 1500);
            }
        }

        function startTypewriter() {
            if (hasTyped) return;
            hasTyped = true;
            
            // Mark as typed in sessionStorage (only type once per visit)
            sessionStorage.setItem('waarfeTypewriterDone', 'true');
            
            // Create text span for the typed content
            textSpan = document.createElement('span');
            textSpan.className = 'typewriter-content';
            
            // Insert before cursor
            if (cursor) {
                typewriterElement.insertBefore(textSpan, cursor);
            } else {
                typewriterElement.appendChild(textSpan);
            }
            
            // Start typing
            typeCharacter();
        }

        // Check if already typed this session
        if (sessionStorage.getItem('waarfeTypewriterDone')) {
            // Show full text immediately
            const textSpanImmediate = document.createElement('span');
            textSpanImmediate.className = 'typewriter-content';
            textSpanImmediate.textContent = fullText;
            if (cursor) {
                typewriterElement.insertBefore(textSpanImmediate, cursor);
                cursor.classList.add('hidden');
            } else {
                typewriterElement.appendChild(textSpanImmediate);
            }
            hasTyped = true;
            return;
        }

        // Use IntersectionObserver to trigger when section enters viewport
        const descriptionSection = document.getElementById('description');
        if (!descriptionSection) return;

        const typewriterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasTyped) {
                    // Small delay before starting
                    setTimeout(startTypewriter, 300);
                    // Stop observing after triggering
                    typewriterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });

        typewriterObserver.observe(descriptionSection);
    }

    // ========================================
    // PARALLAX EFFECTS
    // ========================================
    function handleParallax() {
        const scrollY = window.scrollY;
        const shapes = document.querySelectorAll('.organic-shape');
        
        shapes.forEach((shape, index) => {
            const speed = 0.05 * (index + 1);
            const yOffset = scrollY * speed;
            shape.style.transform = `translateY(${yOffset}px)`;
        });
    }

    // ========================================
    // BOTTLE FLOAT ANIMATION - Keep bottle steady/fixed
    // ========================================
    function initBottleFloat() {
        // Bottle stays steady with only CSS idle float animation
        // No mouse parallax or scroll effects that move position
        // The bottle has a gentle CSS float animation only
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================
    function initEventListeners() {
        // Scroll events
        let scrollTicking = false;
        window.addEventListener('scroll', () => {
            if (!scrollTicking) {
                requestAnimationFrame(() => {
                    handleScrollZoom();
                    handleParallax();
                    
                    // Breeze on scroll for mobile
                    if (window.innerWidth < 768) {
                        handleScrollBreeze();
                    }
                    
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        });

        // Mouse move for breeze on desktop
        if (window.innerWidth >= 768) {
            window.addEventListener('mousemove', (e) => {
                state.mouseX = e.clientX;
                state.mouseY = e.clientY;
                handleBreeze(e);
            });
        }
    }

    // ========================================
    // INITIALIZE
    // ========================================
    function init() {
        // Start cinematic intro
        initCinematicIntro();
        
        // Initialize particles
        initParticles();
        
        // Initialize scent notes interaction
        initScentGame();
        
        // Initialize accordion FAQ
        initAccordion();
        
        // Initialize toast modal
        initToast();
        
        // Initialize section animations
        initSectionAnimations();
        
        // Initialize typewriter effect for "عن العطر" section
        initTypewriterEffect();
        
        // Initialize bottle float / parallax (now minimal - bottle stays steady)
        initBottleFloat();
        
        // Initialize event listeners
        initEventListeners();
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
