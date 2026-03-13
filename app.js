/**
 * Kawkab Al-Saada - Core Application Logic
 * Modern Digital Menu + Ordering System
 */

// --- Product Data ---
const menuData = {
    categories: [
        { id: 'waffle', name: 'وافل', image: 'https://images.unsplash.com/photo-1573821663912-6df460f9c684?auto=format&fit=crop&w=400&q=80' },
        { id: 'crepe', name: 'كريب', image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=400&q=80' },
        { id: 'ice-roll', name: 'آيس رول', image: 'https://images.unsplash.com/photo-1505394033323-4241bb217517?auto=format&fit=crop&w=400&q=80' },
        { id: 'milkshake', name: 'ميلك شيك', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80' },
        { id: 'coffee', name: 'قهوة', image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&w=400&q=80' }
    ],
    products: [
        // Waffle
        { id: 1, category: 'waffle', name: 'وافل نوتيلا', price: 65, image: 'https://images.unsplash.com/photo-1573821663912-6df460f9c684?auto=format&fit=crop&w=400&q=80', badge: 'Best Seller', options: ['صوص إضافي', 'فواكه'] },
        { id: 2, category: 'waffle', name: 'وافل لوتس', price: 70, image: 'https://images.unsplash.com/photo-1562329265-95a6d7a83440?auto=format&fit=crop&w=400&q=80', options: ['صوص كراميل', 'مكسرات'] },
        { id: 3, category: 'waffle', name: 'وافل ميكس صوص', price: 80, image: 'https://images.unsplash.com/photo-1459780248984-df7efed40772?auto=format&fit=crop&w=400&q=80', badge: 'Offer' },
        
        // Crepe
        { id: 4, category: 'crepe', name: 'كريب نوتيلا بالموز', price: 75, image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=400&q=80', badge: 'New' },
        { id: 5, category: 'crepe', name: 'كريب فواكه مشكلة', price: 85, image: 'https://images.unsplash.com/photo-1510629954389-c1e0da47d414?auto=format&fit=crop&w=400&q=80' },
        
        // Ice Roll
        { id: 6, category: 'ice-roll', name: 'آيس رول أوريو', price: 55, image: 'https://images.unsplash.com/photo-1505394033323-4241bb217517?auto=format&fit=crop&w=400&q=80' },
        { id: 7, category: 'ice-roll', name: 'آيس رول فانيليا توت', price: 50, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=400&q=80' },
        
        // Milkshake
        { id: 8, category: 'milkshake', name: 'ميلك شيك شوكولاتة', price: 45, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80' },
        { id: 9, category: 'milkshake', name: 'ميلك شيك فراولة بريميوم', price: 50, image: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?auto=format&fit=crop&w=400&q=80' },
        
        // Coffee
        { id: 10, category: 'coffee', name: 'لاتيه كراميل حار', price: 40, image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&w=400&q=80' }
    ],
    options: {
        'صوص إضافي': [
            { name: 'نوتيلا إضافية', price: 15 },
            { name: 'صوص لوتس', price: 20 },
            { name: 'كراميل', price: 10 }
        ],
        'فواكه': [
            { name: 'موز', price: 10 },
            { name: 'فراولة', price: 15 },
            { name: 'كيوي', price: 15 }
        ],
        'الحجم': [
            { name: 'صغير', price: 0 },
            { name: 'كبير', price: 20 }
        ]
    }
};

// --- State Management ---
let cart = JSON.parse(localStorage.getItem('kawkab_cart')) || [];
let activeProduct = null;
let currentTotalPrice = 0;

// --- DOM Elements ---
const elements = {
    categoriesList: document.getElementById('categories-list'),
    menuSections: document.getElementById('menu-sections'),
    stickyCats: document.getElementById('sticky-cats'),
    searchOverlay: document.getElementById('search-overlay'),
    searchInput: document.getElementById('global-search'),
    searchResults: document.getElementById('search-results'),
    cartSidebar: document.getElementById('slide-cart'),
    cartItems: document.getElementById('cart-items-container'),
    cartTotal: document.getElementById('cart-total'),
    cartCount: document.getElementById('cart-count'),
    floatCartCount: document.getElementById('float-cart-count'),
    productModal: document.getElementById('product-modal'),
    modalBody: document.getElementById('modal-body'),
    modalPriceTotal: document.getElementById('modal-price-total'),
    checkoutModal: document.getElementById('checkout-modal'),
    orderForm: document.getElementById('order-form'),
    deliveryDetails: document.getElementById('delivery-details')
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderProducts();
    updateCartUI();
    initEventListeners();
});

// --- UI Rendering ---
function renderCategories() {
    elements.categoriesList.innerHTML = menuData.categories.map(cat => `
        <div class="category-card relative min-w-[140px] h-40 rounded-3xl overflow-hidden cursor-pointer group shadow-sm hover:scale-105 transition-soft" onclick="scrollToCategory('${cat.id}')">
            <img src="${cat.image}" alt="${cat.name}" class="w-full h-full object-cover group-hover:scale-110 transition-soft">
            <div class="category-overlay absolute inset-0 flex items-end p-4">
                <h3 class="text-white font-cairo font-bold text-lg">${cat.name}</h3>
            </div>
        </div>
    `).join('');

    // Sticky categories bar
    elements.stickyCats.innerHTML = menuData.categories.map(cat => `
        <button onclick="scrollToCategory('${cat.id}')" class="px-4 py-1 rounded-full text-sm font-bold border border-secondary/20 hover:bg-primary hover:text-white transition-soft">
            ${cat.name}
        </button>
    `).join('');
}

function renderProducts() {
    elements.menuSections.innerHTML = menuData.categories.map(cat => {
        const catProducts = menuData.products.filter(p => p.category === cat.id);
        if (catProducts.length === 0) return '';

        return `
            <section id="${cat.id}" class="py-8">
                <div class="px-6 mb-4 flex justify-between items-center">
                    <h2 class="font-cairo text-2xl font-black border-r-4 border-accent pr-3">${cat.name}</h2>
                </div>
                <div class="horizontal-scroll hide-scrollbar px-6">
                    ${catProducts.map(p => `
                        <div class="product-card bg-white min-w-[200px] w-[200px] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-soft border border-secondary/5 group">
                            <div class="relative h-48">
                                <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-110 transition-soft">
                                ${p.badge ? `<span class="absolute top-4 left-4 bg-accent text-white text-[10px] uppercase font-black px-3 py-1 rounded-full shadow-lg">${p.badge}</span>` : ''}
                                <button onclick="handleAddToCart(${p.id})" class="absolute bottom-4 right-4 bg-primary text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-soft">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
                            <div class="p-5">
                                <h3 class="font-bold text-darkCustom mb-1 truncate">${p.name}</h3>
                                <div class="text-accent font-black text-lg">${p.price} <span class="text-xs">ج.م</span></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }).join('');
}

// --- Cart Logic ---
window.handleAddToCart = (productId) => {
    const product = menuData.products.find(p => p.id === productId);
    if (product.options && product.options.length > 0) {
        openProductModal(product);
    } else {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            basePrice: product.price,
            options: [],
            quantity: 1
        });
    }
};

function addToCart(item) {
    const existingItem = cart.find(i => i.id === item.id && JSON.stringify(i.options) === JSON.stringify(item.options));
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(item);
    }
    
    saveCart();
    updateCartUI();
    showToast(`${item.name} تمت إضافته للسلة`);
}

function updateCartUI() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Update totals
    elements.cartTotal.innerText = `${total} ج.م`;
    elements.cartCount.innerText = count;
    elements.floatCartCount.innerText = count;

    // Show/Hide badges
    if (count > 0) {
        elements.cartCount.classList.remove('hidden');
        elements.floatCartCount.classList.remove('hidden');
    } else {
        elements.cartCount.classList.add('hidden');
        elements.floatCartCount.classList.add('hidden');
    }

    // Render Items
    if (cart.length === 0) {
        document.getElementById('empty-cart').classList.remove('hidden');
        elements.cartItems.innerHTML = '';
    } else {
        document.getElementById('empty-cart').classList.add('hidden');
        elements.cartItems.innerHTML = cart.map((item, index) => `
            <div class="flex gap-4 bg-white p-4 rounded-3xl shadow-sm border border-secondary/10 animate-fade-in">
                <div class="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src="${menuData.products.find(p => p.id === item.id).image}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1">
                    <div class="flex justify-between items-start mb-1">
                        <h4 class="font-bold text-sm">${item.name}</h4>
                        <button onclick="removeFromCart(${index})" class="text-red-400 text-xs hover:text-red-600"><i class="fa-solid fa-trash"></i></button>
                    </div>
                    ${item.options.length > 0 ? `<p class="text-[10px] text-darkCustom/60 mb-2 leading-tight">${item.options.join(' • ')}</p>` : ''}
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <button onclick="updateQty(${index}, -1)" class="w-6 h-6 rounded-lg border border-secondary/20 flex items-center justify-center text-xs">-</button>
                            <span class="font-bold text-sm">${item.quantity}</span>
                            <button onclick="updateQty(${index}, 1)" class="w-6 h-6 bg-secondary/10 rounded-lg border border-secondary/20 flex items-center justify-center text-xs">+</button>
                        </div>
                        <div class="font-black text-primary">${item.price * item.quantity} ج.م</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
};

window.updateQty = (index, delta) => {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    updateCartUI();
};

function saveCart() {
    localStorage.setItem('kawkab_cart', JSON.stringify(cart));
}

// --- Modal Logic ---
function openProductModal(product) {
    activeProduct = product;
    currentTotalPrice = product.price;
    
    elements.modalBody.innerHTML = `
        <div class="h-64 relative">
            <img src="${product.image}" class="w-full h-full object-cover">
            <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bgCustom to-transparent">
                <h3 class="text-2xl font-black font-cairo">${product.name}</h3>
            </div>
        </div>
        <div class="p-6 space-y-6">
            ${product.options.map(optKey => {
                const optGroup = menuData.options[optKey];
                return `
                    <div>
                        <h4 class="font-bold text-lg mb-3 pb-2 border-b border-secondary/10">${optKey}</h4>
                        <div class="space-y-3">
                            ${optGroup.map((opt, i) => `
                                <label class="flex justify-between items-center cursor-pointer group">
                                    <div class="flex items-center gap-3">
                                        <input type="checkbox" name="${optKey}" value="${opt.name}" data-price="${opt.price}" class="w-5 h-5 accent-primary product-option-checkbox">
                                        <span class="font-medium group-hover:text-primary transition-colors">${opt.name}</span>
                                    </div>
                                    ${opt.price > 0 ? `<span class="text-sm font-bold text-secondary">+${opt.price} ج.م</span>` : `<span class="text-xs text-gray-400">مجاني</span>`}
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    elements.modalPriceTotal.innerText = `${currentTotalPrice} ج.م`;
    elements.productModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Add listeners to options
    document.querySelectorAll('.product-option-checkbox').forEach(cb => {
        cb.onchange = () => {
            let extra = 0;
            document.querySelectorAll('.product-option-checkbox:checked').forEach(checked => {
                extra += parseFloat(checked.dataset.price);
            });
            currentTotalPrice = activeProduct.price + extra;
            elements.modalPriceTotal.innerText = `${currentTotalPrice} ج.م`;
        };
    });
}

// --- Events ---
function initEventListeners() {
    // Toggles
    document.getElementById('cart-toggle').onclick = toggleCart;
    document.getElementById('floating-cart').onclick = toggleCart;
    document.getElementById('cart-close').onclick = toggleCart;
    document.getElementById('cart-backdrop').onclick = toggleCart;

    document.getElementById('search-toggle').onclick = () => {
        elements.searchOverlay.classList.remove('hidden');
        elements.searchInput.focus();
    };
    document.getElementById('search-close').onclick = () => elements.searchOverlay.classList.add('hidden');

    // Sticky Scroll
    window.onscroll = () => {
        if (window.scrollY > 400) {
            elements.stickyCats.classList.remove('hidden');
            elements.stickyCats.classList.add('flex');
        } else {
            elements.stickyCats.classList.add('hidden');
            elements.stickyCats.classList.remove('flex');
        }
    };

    // Modal Close
    document.getElementById('modal-close').onclick = closeProductModal;
    document.getElementById('modal-backdrop').onclick = closeProductModal;

    // Add to cart from modal
    document.getElementById('add-to-cart-modal').onclick = () => {
        const selectedOptions = [];
        document.querySelectorAll('.product-option-checkbox:checked').forEach(cb => {
            selectedOptions.push(cb.value);
        });

        addToCart({
            id: activeProduct.id,
            name: activeProduct.name,
            price: currentTotalPrice,
            basePrice: activeProduct.price,
            options: selectedOptions,
            quantity: 1
        });
        closeProductModal();
    };

    // Checkout
    document.getElementById('checkout-trigger').onclick = () => {
        if (cart.length === 0) return;
        elements.checkoutModal.classList.remove('hidden');
    };
    document.getElementById('checkout-backdrop').onclick = () => elements.checkoutModal.classList.add('hidden');

    elements.orderForm.onsubmit = (e) => {
        e.preventDefault();
        sendWhatsApp();
    };

    // Toggle Address field
    document.getElementsByName('order-type').forEach(radio => {
        radio.onchange = () => {
            elements.deliveryDetails.classList.toggle('hidden', radio.value === 'pickup');
        };
    });

    // Search Logic
    elements.searchInput.oninput = (e) => {
        const term = e.target.value.toLowerCase();
        if (term.length < 2) {
            elements.searchResults.innerHTML = '';
            return;
        }

        const filtered = menuData.products.filter(p => p.name.toLowerCase().includes(term));
        elements.searchResults.innerHTML = filtered.map(p => `
            <div class="flex gap-4 items-center bg-white p-3 rounded-2xl cursor-pointer hover:bg-secondary/10 transition-soft" onclick="handleSearchClick(${p.id})">
                <img src="${p.image}" class="w-16 h-16 rounded-xl object-cover">
                <div>
                    <h4 class="font-bold text-darkCustom">${p.name}</h4>
                    <span class="text-accent font-black">${p.price} ج.م</span>
                </div>
            </div>
        `).join('');
    };
}

function toggleCart() {
    elements.cartSidebar.classList.toggle('translate-x-full');
    document.getElementById('cart-backdrop').classList.toggle('hidden');
    document.body.style.overflow = elements.cartSidebar.classList.contains('translate-x-full') ? '' : 'hidden';
}

function closeProductModal() {
    elements.productModal.classList.add('hidden');
    document.body.style.overflow = '';
}

window.scrollToCategory = (id) => {
    const el = document.getElementById(id);
    const offset = 120;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = el.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
};

window.handleSearchClick = (id) => {
    elements.searchOverlay.classList.add('hidden');
    handleAddToCart(id);
};

// --- Ordering ---
function sendWhatsApp() {
    const name = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;
    const type = document.querySelector('input[name="order-type"]:checked').value;
    const address = document.getElementById('cust-address').value;

    let itemsText = cart.map((item, i) => `${i + 1}- ${item.name} ${item.options.length ? `(${item.options.join(', ')})` : ''} x${item.quantity} = ${item.price * item.quantity} ج.م`).join('\n');
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let message = `*طلب جديد من كوكب السعادة*\n\n`;
    message += `*الاسم:* ${name}\n`;
    message += `*الهاتف:* ${phone}\n`;
    message += `*النوع:* ${type === 'pickup' ? 'استلام من الفرع' : 'توصيل منزلي'}\n`;
    if (type === 'delivery') message += `*العنوان:* ${address}\n`;
    message += `\n*الطلبات:*\n${itemsText}\n\n`;
    message += `*الإجمالي:* ${total} ج.م`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/201062049652?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Clear cart and redirect/reset
    cart = [];
    saveCart();
    updateCartUI();
    elements.checkoutModal.classList.add('hidden');
    toggleCart();
    showToast('تم إرسال الطلب بنجاح! شكراً لك.');
}

// --- Utilities ---
function showToast(text) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-2xl shadow-2xl z-[100] animate-slide-up text-center font-bold text-sm';
    toast.innerText = text;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
