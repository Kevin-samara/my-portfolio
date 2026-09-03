/* ==========================================================================
   Kevin Samara Saeed Wasef Portfolio - Vanilla JavaScript Functionality
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const header = document.querySelector('.header');
    const scrollProgress = document.getElementById('scrollProgress');
    const themeToggle = document.getElementById('themeToggle');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');
    const toastContainer = document.getElementById('toastContainer');
    const backToTop = document.getElementById('backToTop');
    const sections = document.querySelectorAll('section');

    // ==========================================================================
    // 1. Theme Configuration (Dark Mode Default)
    // ==========================================================================
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        
        // If no theme is saved, default to dark
        if (!savedTheme) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            updateThemeIcon('dark');
        } else {
            document.documentElement.setAttribute('data-theme', savedTheme);
            updateThemeIcon(savedTheme);
        }
    };

    const updateThemeIcon = (theme) => {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
            themeToggle.setAttribute('aria-label', 'Switch to light theme');
        } else {
            icon.className = 'fa-solid fa-moon';
            themeToggle.setAttribute('aria-label', 'Switch to dark theme');
        }
    };

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        showToast(`Theme switched to ${newTheme} mode!`, 'success');
    });

    // ==========================================================================
    // 2. Mobile Navigation Toggle Menu
    // ==========================================================================
    const toggleMobileMenu = () => {
        navMenu.classList.toggle('open');
        const isOpen = navMenu.classList.contains('open');
        const icon = mobileToggle.querySelector('i');
        
        if (isOpen) {
            icon.className = 'fa-solid fa-xmark';
            mobileToggle.setAttribute('aria-label', 'Close mobile menu');
        } else {
            icon.className = 'fa-solid fa-bars';
            mobileToggle.setAttribute('aria-label', 'Open mobile menu');
        }
    };

    mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Close mobile menu on clicking any navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // Close menu when clicking outside of the nav area
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && e.target !== mobileToggle) {
            toggleMobileMenu();
        }
    });

    // ==========================================================================
    // 3. Scroll Interactions & Navigation Highlights
    // ==========================================================================
    const handleScrollEffects = () => {
        const scrollPosition = window.scrollY;
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Navigation Header Background Shrink
        if (scrollPosition > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll Progress Bar Update
        if (windowHeight > 0) {
            const scrollPercent = (scrollPosition / windowHeight) * 100;
            scrollProgress.style.width = `${scrollPercent}%`;
        }

        // Back to Top Button Visibility
        if (scrollPosition > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.pointerEvents = 'auto';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.pointerEvents = 'none';
        }

        // Active Link Highlighting based on Scroll Viewport
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // Offset for sticky navbar height
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    };

    window.addEventListener('scroll', handleScrollEffects);

    // Smooth scroll for Back To Top Button
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==========================================================================
    // 4. Viewport Observer for Scroll Animations
    // ==========================================================================
    const initScrollAnimations = () => {
        const animationTargets = document.querySelectorAll(
            '.fade-in, .fade-in-up, .fade-in-left, .fade-in-right'
        );

        const observerOptions = {
            root: null, // viewport
            threshold: 0.1, // Trigger when 10% of element is visible
            rootMargin: '0px 0px -50px 0px' // Offset trigger point slightly
        };

        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, observerOptions);

        animationTargets.forEach(target => {
            animationObserver.observe(target);
        });
    };

    // ==========================================================================
    // 5. Contact Form Simulation & Toast Notifications
    // ==========================================================================
    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const iconClass = type === 'success' 
            ? 'fa-solid fa-circle-check' 
            : 'fa-solid fa-circle-exclamation';

        toast.innerHTML = `
            <i class="${iconClass} toast-icon"></i>
            <span class="toast-message">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger reflow to initiate smooth transition
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Automatically hide and remove toast after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400); // match CSS transition duration
        }, 4000);
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('formName').value.trim();
            const email = document.getElementById('formEmail').value.trim();
            const subject = document.getElementById('formSubject').value.trim();
            const message = document.getElementById('formMessage').value.trim();
            const submitBtn = document.getElementById('formSubmitBtn');

            if (!name || !email || !subject || !message) {
                showToast('Please fill out all required fields.', 'error');
                return;
            }

            // Disable button and show loading state
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span>Sending...</span>
                <i class="fa-solid fa-spinner fa-spin"></i>
            `;

            // Simulate server network latency (1.5 seconds)
            setTimeout(() => {
                showToast(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
                contactForm.reset();
                
                // Reset submit button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }, 1500);
        });
    }

    // ==========================================================================
    // 6. Initialization
    // ==========================================================================
    initTheme();
    handleScrollEffects(); // Trigger once on load to establish navbar & progress state
    initScrollAnimations();
});
