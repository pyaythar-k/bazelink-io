// Main JavaScript for Bazelink Website

document.addEventListener('DOMContentLoaded', function() {
    // Theme Switcher
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Function to check if it's nighttime (between 6 PM and 6 AM)
    function isNightTime() {
        const currentHour = new Date().getHours();
        return currentHour >= 18 || currentHour < 6;
    }
    
    // Function to determine theme based on time and system preference
    function getPreferredTheme() {
        // First check for saved user preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        
        // If no saved preference, check system preference
        if (prefersDarkScheme.matches) {
            return 'dark';
        }
        
        // If no system preference, check time of day
        return isNightTime() ? 'dark' : 'light';
    }
    
    // Apply the theme
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            updateThemeIcon(true);
        } else {
            document.body.classList.remove('dark-theme');
            updateThemeIcon(false);
        }
    }
    
    // Initial theme application
    applyTheme(getPreferredTheme());
    
    // Listen for system preference changes
    prefersDarkScheme.addEventListener('change', function(e) {
        // Only apply if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
    
    // Set up automatic time-based theme switching
    function scheduleNextThemeUpdate() {
        const now = new Date();
        let nextUpdateTime;
        
        if (now.getHours() < 6) {
            // It's before 6 AM, next change is at 6 AM
            nextUpdateTime = new Date(now);
            nextUpdateTime.setHours(6, 0, 0, 0);
        } else if (now.getHours() < 18) {
            // It's before 6 PM, next change is at 6 PM
            nextUpdateTime = new Date(now);
            nextUpdateTime.setHours(18, 0, 0, 0);
        } else {
            // It's after 6 PM, next change is at 6 AM tomorrow
            nextUpdateTime = new Date(now);
            nextUpdateTime.setDate(now.getDate() + 1);
            nextUpdateTime.setHours(6, 0, 0, 0);
        }
        
        const timeUntilUpdate = nextUpdateTime - now;
        
        // Schedule the update
        setTimeout(function() {
            // Only update if user hasn't set a preference
            if (!localStorage.getItem('theme')) {
                applyTheme(isNightTime() ? 'dark' : 'light');
            }
            // Schedule the next update
            scheduleNextThemeUpdate();
        }, timeUntilUpdate);
    }
    
    // Start the automatic theme updating
    scheduleNextThemeUpdate();
    
    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDarkMode = document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            updateThemeIcon(isDarkMode);
        });
    }
    
    function updateThemeIcon(isDarkMode) {
        if (themeToggle) {
            themeToggle.innerHTML = isDarkMode 
                ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        }
    }
    
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
                
                // Scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Scroll Animation
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkIfInView() {
        const windowHeight = window.innerHeight;
        const windowTopPosition = window.scrollY;
        const windowBottomPosition = windowTopPosition + windowHeight;
        
        animateElements.forEach(element => {
            const elementHeight = element.offsetHeight;
            const elementTopPosition = element.offsetTop;
            const elementBottomPosition = elementTopPosition + elementHeight;
            
            // Check if element is in viewport
            if (
                (elementBottomPosition >= windowTopPosition) &&
                (elementTopPosition <= windowBottomPosition)
            ) {
                element.classList.add('animate-fade-in');
            }
        });
    }
    
    // Run on initial load
    checkIfInView();
    
    // Run on scroll
    window.addEventListener('scroll', checkIfInView);
    
    // Header Scroll Effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            header.classList.add('header--hidden');
        } else {
            // Scrolling up
            header.classList.remove('header--hidden');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Form Validation
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Email validation
            const emailField = contactForm.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                }
            }
            
            if (isValid) {
                // In a real implementation, this would send the form data
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
                
                // Simulate form submission
                setTimeout(() => {
                    contactForm.reset();
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'form-success';
                    successMessage.textContent = 'Thank you! Your message has been sent.';
                    contactForm.appendChild(successMessage);
                    
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                }, 1500);
            }
        });
        
        // Clear error state on input
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('error');
            });
        });
    }
});
