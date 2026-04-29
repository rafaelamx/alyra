document.addEventListener('DOMContentLoaded', () => {
    // --- Prestige Preloader Logic ---
    const preloader = document.getElementById('preloader');
    
    // Hide preloader after 0.5s or when window loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('fade-out');
                document.body.classList.remove('loading');
            }
        }, 500);
    });

    // Fallback if load event takes too long
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('fade-out')) {
            preloader.classList.add('fade-out');
            document.body.classList.remove('loading');
        }
    }, 3000);

    // --- Custom Cursor Logic ---
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
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
    }

    // --- Mobile Menu Toggle ---
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.querySelectorAll('nav a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('nav-open');
        });
    });

    // --- Theme Toggle Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    if (themeToggle) {
        const savedTheme = localStorage.getItem('alyra-theme') || 'light';
        htmlElement.setAttribute('data-theme', savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('alyra-theme', newTheme);
        });
    }

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

    // --- Smooth Scroll & Order Button Logic ---
    document.querySelectorAll('nav a, .btn-gold').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href') || '#pedidos';
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

    // Prices for calculation
    const products = {
        "Coleção Alyra": 3200.00,
        "Paleta Pétalas": 315.00,
        "Delineador": 125.00,
        "Hidratante": 280.00,
        "Blush": 160.00,
        "Iluminador Éclat": 135.00,
        "Batom Matte Rose": 160.00,
        "Rímel": 100.00,
        "Sérum de Pérolas": 195.00,
        "Pó de Seda": 230.00,
        "Pincel de Cristal": 140.00,
        "Bruma de Ouro": 155.00,
        "Gloss de Diamante": 270.00,
        "Fixador de Maquiagem": 145.00,
        "Demaquilante Bifásico": 130.00,
        "Paleta de Contorno Palais": 260.00,
        "Kit de Pincéis de Ouro": 320.00,
        "Sombra Líquida Aurora": 190.00,
        "Lip Tint Cereja": 130.00,
        "Corretivo Iluminador": 230.00,
        "Base Hidra-Glow": 525.00,
        "Lápis de Sobrancelha": 95.00,
        "Espelho de Cristal": 305.00,
        "Bolsa de Viagem Alyra": 3500.00
    };

    // Handle "Fazer Pedido" buttons to scroll to form
    document.querySelectorAll('.btn-order').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productName = e.target.dataset.pode;
            const target = document.querySelector('#pedidos');
            if (target) {
                const select = document.querySelector('.product-select');
                if (select) select.value = productName;
                if (typeof calculateStaticTotal === 'function') calculateStaticTotal();

                const offset = 80;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = target.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // --- Static Order Form Handler ---
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        const calculateStaticTotal = () => {
            let total = 0;
            const rows = document.querySelectorAll('.product-selection-row');
            rows.forEach(row => {
                const product = row.querySelector('.product-select').value;
                const qty = parseInt(row.querySelector('.qty-input').value) || 0;
                if (products[product]) total += products[product] * qty;
            });
            const giftWrap = document.getElementById('order-gift-wrap');
            if (document.getElementById('order-is-gift').checked && giftWrap) {
                total += parseFloat(giftWrap.value) || 0;
            }
            const totalDisplay = document.getElementById('order-total-value');
            if (totalDisplay) totalDisplay.textContent = `R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        };

        window.calculateStaticTotal = calculateStaticTotal;

        const setupQty = (row) => {
            row.querySelector('.plus').onclick = () => { row.querySelector('.qty-input').value++; calculateStaticTotal(); };
            row.querySelector('.minus').onclick = () => { 
                if(row.querySelector('.qty-input').value > 1) {
                    row.querySelector('.qty-input').value--; 
                    calculateStaticTotal();
                }
            };
            row.querySelector('.product-select').onchange = calculateStaticTotal;
            row.querySelector('.remove-product').onclick = () => {
                if(document.querySelectorAll('.product-selection-row').length > 1) {
                    row.remove();
                    calculateStaticTotal();
                }
            };
        };

        const giftCheckbox = document.getElementById('order-is-gift');
        const giftSelection = document.getElementById('order-gift-selection');
        if (giftCheckbox) {
            giftCheckbox.addEventListener('change', () => {
                giftSelection.style.display = giftCheckbox.checked ? 'block' : 'none';
                calculateStaticTotal();
            });
        }
        const giftWrap = document.getElementById('order-gift-wrap');
        if (giftWrap) giftWrap.onchange = calculateStaticTotal;

        document.querySelectorAll('.product-selection-row').forEach(setupQty);
        const addBtn = document.getElementById('add-product-btn');
        if (addBtn) {
            addBtn.onclick = () => {
                const container = document.getElementById('product-list-container');
                const firstRow = container.querySelector('.product-selection-row');
                const newRow = firstRow.cloneNode(true);
                newRow.querySelector('.product-select').value = "";
                newRow.querySelector('.qty-input').value = 1;
                container.appendChild(newRow);
                setupQty(newRow);
                calculateStaticTotal();
            };
        }

        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('order-name').value;
            const phone = document.getElementById('order-phone').value;
            const email = document.getElementById('order-email').value;
            const cep = document.getElementById('order-cep').value;
            const address = document.getElementById('order-address').value;
            const msg = document.getElementById('order-msg').value;

            let productsList = "";
            document.querySelectorAll('.product-selection-row').forEach(row => {
                const product = row.querySelector('.product-select').value;
                const quantity = row.querySelector('.qty-input').value;
                if (product) productsList += `- ${product} (${quantity}x)%0A`;
            });

            if (!productsList) {
                alert('Por favor, selecione ao menos um produto.');
                return;
            }

            const isGift = document.getElementById('order-is-gift').checked;
            const giftText = isGift ? `%0A*Presente:* Sim (Embalagem: ${document.getElementById('order-gift-wrap').options[document.getElementById('order-gift-wrap').selectedIndex].text})` : "";
            
            const whatsappNumber = "5511942045555";
            const text = `Olá Alyra! ✨%0A%0A*Nova Reserva:*%0A*Nome:* ${name}%0A*Telefone:* ${phone}%0A*E-mail:* ${email}%0A*CEP:* ${cep}%0A*Endereço:* ${address}%0A%0A*Produtos:*%0A${productsList}${giftText}%0A%0A*Informações Adicionais:* ${msg}`;
            
            window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${text}`, '_blank');
            alert('Sua solicitação foi enviada com sucesso! ✨');
            orderForm.reset();
            if (giftSelection) giftSelection.style.display = 'none';
            calculateStaticTotal();
        });
    }

    // --- AI Chat Logic ---
    const chatToggle = document.getElementById('chat-toggle');
    const closeChat = document.getElementById('close-chat');
    const chatContainer = document.getElementById('ai-chat-container');
    const chatInput = document.getElementById('chat-input');
    const sendChat = document.getElementById('send-chat');
    const chatMessages = document.getElementById('chat-messages');

    if (chatToggle) chatToggle.addEventListener('click', () => chatContainer.classList.toggle('active'));
    if (closeChat) closeChat.addEventListener('click', () => chatContainer.classList.remove('active'));

    const addChatMessage = (text, sender) => {
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const handleChat = () => {
        const text = chatInput.value.trim();
        if (text) {
            addChatMessage(text, 'user');
            chatInput.value = '';
            setTimeout(() => {
                let response = "Olá! 👋 Sou a assistente virtual da Alyra. Como posso tornar seu dia mais especial hoje?";
                const lowerText = text.toLowerCase();
                if (lowerText.includes('preço') || lowerText.includes('valor')) {
                    response = "Nossos itens são exclusivos e os valores variam. Você pode ver todos os preços agora mesmo em nosso catálogo!";
                } else if (lowerText.includes('entrega') || lowerText.includes('prazo')) {
                    response = "Realizamos entregas exclusivas em todo o Brasil. O prazo varia de 3 a 7 dias úteis após a confirmação da reserva.";
                } else if (lowerText.includes('pessoalmente') || lowerText.includes('loja') || lowerText.includes('localizacao')) {
                    response = "Será um prazer recebê-la! Nosso showroom fica na Av. Paulista, 2000. Você pode ver mais detalhes na seção 'O Nosso Palais' no final da página.";
                } else if (lowerText.includes('ajuda') || lowerText.includes('como funciona')) {
                    response = "Eu sou a IA da Alyra! Posso te ajudar a encontrar produtos, tirar dúvidas sobre entregas ou auxiliar no seu pedido. O que deseja saber?";
                }
                addChatMessage(response, 'ai');
            }, 1000);
        }
    };

    if (sendChat) sendChat.addEventListener('click', handleChat);
    if (chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleChat(); });

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const msg = document.getElementById('contact-message').value;
            const text = `Olá Alyra! ✨%0A%0A*Nova Mensagem de Contato:*%0A*Nome:* ${name}%0A*Email:* ${email}%0A%0A*Mensagem:* ${msg}`;
            window.open(`https://api.whatsapp.com/send?phone=5511942045555&text=${text}`, '_blank');
            alert('Sua mensagem foi enviada! ✨');
            contactForm.reset();
        });
    }

    console.log("%c ALYRA ", "color: #E8B4B8; font-size: 30px; font-family: 'Fleur De Leah', cursive; letter-spacing: 5px;");
    console.log("Coleção Delicée - Rose & Beige Edition");
});
