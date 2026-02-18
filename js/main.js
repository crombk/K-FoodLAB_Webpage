// K-FoodLAB Website JavaScript
// Interactive features and functionality

(function() {
    'use strict';
    
    // ============= Navigation ============= //
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Sticky navbar with scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavigation() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    
    // ============= Profit Calculator ============= //
    const bowlsSlider = document.getElementById('bowlsSlider');
    const bowlsValue = document.getElementById('bowlsValue');
    const dailyRevenue = document.getElementById('dailyRevenue');
    const dailyCost = document.getElementById('dailyCost');
    const dailyProfit = document.getElementById('dailyProfit');
    const monthlyProfit = document.getElementById('monthlyProfit');
    
    if (bowlsSlider) {
        // Constants from IR data
        const SELLING_PRICE = 14.80;  // AUD per bowl
        const COST_PER_BOWL = 6.43;   // AUD per bowl
        const PROFIT_PER_BOWL = 8.37; // AUD per bowl
        const DAYS_PER_MONTH = 30;
        
        function updateCalculator() {
            const bowls = parseInt(bowlsSlider.value);
            bowlsValue.textContent = bowls;
            
            // Calculate values
            const revenue = bowls * SELLING_PRICE;
            const cost = bowls * COST_PER_BOWL;
            const profit = bowls * PROFIT_PER_BOWL;
            const monthly = profit * DAYS_PER_MONTH;
            
            // Update display
            dailyRevenue.textContent = `$${revenue.toFixed(0)}`;
            dailyCost.textContent = `$${cost.toFixed(0)}`;
            dailyProfit.textContent = `$${profit.toFixed(0)}`;
            monthlyProfit.textContent = `$${monthly.toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;
        }
        
        bowlsSlider.addEventListener('input', updateCalculator);
        
        // Initialize on page load
        updateCalculator();
    }
    
    // ============= FAQ Accordion ============= //
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all other FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current FAQ
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
    
    // Guide page accordion (if exists)
    const accordionQuestions = document.querySelectorAll('.accordion-question');
    
    accordionQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const accordionItem = question.parentElement;
            const isActive = accordionItem.classList.contains('active');
            
            // Close all other accordions
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current accordion
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });
    
    // ============= Contact Form ============= //
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const businessType = formData.get('businessType');
            
            if (!name || !email || !businessType) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Prepare mailto link (temporary solution)
            const subject = encodeURIComponent(`K-FoodLAB Partnership Inquiry - ${name}`);
            const body = encodeURIComponent(`
Name: ${name}
Email: ${email}
Business Name: ${formData.get('businessName') || 'N/A'}
Business Type: ${businessType}
Location: ${formData.get('location') || 'N/A'}
Available Space: ${formData.get('spaceSize') || 'N/A'} sqm
Expected Start: ${formData.get('expectedStart') || 'N/A'}

Message:
${formData.get('message') || 'N/A'}
            `.trim());
            
            // Open mailto link
            window.location.href = `mailto:kidd.lee@allincarbon.com?subject=${subject}&body=${body}`;
            
            // Show success message
            showNotification('Opening your email client... Please send the email to complete your inquiry.', 'success');
            
            // Reset form after 2 seconds
            setTimeout(() => {
                contactForm.reset();
            }, 2000);
        });
    }
    
    // ============= Notification System ============= //
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: ${type === 'success' ? '#018C43' : type === 'error' ? '#E10204' : '#404040'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    // Add notification animations via style element
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .notification-content i {
                font-size: 1.25rem;
            }
        `;
        document.head.appendChild(style);
    }
    
    // ============= Scroll to Top Button ============= //
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ============= Scroll Animations ============= //
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections for animation
    document.querySelectorAll('.package-card, .channel-card, .comparison-card, .scenario-card, .trust-card, .brisbane-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
    
    // ============= Analytics Tracking (Placeholder) ============= //
    // TODO: Replace with actual Google Analytics 4 implementation
    function trackEvent(category, action, label) {
        console.log('Analytics Event:', { category, action, label });
        
        // When Google Analytics is configured, replace with:
        // gtag('event', action, {
        //     'event_category': category,
        //     'event_label': label
        // });
    }
    
    // Track button clicks
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const buttonText = e.target.textContent.trim();
            trackEvent('Button', 'Click', buttonText);
        });
    });
    
    // Track email clicks
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Contact', 'Email Click', link.href);
        });
    });
    
    // Track phone clicks (if any)
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Contact', 'Phone Click', link.href);
        });
    });
    
    // Track external links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.href.includes(window.location.hostname)) {
            link.addEventListener('click', () => {
                trackEvent('External Link', 'Click', link.href);
            });
        }
    });
    
    // ============= Lazy Loading Images ============= //
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ============= Print-friendly styling ============= //
    window.addEventListener('beforeprint', () => {
        document.body.classList.add('printing');
    });
    
    window.addEventListener('afterprint', () => {
        document.body.classList.remove('printing');
    });
    
    // ============= Initialize tooltips (if needed) ============= //
    // Can be extended with a tooltip library like Tippy.js
    
    // ============= Keyboard accessibility ============= //
    // Ensure keyboard navigation works properly
    document.addEventListener('keydown', (e) => {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // ============= Performance monitoring ============= //
    window.addEventListener('load', () => {
        // Log page load time
        if (window.performance) {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
            
            // Track in analytics (when configured)
            trackEvent('Performance', 'Page Load Time', `${loadTime}ms`);
        }
    });
    
    // ============= Browser compatibility warnings ============= //
    function checkBrowserCompatibility() {
        const ua = navigator.userAgent;
        let browserName = 'Unknown';
        
        if (ua.includes('Firefox')) browserName = 'Firefox';
        else if (ua.includes('Chrome')) browserName = 'Chrome';
        else if (ua.includes('Safari')) browserName = 'Safari';
        else if (ua.includes('Edge')) browserName = 'Edge';
        else if (ua.includes('MSIE') || ua.includes('Trident')) {
            showNotification('Your browser is outdated. For the best experience, please use a modern browser like Chrome, Firefox, or Edge.', 'error');
        }
        
        console.log('Browser:', browserName);
    }
    
    checkBrowserCompatibility();
    
    // ============= Initialize everything on DOM ready ============= //
    console.log('K-FoodLAB website initialized successfully!');
    
})();