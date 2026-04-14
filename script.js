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
