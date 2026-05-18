/* ==========================================================================
   NS PERERA COMPANY - Interaction & Animation Script
   Implements professional interactive behaviors, custom sliders & observers
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
       1. Sticky Header Transformation
       -------------------------------------------------------------------------- */
    const mainHeader = document.querySelector('.main-header');
    
    const handleScrollHeader = () => {
        if (window.scrollY > 80) {
            mainHeader.classList.add('is-sticky');
        } else {
            mainHeader.classList.remove('is-sticky');
        }
    };
    
    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader(); // Initialize on load


    /* --------------------------------------------------------------------------
       2. Mobile Navigation Panel
       -------------------------------------------------------------------------- */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const mobileNavMenu = document.getElementById('mobileNavMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMobileMenu = (forceClose = false) => {
        if (forceClose || mobileNavMenu.classList.contains('active')) {
            mobileNavMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            mobileNavMenu.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    mobileMenuBtn.addEventListener('click', () => toggleMobileMenu());
    mobileCloseBtn.addEventListener('click', () => toggleMobileMenu(true));
    mobileOverlay.addEventListener('click', () => toggleMobileMenu(true));
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => toggleMobileMenu(true));
    });


    /* --------------------------------------------------------------------------
       3. Hero Swiper Slider
       -------------------------------------------------------------------------- */
    const slides = document.querySelectorAll('.slider-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('slidePrevBtn');
    const nextBtn = document.getElementById('slideNextBtn');
    
    let currentSlide = 0;
    let sliderInterval = null;
    const slideDuration = 6000; // 6 seconds per slide

    const showSlide = (index) => {
        // Handle circular bounds
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        // Toggle active states for slides
        slides.forEach((slide, idx) => {
            if (idx === currentSlide) {
                slide.classList.add('active');
                
                // Re-trigger inside animations by resetting their element classes
                const anims = slide.querySelectorAll('.wd-animation-slide-from-bottom');
                anims.forEach(anim => {
                    anim.style.animation = 'none';
                    // Trigger reflow to restart CSS animation
                    void anim.offsetWidth;
                    anim.style.animation = '';
                });
            } else {
                slide.classList.remove('active');
            }
        });

        // Toggle active states for indicator dots
        dots.forEach((dot, idx) => {
            if (idx === currentSlide) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    };

    const nextSlide = () => showSlide(currentSlide + 1);
    const prevSlide = () => showSlide(currentSlide - 1);

    const startAutoplay = () => {
        stopAutoplay();
        sliderInterval = setInterval(nextSlide, slideDuration);
    };

    const stopAutoplay = () => {
        if (sliderInterval) clearInterval(sliderInterval);
    };

    // Nav click handlers
    nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoplay(); // Reset timer
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoplay(); // Reset timer
    });

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            showSlide(idx);
            startAutoplay(); // Reset timer
        });
    });

    // Start autoplay cycle
    startAutoplay();


    /* --------------------------------------------------------------------------
       4. Intersection Observer: Entry Scroll Animations
       -------------------------------------------------------------------------- */
    const animatedElements = document.querySelectorAll('.scroll-animate');

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, {
        threshold: 0.15
    });

    animatedElements.forEach(elem => scrollObserver.observe(elem));


    /* --------------------------------------------------------------------------
       5. Stats Counter Count-Up Animation
       -------------------------------------------------------------------------- */
    const counters = document.querySelectorAll('.counter-num');
    const counterDuration = 2000; // 2 seconds duration

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        let start = 0;
        const stepTime = Math.max(Math.floor(counterDuration / target), 15);
        
        const timer = setInterval(() => {
            start += Math.ceil(target / (counterDuration / stepTime));
            if (start >= target) {
                counter.innerText = target + (target === 15 ? '+' : (target === 100 ? '%' : '+'));
                
                // Specific corrections for clients (100+) and experience (15+)
                if (target === 15) {
                    // Check if it is experience or sectors
                    const cardTitle = counter.nextElementSibling.innerText;
                    if (cardTitle.includes('EXPERIENCE') || cardTitle.includes('SECTORS')) {
                        counter.innerText = '15+';
                    }
                } else if (target === 100) {
                    const cardTitle = counter.nextElementSibling.innerText;
                    if (cardTitle.includes('CONFIDENTIALITY')) {
                        counter.innerText = '100%';
                    } else if (cardTitle.includes('CLIENTS')) {
                        counter.innerText = '100+';
                    }
                }
                
                clearInterval(timer);
            } else {
                counter.innerText = start;
            }
        }, stepTime);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target); // Run once
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => counterObserver.observe(counter));


    /* --------------------------------------------------------------------------
       6. Progress Bars Loading Animation
       -------------------------------------------------------------------------- */
    const progressFills = document.querySelectorAll('.progress-bar-fill');

    const progressObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const widthValue = fill.getAttribute('data-width');
                fill.style.width = widthValue + '%';
                observer.unobserve(fill); // Run once
            }
        });
    }, {
        threshold: 0.5
    });

    progressFills.forEach(fill => progressObserver.observe(fill));


    /* --------------------------------------------------------------------------
       7. TrustIndex Google Reviews Replica Slider
       -------------------------------------------------------------------------- */
    const reviewsWrapper = document.getElementById('reviewsWrapper');
    const reviewItems = document.querySelectorAll('.review-item');
    const revDots = document.querySelectorAll('.rev-dot');
    const revPrevBtn = document.getElementById('revPrevBtn');
    const revNextBtn = document.getElementById('revNextBtn');
    
    let currentReviewIndex = 0;
    let itemsPerView = window.innerWidth > 1024 ? 2 : 1;

    const getSlideCount = () => {
        return Math.ceil(reviewItems.length / itemsPerView);
    };

    const updateReviewsDots = () => {
        // Redraw dot pointers dynamically depending on mobile/desktop frames
        const slideCount = getSlideCount();
        let dotsHTML = '';
        for (let i = 0; i < slideCount; i++) {
            dotsHTML += `<span class="rev-dot ${i === currentReviewIndex ? 'active' : ''}" data-slide="${i}"></span>`;
        }
        document.getElementById('reviewsDots').innerHTML = dotsHTML;
        
        // Re-bind click event to dynamic dots
        const newDots = document.querySelectorAll('.rev-dot');
        newDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                currentReviewIndex = parseInt(e.target.getAttribute('data-slide'), 10);
                scrollReviews();
            });
        });
    };

    const scrollReviews = () => {
        const slideCount = getSlideCount();
        if (currentReviewIndex >= slideCount) currentReviewIndex = 0;
        else if (currentReviewIndex < 0) currentReviewIndex = slideCount - 1;

        // Calculate scrolling percentage
        const moveAmount = currentReviewIndex * 100;
        reviewsWrapper.style.transform = `translateX(-${moveAmount / itemsPerView}%)`;
        
        // Active indicator update
        const dotsList = document.querySelectorAll('.rev-dot');
        dotsList.forEach((dot, idx) => {
            if (idx === currentReviewIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    };

    // Nav event triggers
    revNextBtn.addEventListener('click', () => {
        currentReviewIndex++;
        scrollReviews();
    });

    revPrevBtn.addEventListener('click', () => {
        currentReviewIndex--;
        scrollReviews();
    });

    // Window resize handler to switch between 1 and 2 items
    window.addEventListener('resize', () => {
        const oldItemsView = itemsPerView;
        itemsPerView = window.innerWidth > 1024 ? 2 : 1;
        
        if (oldItemsView !== itemsPerView) {
            currentReviewIndex = 0;
            updateReviewsDots();
            scrollReviews();
        }
    });

    // Initial setup for Reviews
    updateReviewsDots();
    scrollReviews();


    /* --------------------------------------------------------------------------
       8. Scroll Active Section Highlighting
       -------------------------------------------------------------------------- */
    const navSections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

    const highlightActiveNav = () => {
        const scrollPosition = window.scrollY + 150; // offset for sticky header

        navSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightActiveNav);
    highlightActiveNav(); // Initialize on load

});
