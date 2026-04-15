document.addEventListener('DOMContentLoaded', () => {
    // 1. Header scroll effect & Active State Logic
    const header = document.getElementById('header');
    
    let path = window.location.pathname;
    let fn = path.split('/').pop();
    let isHomePage = (fn === 'index.html' || fn === '' || fn === 'home');
    
    if (!isHomePage) {
        header.classList.add('scrolled');
    }
    
    window.addEventListener('scroll', () => {
        if (isHomePage && window.scrollY <= 50) {
            header.classList.remove('scrolled');
        } else {
            header.classList.add('scrolled');
        }
    });

    const sections = document.querySelectorAll('section');
    const allNavLinks = document.querySelectorAll('.nav-links a');

    function updateActiveMenu() {
        let current = '';
        if (isHomePage) {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= (sectionTop - sectionHeight / 3)) {
                    current = section.getAttribute('id');
                }
            });
            if (!current) current = 'index'; 
        } else {
            current = fn ? fn.replace('.html', '') : 'index';
        }

        if (current === 'home') current = 'index';

        allNavLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href) {
                if (current === 'index' && (href === 'index.html' || href === '#home')) {
                    link.classList.add('active');
                } else if (current !== 'index' && href.includes(current)) {
                    link.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveMenu);
    updateActiveMenu(); // Run immediately on load

    // 2. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        links.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // 3. Scroll Reveal Animations using Intersection Observer
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Unobserve after animating if you only want it to happen once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // 4. Copy Email to Clipboard
    const copyBtn = document.getElementById('copy-email-btn');
    if (copyBtn) {
        const spanText = copyBtn.querySelector('span');
        let isCopied = false;

        copyBtn.addEventListener('mouseenter', () => {
            if (!isCopied) spanText.innerText = 'Copy Email';
        });

        copyBtn.addEventListener('mouseleave', () => {
            if (!isCopied) spanText.innerText = 'Email';
        });

        copyBtn.addEventListener('click', () => {
            const emailToCopy = copyBtn.getAttribute('data-email');
            
            navigator.clipboard.writeText(emailToCopy).then(() => {
                isCopied = true;
                spanText.innerText = 'Copied!';
                copyBtn.style.backgroundColor = 'var(--color-crimson)';
                copyBtn.style.color = 'white';
                copyBtn.style.borderColor = 'var(--color-crimson)';
                
                setTimeout(() => {
                    isCopied = false;
                    // Reset to hover state if mouse is still technically over it
                    spanText.innerText = copyBtn.matches(':hover') ? 'Copy Email' : 'Email';
                    copyBtn.style.backgroundColor = '';
                    copyBtn.style.color = '';
                    copyBtn.style.borderColor = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Could not copy email to clipboard. Please copy manually: ' + emailToCopy);
            });
        });
    }
});

    // 5. Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxContent = document.getElementById('lightbox-content');
        const lightboxClose = document.querySelector('.lightbox-close');
        
        // Find all clickable media items
        const mediaItems = document.querySelectorAll('.media-thumbnail, .gallery-item');
        
        mediaItems.forEach(item => {
            item.addEventListener('click', () => {
                const type = item.getAttribute('data-type') || 'image'; // default to image
                const src = item.getAttribute('data-src');
                
                if (!src) return; // if no source, do nothing

                lightboxContent.innerHTML = ''; // clear previous content

                if (type === 'video') {
                    const iframe = document.createElement('iframe');
                    // Ensure youtu.be links are converted to embed format so they work in iframes
                    let finalSrc = src;
                    if (finalSrc.includes('youtu.be/')) {
                        finalSrc = finalSrc.replace('youtu.be/', 'www.youtube.com/embed/');
                    }
                    iframe.src = finalSrc;
                    iframe.setAttribute('width', '560');
                    iframe.setAttribute('height', '315');
                    iframe.setAttribute('title', 'YouTube video player');
                    iframe.setAttribute('frameborder', '0');
                    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                    iframe.setAttribute('allowfullscreen', 'true');
                    lightboxContent.appendChild(iframe);
                } else {
                    const img = document.createElement('img');
                    img.src = src;
                    lightboxContent.appendChild(img);
                }

                lightbox.classList.add('show');
                document.body.style.overflow = 'hidden'; // prevent background scrolling
            });
        });

        // Close logic
        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.style.overflow = '';
            // Delay clearing content so animation finishes
            setTimeout(() => {
                lightboxContent.innerHTML = ''; 
            }, 300);
        };

        lightboxClose.addEventListener('click', closeLightbox);
        
        // Click outside content to close
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('show')) {
                closeLightbox();
            }
        });
    }

    // 6. Gallery Carousel Logic
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const leftBtn = document.querySelector('.carousel-btn.left');
    const rightBtn = document.querySelector('.carousel-btn.right');

    if (carouselWrapper && leftBtn && rightBtn) {
        let autoScrollInterval;

        // Auto-scroll logic (Infinite loop using duplicated content)
        const startAutoScroll = () => {
            if (autoScrollInterval) clearInterval(autoScrollInterval);
            autoScrollInterval = setInterval(() => {
                // If scrolled past the first set, jump seamlessly back to the beginning
                if (carouselWrapper.scrollLeft >= carouselWrapper.scrollWidth / 2) {
                    carouselWrapper.scrollLeft = 0;
                } else {
                    carouselWrapper.scrollLeft += 1;
                }
            }, 20); // 20ms for smooth linear scroll
        };

        const stopAutoScroll = () => {
            if (autoScrollInterval) clearInterval(autoScrollInterval);
        };

        // Start initially
        startAutoScroll();

        // Pause on hover over the carousel or buttons
        carouselWrapper.addEventListener('mouseenter', stopAutoScroll);
        carouselWrapper.addEventListener('mouseleave', startAutoScroll);
        rightBtn.addEventListener('mouseenter', stopAutoScroll);
        rightBtn.addEventListener('mouseleave', startAutoScroll);
        leftBtn.addEventListener('mouseenter', stopAutoScroll);
        leftBtn.addEventListener('mouseleave', startAutoScroll);

        rightBtn.addEventListener('click', () => {
            stopAutoScroll(); // ensure it's stopped before smooth scroll
            const itemWidth = carouselWrapper.querySelector('.carousel-item').clientWidth + 15; // include gap
            carouselWrapper.scrollBy({ left: itemWidth, behavior: 'smooth' });
        });

        leftBtn.addEventListener('click', () => {
            stopAutoScroll();
            const itemWidth = carouselWrapper.querySelector('.carousel-item').clientWidth + 15;
            carouselWrapper.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        });
    }
