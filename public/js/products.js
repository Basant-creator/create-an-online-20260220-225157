// This script handles general UI features across pages, acting as a main script,
// and also specific logic for the products and product-detail pages.

document.addEventListener('DOMContentLoaded', () => {
    // --- Global Navigation & UI ---
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile navigation
    hamburgerMenu.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        const icon = hamburgerMenu.querySelector('i');
        if (mainNav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            hamburgerMenu.setAttribute('aria-expanded', 'true');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            hamburgerMenu.setAttribute('aria-expanded', 'false');
        }
    });

    // Highlight current page in navigation
    const currentPage = document.body.dataset.page || window.location.pathname.split('/').pop().split('.')[0];
    navLinks.forEach(link => {
        if (link.dataset.page === currentPage || (link.getAttribute('href') === window.location.pathname.split('/').pop())) {
            link.classList.add('current');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('current');
            link.removeAttribute('aria-current');
        }
    });

    // --- Product Listing Page Logic (products.html) ---
    const productGrid = document.getElementById('product-grid');
    const categoryFilter = document.getElementById('category-filter');

    // Sample product data (in a real app, this would come from the backend API)
    const allProducts = [
        { id: '1', name: 'Dainty Gold Necklace', price: 65.00, category: 'necklaces', image: 'https://via.placeholder.com/300x200?text=Dainty+Gold+Necklace' },
        { id: '2', name: 'Pearl Drop Earrings', price: 80.00, category: 'earrings', image: 'https://via.placeholder.com/300x200?text=Pearl+Drop+Earrings' },
        { id: '3', name: 'Sterling Silver Bracelet', price: 120.00, category: 'bracelets', image: 'https://via.placeholder.com/300x200?text=Silver+Bracelet' },
        { id: '4', name: 'Emerald Cut Ring', price: 250.00, category: 'rings', image: 'https://via.placeholder.com/300x200?text=Emerald+Ring' },
        { id: '5', name: 'Beaded Charm Bracelet', price: 55.00, category: 'bracelets', image: 'https://via.placeholder.com/300x200?text=Beaded+Bracelet' },
        { id: '6', name: 'Geometric Stud Earrings', price: 45.00, category: 'earrings', image: 'https://via.placeholder.com/300x200?text=Geometric+Earrings' },
        { id: '7', name: 'Elegant Silver Locket', price: 95.00, category: 'necklaces', image: 'https://via.placeholder.com/600x400?text=Elegant+Silver+Locket' }, // Used in product-detail
        { id: '8', name: 'Minimalist Gold Hoops', price: 70.00, category: 'earrings', image: 'https://via.placeholder.com/300x200?text=Minimalist+Hoops' },
        { id: '9', name: 'Birthstone Pendant', price: 110.00, category: 'necklaces', image: 'https://via.placeholder.com/300x200?text=Birthstone+Pendant' },
        { id: '10', name: 'Vintage Inspired Ring', price: 180.00, category: 'rings', image: 'https://via.placeholder.com/300x200?text=Vintage+Ring' },
    ];

    // Function to render products
    function renderProducts(products) {
        if (!productGrid) return; // Only run if on products.html or similar
        productGrid.innerHTML = ''; // Clear existing products
        if (products.length === 0) {
            productGrid.innerHTML = '<p>No products found in this category.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <a href="product-detail.html?id=${product.id}" aria-label="View ${product.name} details">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </a>
                <div class="product-info">
                    <h3 class="product-title"><a href="product-detail.html?id=${product.id}">${product.name}</a></h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price.toFixed(2)}">Add to Cart</button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
        attachAddToCartListeners(); // Re-attach listeners after rendering
    }

    // Filter products based on category
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            const selectedCategory = e.target.value;
            let filteredProducts = allProducts;
            if (selectedCategory !== 'all') {
                filteredProducts = allProducts.filter(product => product.category === selectedCategory);
            }
            renderProducts(filteredProducts);
        });
        // Initial render for products page
        renderProducts(allProducts);
    }

    // --- "Add to Cart" functionality (used on products.html and product-detail.html) ---
    function attachAddToCartListeners() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(button => {
            button.onclick = (e) => { // Using onclick to easily remove and re-attach
                const productId = e.target.dataset.productId;
                const productName = e.target.dataset.productName;
                const productPrice = parseFloat(e.target.dataset.productPrice);
                let quantity = 1;

                // For product-detail page, get quantity from input field
                if (window.location.pathname.includes('product-detail.html')) {
                    const quantityInput = document.getElementById('quantity');
                    if (quantityInput) {
                        quantity = parseInt(quantityInput.value, 10);
                        if (isNaN(quantity) || quantity < 1) quantity = 1;
                    }
                }
                
                addToCart({ id: productId, name: productName, price: productPrice, quantity: quantity });
                alert(`${quantity} x ${productName} added to cart!`);
                e.stopPropagation(); // Prevent potential link clicks if button is inside an anchor
            };
        });
    }

    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay(); // Call cart update function if it exists
    }

    function addToCart(product) {
        let cart = getCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            cart.push(product);
        }
        saveCart(cart);
    }

    // Initial attachment of listeners (for statically loaded products or for product-detail)
    attachAddToCartListeners();

    // --- Product Detail Page Logic (product-detail.html) ---
    // The product-detail.html specific JS is inlined in the HTML for simplicity,
    // but the `attachAddToCartListeners` function above covers the "Add to Cart" button.
    // If dynamic loading of product details was required, it would happen here
    // using URL params (e.g., `id`) and fetching from a backend API.
});

// A placeholder for a cart update function, defined globally if cart.js exists
// This is to allow products.js to trigger an update when an item is added.
// In a real app, this would be a more robust event bus or a shared module.
function updateCartDisplay() {
    if (typeof window.renderCartItems === 'function') {
        window.renderCartItems(); // Call the function from cart.js if it's available
    }
}