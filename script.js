// --- Mock Product Data ---
const products = [
    {
        id: 1,
        title: "Tibetan Singing Bowl Original",
        category: "meditacao",
        categoryLabel: "Meditação",
        price: 249.90,
        image: "assets/images/tibetan-bowl.png",
        badge: "Novo"
    },
    {
        id: 2,
        title: "Tapete de Yoga Eco PU Alinhamento",
        category: "yoga",
        categoryLabel: "Yoga",
        price: 329.00,
        image: "assets/images/yoga-mat-eco.png",
        badge: "Mais Vendido"
    },
    {
        id: 3,
        title: "Japamala 108 Contas Ametista",
        category: "meditacao",
        categoryLabel: "Meditação",
        price: 159.50,
        image: "assets/images/japamala-amethyst.png",
        badge: null
    },
    {
        id: 4,
        title: "Kit Cristais dos 7 Chakras",
        category: "cristais",
        categoryLabel: "Cristais",
        price: 89.90,
        image: "assets/images/chakra-crystals.png",
        badge: null
    },
    {
        id: 5,
        title: "Incensário Cascata Flor de Lótus",
        category: "esoterismo",
        categoryLabel: "Esoterismo",
        price: 119.90,
        image: "assets/images/lotus-incense.png",
        badge: "Novo"
    },
    {
        id: 6,
        title: "Zafu Almofada de Meditação",
        category: "meditacao",
        categoryLabel: "Meditação",
        price: 189.90,
        image: "assets/images/zafu-cushion.png",
        badge: null
    },
    {
        id: 7,
        title: "Oráculo da Lua Tarô",
        category: "esoterismo",
        categoryLabel: "Esoterismo",
        price: 145.00,
        image: "assets/images/tarot-oracle.png",
        badge: "Limitado"
    },
    {
        id: 8,
        title: "Bloco de Cortiça para Yoga",
        category: "yoga",
        categoryLabel: "Yoga",
        price: 65.00,
        image: "assets/images/yoga-cork-block.png",
        badge: null
    }
];

// --- State ---
let cart = [];

// --- DOM Elements ---
const productGrid = document.getElementById('product-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total-price');
const cartCountEls = document.querySelectorAll('.cart-count');
const toastContainer = document.getElementById('toast-container');
const navbar = document.querySelector('.navbar');
const tiltCard = document.querySelector('.tilt-card');
const glowCursor = document.getElementById('glow-cursor');

// --- Initialization ---
function init() {
    renderProducts(products);
    setupEventListeners();
    updateCartUI();
}

// --- Render Products ---
function renderProducts(productsToRender) {
    productGrid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const badgeHTML = product.badge ? `<span class="p-badge ${product.badge === 'Novo' ? 'b-new' : ''}">${product.badge}</span>` : '';
        
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
                <div class="product-badges">
                    ${badgeHTML}
                </div>
                <button class="product-action add-to-cart-btn" data-id="${product.id}">
                    <i class="ri-shopping-cart-2-line"></i>
                </button>
            </div>
            <div class="product-info">
                <div class="product-category">${product.categoryLabel}</div>
                <h3 class="product-title" title="${product.title}">${product.title}</h3>
                <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
            </div>
        `;
        productGrid.appendChild(card);
    });

    // Re-attach listeners to new buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            addToCart(id);
        });
    });
}

// --- Event Listeners ---
function setupEventListeners() {
    // Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const filter = e.target.dataset.filter;
            if (filter === 'all') {
                renderProducts(products);
            } else {
                const filtered = products.filter(p => p.category === filter);
                renderProducts(filtered);
            }
        });
    });

    // Cart Toggle
    cartBtn.addEventListener('click', () => {
        cartOverlay.classList.add('open');
    });
    
    closeCartBtn.addEventListener('click', () => {
        cartOverlay.classList.remove('open');
    });
    
    // Close cart when clicking outside drawer
    cartOverlay.addEventListener('click', (e) => {
        if(e.target === cartOverlay) {
            cartOverlay.classList.remove('open');
        }
    });

    // Navbar Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Custom Cursor
    if (window.innerWidth >= 1024) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            glowCursor.style.left = `${x}px`;
            glowCursor.style.top = `${y}px`;
            
            // Show only when moving on body to avoid weirdness
            glowCursor.style.opacity = '1';
        });
        
        document.addEventListener('mouseleave', () => {
            glowCursor.style.opacity = '0';
        });
    }

    // 3D Tilt Effect on Hero Card
    if (tiltCard) {
        tiltCard.addEventListener('mousemove', (e) => {
            const rect = tiltCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        tiltCard.addEventListener('mouseleave', () => {
            tiltCard.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
        });
    }
}

// --- Cart Logic ---
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    showToast(`Adicionado: ${product.title}`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

function updateCartUI() {
    // Update counters
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEls.forEach(el => el.textContent = totalItems);
    
    // Update items container
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-message">Seu carrinho está vazio. Divino momento para explorar.</div>';
    } else {
        cart.forEach(item => {
            const cartItemEl = document.createElement('div');
            cartItemEl.className = 'cart-item';
            cartItemEl.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="c-item-img">
                <div class="c-item-details">
                    <h4 class="c-item-title">${item.title}</h4>
                    <div class="c-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                    <div class="c-item-actions">
                        <button class="qty-btn minus" data-id="${item.id}">-</button>
                        <span class="item-qty">${item.quantity}</span>
                        <button class="qty-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}"><i class="ri-delete-bin-line"></i></button>
            `;
            cartItemsContainer.appendChild(cartItemEl);
        });
        
        // Add event listeners to new buttons
        cartItemsContainer.querySelectorAll('.plus').forEach(btn => {
            btn.addEventListener('click', (e) => updateQuantity(parseInt(e.currentTarget.dataset.id), 1));
        });
        cartItemsContainer.querySelectorAll('.minus').forEach(btn => {
            btn.addEventListener('click', (e) => updateQuantity(parseInt(e.currentTarget.dataset.id), -1));
        });
        cartItemsContainer.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => removeFromCart(parseInt(e.currentTarget.dataset.id)));
        });
    }
    
    // Update Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// --- Toast Notification ---
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <i class="ri-checkbox-circle-fill toast-icon"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after animation
    setTimeout(() => {
        toast.remove();
    }, 3500);
}

// Start
init();
