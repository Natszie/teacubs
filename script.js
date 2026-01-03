// ====== Shopping Cart System ======
let cart = JSON.parse(localStorage.getItem('teacubsCart')) || [];

// ====== Mobile Navigation Toggle ======
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ====== Navbar Scroll Effect ======
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window. addEventListener('scroll', () => {
    const currentScroll = window. pageYOffset;

    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 2px 30px rgba(26, 95, 180, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(26, 95, 180, 0.1)';
    }

    lastScroll = currentScroll;
});

// ====== Menu Tab Switching ======
const tabButtons = document.querySelectorAll('.tab-button');
const menuContents = document.querySelectorAll('.menu-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn. classList.remove('active'));
        menuContents.forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');

        animateMenuItems(tabId);
    });
});

// ====== Animate Menu Items ======
function animateMenuItems(tabId) {
    const menuItems = document.querySelectorAll(`#${tabId} .menu-item`);
    menuItems.forEach((item, index) => {
        item.style.opacity = '0';
        item. style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ====== Cart Modal Functions ======
const cartModal = document.getElementById('cartModal');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const emptyCart = document.getElementById('emptyCart');
const cartFooter = document.getElementById('cartFooter');
const checkoutBtn = document.getElementById('checkoutBtn');

// Open cart modal
cartBtn.addEventListener('click', () => {
    cartModal.classList.add('active');
    renderCart();
});

// Close cart modal
closeCart.addEventListener('click', () => {
    cartModal.classList.remove('active');
});

// Close cart when clicking outside
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
    }
});

// ====== Add to Cart Functionality ======
const addButtons = document.querySelectorAll('.add-btn');

addButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const menuItem = this.closest('.menu-item');
        const item = {
            id: menuItem.dataset.id,
            name: menuItem.dataset.name,
            price: parseFloat(menuItem.dataset.price),
            emoji: menuItem.dataset.emoji,
            quantity: 1
        };
        
        addToCart(item);
        
        // Animate button
        this.style.transform = 'scale(0.9)';
        this.textContent = '✓ Added! ';
        
        setTimeout(() => {
            this.style.transform = 'scale(1)';
            this. textContent = 'Add to Order';
        }, 1000);
        
        // Show success notification
        showNotification('Item added to cart!', 'success');
    });
});

// ====== Cart Functions ======
function addToCart(item) {
    const existingItem = cart. find(cartItem => cartItem. id === item.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(item);
    }
    
    saveCart();
    updateCartCount();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartCount();
    renderCart();
    showNotification('Item removed from cart', 'info');
}

function updateQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCart();
            renderCart();
        }
    }
}

function saveCart() {
    localStorage.setItem('teacubsCart', JSON.stringify(cart));
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (totalItems > 0) {
        cartCount.classList.add('show');
    } else {
        cartCount.classList.remove('show');
    }
}

function renderCart() {
    if (cart.length === 0) {
        emptyCart.style.display = 'flex';
        cartItems.style.display = 'none';
        cartFooter.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartItems.style.display = 'block';
    cartFooter.style.display = 'block';
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <span class="cart-item-emoji">${item.emoji}</span>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">₱${item.price}</p>
                </div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
    
    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal >= 900 ? 0 : 120;
    const total = subtotal + deliveryFee;
    
    document.getElementById('subtotal').textContent = `₱${subtotal.toFixed(2)}`;
    document.getElementById('deliveryFee').textContent = deliveryFee === 0 ? 'FREE' : `₱${deliveryFee}`;
    document.getElementById('totalPrice').textContent = `₱${total.toFixed(2)}`;
}

// ====== Checkout ======
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = total >= 900 ? 0 : 120;
    const finalTotal = total + deliveryFee;
    
    showNotification(`Order placed!  Total: ₱${finalTotal.toFixed(2)}`, 'success');
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();
    renderCart();
    
    setTimeout(() => {
        cartModal. classList.remove('active');
    }, 1500);
});

// ====== Notification System ======
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
        <span>${message}</span>
    `;
    
    document.body. appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ====== Initialize Cart on Page Load ======
updateCartCount();

// ====== Intersection Observer for Scroll Animations ======
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target. style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

const animateElements = document.querySelectorAll('.about-card, .menu-item, .ambiance-card, .info-item, .delivery-feature');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ====== Smooth Scroll for Navigation Links ======
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this. getAttribute('href'));
        
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ====== Hero Parallax Effect ======
const hero = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.3;
    
    if (scrolled < hero.offsetHeight) {
        heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        const opacityValue = 1 - (scrolled / hero.offsetHeight) * 0.8;
        heroContent.style.opacity = Math.max(0.3, opacityValue);
    }
});

// ====== Menu Item Hover Effects ======
const menuItems = document.querySelectorAll('.menu-item');

menuItems.forEach(item => {
    item. addEventListener('mouseenter', function() {
        const emoji = this.querySelector('.menu-item-img');
        if (emoji) {
            emoji. style.transform = 'scale(1.2) rotate(10deg)';
            emoji.style.transition = 'all 0.3s ease';
        }
    });

    item.addEventListener('mouseleave', function() {
        const emoji = this.querySelector('.menu-item-img');
        if (emoji) {
            emoji. style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// ====== Active Link Highlighting ======
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// ====== Page Load Animation ======
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ====== Console Welcome Message ======
console.log('%c☕ Welcome to TeaCubs Cafe! 🎄', 'font-size: 20px; color: #1a5fb4; font-weight: bold;');
console.log('%cEnjoy your cozy study session since 2020! ', 'font-size: 14px; color: #6c757d;');