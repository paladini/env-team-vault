document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const body = document.body;
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            body.classList.toggle('mobile-menu-active');
        });
    }
    
    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            body.classList.remove('mobile-menu-active');
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Add active class to nav items on scroll
    const sections = document.querySelectorAll('section[id]');
    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.main-nav a[href*=' + sectionId + ']')?.classList.add('active');
            } else {
                document.querySelector('.main-nav a[href*=' + sectionId + ']')?.classList.remove('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavOnScroll);
    
    // Add animation on scroll
    const animateElements = document.querySelectorAll('.feature-card, .step, .use-case, .testimonial, .docs-card');
    
    function checkInView() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('in-view');
            }
        });
    }
    
    // Initial check on page load
    checkInView();
    
    // Check on scroll
    window.addEventListener('scroll', checkInView);
});