document.addEventListener('DOMContentLoaded', () => {
    // --- Prestige Preloader Logic ---
    const preloader = document.getElementById('preloader');
    
    // Hide preloader after 2.5s (duration of animation) or when window loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            document.body.classList.remove('loading');
        }, 500);
    });

    // Fallback if load event takes too long
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('fade-out');
            document.body.classList.remove('loading');
        }
    }, 3000);

    // --- Custom Cursor Logic ---
    const cursor = document.querySelector('.custom-cursor');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Hover effect for interactive elements
    const interactives = document.querySelectorAll('a, button, .product-card, input, select, textarea');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // --- Mobile Menu Toggle ---
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.querySelectorAll('nav a');

    hamburger.addEventListener('click', () => {
        document.body.classList.toggle('nav-open');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('nav-open');
        });
    });

    // --- Theme Toggle Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Load saved theme
    const savedTheme = localStorage.getItem('alyra-theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('alyra-theme', newTheme);
    });

    // --- Reveal Animations using Intersection Observer ---
    const revealCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // --- Smooth Scroll ---
    document.querySelectorAll('nav a, .btn-gold').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = target.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- Pedidos Logic ---
    const orderSelect = document.getElementById('order-product');
    const orderSection = document.getElementById('pedidos');

    document.querySelectorAll('.btn-order').forEach(btn => {
        btn.addEventListener('click', () => {
            const product = btn.getAttribute('data-pode');
            if (orderSelect) orderSelect.value = product;
            
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = orderSection.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // --- Order Form Submission ---
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('order-name').value;
            const product = document.getElementById('order-product').value;
            const msg = document.getElementById('order-msg').value;

            // WhatsApp link generation
            const whatsappNumber = "5511942045555"; // Exemplo atualizado
            const text = `Olá Alyra! Meu nome é ${name}. Gostaria de solicitar uma reserva para o item: ${product}. %0A%0AObservação: ${msg}`;
            
            const wpUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${text}`;
            
            window.open(wpUrl, '_blank');
            
            alert('Sua solicitação de reserva foi enviada com sucesso! ✨');
            orderForm.reset();
        });
    }

    // --- Aesthetic Console Log ---
    console.log("%c ALYRA ", "color: #E8B4B8; font-size: 30px; font-family: 'Fleur De Leah', cursive; letter-spacing: 5px;");
    console.log("Coleção Delicée - Rose & Beige Edition");
});
