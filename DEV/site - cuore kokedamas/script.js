document.addEventListener('DOMContentLoaded', () => {
    // WhatsApp Buy logic
    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.target.closest('.product-card');
            const name = card.querySelector('.product-name').innerText;
            const price = card.querySelector('.product-price').innerText;
            
            const message = `Olá! Gostaria de encomendar a kokedama ${name} no valor de ${price}. Poderia me passar mais informações?`;
            const encodedMessage = encodeURIComponent(message);
            
            // Subsitute with the actual number when ready
            const whatsappNumber = "5511999999999"; 
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            window.open(whatsappUrl, '_blank');
        });
    });

    // General WhatsApp CTA
    const ctaButton = document.querySelector('.btn-secondary');
    if(ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            const message = `Olá! Gostaria de uma kokedama personalizada. Poderia me ajudar?`;
            const encodedMessage = encodeURIComponent(message);
            const whatsappNumber = "5511999999999"; 
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach((el, index) => {
        // Add staggered delay for grid items
        if(el.classList.contains('product-card')) {
            el.style.transitionDelay = `${index * 100}ms`;
        }
        observer.observe(el);
    });
});
