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

    if (chatToggle) {
        chatToggle.addEventListener('click', () => {
            chatContainer.classList.toggle('active');
            if (chatContainer.classList.contains('active') && chatMessages.children.length === 1) {
                // Initial welcome delay if first time opening
                setTimeout(() => {
                    if (chatMessages.children.length === 1) {
                        addChatMessage("Deseja ver nossos produtos mais desejados ou precisa de ajuda com uma reserva? ✨", 'ai', ['Ver Coleção', 'Onde Comprar', 'Dúvidas']);
                    }
                }, 1000);
            }
        });
    }
    if (closeChat) closeChat.addEventListener('click', () => chatContainer.classList.remove('active'));

    const addChatMessage = (content, sender, suggestions = []) => {
        if (!chatMessages) return;
        
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        
        if (typeof content === 'string') {
            msgDiv.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            msgDiv.appendChild(content);
        }
        
        chatMessages.appendChild(msgDiv);
        
        // Add suggestions if any
        if (suggestions && suggestions.length > 0) {
            const chipsDiv = document.createElement('div');
            chipsDiv.classList.add('suggestion-chips');
            suggestions.forEach(text => {
                const chip = document.createElement('button');
                chip.classList.add('chip');
                chip.textContent = text;
                chip.onclick = () => {
                    chatInput.value = text;
                    handleChat();
                };
                chipsDiv.appendChild(chip);
            });
            chatMessages.appendChild(chipsDiv);
        }
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const showTypingIndicator = () => {
        const indicator = document.createElement('div');
        indicator.classList.add('typing-indicator');
        indicator.id = 'chat-typing';
        indicator.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const hideTypingIndicator = () => {
        const indicator = document.getElementById('chat-typing');
        if (indicator) indicator.remove();
    };

    const getProductCard = (name) => {
        const price = products[name];
        if (!price) return null;
        
        // Map product names to images (simplistic mapping based on the known img/ paths)
        const imgMap = {
            "Coleção Alyra": "img/Coleçao.png",
            "Paleta Pétalas": "img/Paleta.png",
            "Delineador": "img/Deliniador.png",
            "Hidratante": "img/Hidratante.png",
            "Blush": "img/Blush.png",
            "Iluminador Éclat": "img/Iluminador.png",
            "Batom Matte Rose": "img/Batom.png",
            "Rímel": "img/Rimel.png",
            "Sérum de Pérolas": "img/Serum.png",
            "Pó de Seda": "img/Po.png",
            "Pincel de Cristal": "img/Pincel.png",
            "Bruma de Ouro": "img/Bruma.png",
            "Gloss de Diamante": "img/gloss1.png",
            "Fixador de Maquiagem": "img/Fixador de Maquiagem.png",
            "Demaquilante Bifásico": "img/Demaquilante Bifásico.png",
            "Paleta de Contorno Palais": "img/Paleta de Contorno Palais.png",
            "Kit de Pincéis de Ouro": "img/Kit de Pincéis de Ouro.png",
            "Sombra Líquida Aurora": "img/Sombra Líquida Aurora.png",
            "Lip Tint Cereja": "img/Lip Tint Cereja.png",
            "Corretivo Iluminador": "img/Corretivo Iluminador.png",
            "Base Hidra-Glow": "img/base Hidra.png",
            "Lápis de Sobrancelha": "img/Lápis de Sobrancelha.png",
            "Espelho de Cristal": "img/Espelho de Cristal.png",
            "Bolsa de Viagem Alyra": "img/Bolsa.png"
        };
        
        const card = document.createElement('div');
        card.classList.add('chat-product-card');
        card.innerHTML = `
            <img src="${imgMap[name] || 'img/Coleçao.png'}" class="chat-product-img" alt="${name}">
            <div class="chat-product-info">
                <h4>${name}</h4>
                <div class="chat-product-price">R$ ${price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
            </div>
        `;
        return card;
    };

    const handleChat = () => {
        const text = chatInput.value.trim();
        if (text) {
            addChatMessage(text, 'user');
            chatInput.value = '';
            
            showTypingIndicator();
            
            setTimeout(() => {
                hideTypingIndicator();
                
                let response = "Que escolha maravilhosa! ✨ Posso te ajudar com mais detalhes sobre a Alyra?";
                let suggestions = ['Ver Preços', 'Fazer Reserva', 'Falar com Consultor'];
                const lowerText = text.toLowerCase();
                
                // Response Logic
                if (lowerText.includes('preço') || lowerText.includes('valor') || lowerText.includes('quanto custa')) {
                    response = "Nossos itens da <strong>Coleção Delicée</strong> são exclusivos. Os valores variam de R$ 95,00 a R$ 3.500,00 para a curadoria completa. Deseja ver algum item específico?";
                    suggestions = ['Batom Matte', 'Paleta Pétalas', 'Coleção Completa'];
                } 
                else if (lowerText.includes('batom') || lowerText.includes('rose')) {
                    response = "O <strong>Batom Matte Rose</strong> é um dos nossos favoritos! Ele combina pigmentação intensa com hidratação.";
                    const card = getProductCard("Batom Matte Rose");
                    if (card) addChatMessage(card, 'ai');
                    response += "<br><br>Gostaria de adicioná-lo à sua reserva?";
                    suggestions = ['Sim, Reservar', 'Ver outros', 'Voltar'];
                }
                else if (lowerText.includes('coleção') || lowerText.includes('completa')) {
                    response = "A <strong>Coleção Alyra</strong> é o nosso relicário mais luxuoso. Contém o ritual completo para sua beleza.";
                    const card = getProductCard("Coleção Alyra");
                    if (card) addChatMessage(card, 'ai');
                    response += "<br><br>É uma escolha impecável. Posso auxiliar no seu pedido?";
                    suggestions = ['Quero a Coleção', 'Ver Detalhes', 'Ajuda'];
                }
                else if (lowerText.includes('entrega') || lowerText.includes('prazo')) {
                    response = "Enviamos nossa elegância para todo o Brasil. O prazo médio é de 3 a 7 dias úteis. Gostaria de calcular para o seu CEP?";
                    suggestions = ['Como comprar?', 'Onde ficam?'];
                } 
                else if (lowerText.includes('pessoalmente') || lowerText.includes('loja') || lowerText.includes('localizacao') || lowerText.includes('onde')) {
                    response = "Adoraríamos recebê-la em nosso Palais na <strong>Av. Paulista, 2000</strong>. Lá você pode testar todas as nossas texturas!";
                    suggestions = ['Ver Mapa', 'Agendar Visita', 'Voltar'];
                } 
                else if (lowerText.includes('ajuda') || lowerText.includes('dúvidas') || lowerText.includes('como funciona')) {
                    response = "Estou aqui para guiar sua experiência Alyra. Posso mostrar produtos, explicar sobre o showroom ou ajudar no seu pedido de reserva. O que mais te interessa?";
                    suggestions = ['Ver Maquiagens', 'Showroom', 'Fazer Pedido'];
                }
                else if (lowerText.includes('reservar') || lowerText.includes('comprar') || lowerText.includes('pedido')) {
                    response = "Para garantir sua exclusividade, as reservas são feitas via formulário ou WhatsApp direto com nosso Concierge. Posso te levar até lá?";
                    suggestions = ['Ir para Pedidos', 'WhatsApp Direto', 'Dúvidas'];
                }
                else if (lowerText === 'ver coleção') {
                    response = "Nossa coleção é inspirada na leveza e sofisticação. Qual destes te atrai mais?";
                    suggestions = ['Paleta Pétalas', 'Hidratante', 'Sérum de Pérolas'];
                }

                addChatMessage(response, 'ai', suggestions);
                
                // If specific action triggers
                if (lowerText.includes('ir para pedidos') || lowerText.includes('fazer reserva')) {
                    document.querySelector('#pedidos').scrollIntoView({ behavior: 'smooth' });
                }
                if (lowerText.includes('ver mapa')) {
                    window.open('https://www.google.com/maps/search/?api=1&query=Av.+Paulista,+2000', '_blank');
                }
                if (lowerText.includes('whatsapp')) {
                    window.open('https://wa.me/5511942045555', '_blank');
                }

            }, 1500);
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
