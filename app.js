const API_BASE_URL = 'http://localhost:3000/api/v1';

// Load products on the main page
if (document.getElementById('productsList')) {
    loadProducts();
    document.getElementById('filterAvailable').addEventListener('change', loadProducts);
}

// Handle product form submission
if (document.getElementById('productForm')) {
    document.getElementById('productForm').addEventListener('submit', handleSubmit);
}

// Load product details if on detail page
if (document.getElementById('productDetail')) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
        loadProductDetails(productId);
    }
}

// Load product for editing if on edit page
if (window.location.pathname.includes('edit-product.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
        loadProductForEdit(productId);
    }
}

async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const products = await response.json();

        const filterAvailable = document.getElementById('filterAvailable').checked;
        const filteredProducts = filterAvailable
            ? products.filter(p => p.available)
            : products;

        displayProducts(filteredProducts);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayProducts(products) {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <h2>${product.name}</h2>
            <p class="price">$${product.price}</p>
            <p class="description">${product.description}</p>
            <p class="availability">${product.available ? 'Available' : 'Out of Stock'}</p>
            <div class="actions">
                <a href="product-detail.html?id=${product.id}" class="btn view">View</a>
                <a href="edit-product.html?id=${product.id}" class="btn edit">Edit</a>
                <button onclick="deleteProduct(${product.id})" class="btn delete">Delete</button>
            </div>
        `;
        productsList.appendChild(productCard);
    });
}

async function loadProductDetails(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        const product = await response.json();

        const productDetail = document.getElementById('productDetail');
        productDetail.innerHTML = `
            <h1>${product.name}</h1>
            <div class="product-info">
                <p class="price">Price: $${product.price}</p>
                <p class="availability">Status: ${product.available ? 'Available' : 'Out of Stock'}</p>
                <p class="description">${product.description}</p>
            </div>
            <div class="actions">
                <a href="edit-product.html?id=${product.id}" class="btn edit">Edit Product</a>
                <button onclick="deleteProduct(${product.id})" class="btn delete">Delete Product</button>
                <a href="index.html" class="btn back">Back to List</a>
            </div>
        `;
    } catch (error) {
        console.error('Error loading product details:', error);
    }
}

async function loadProductForEdit(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        const product = await response.json();

        document.getElementById('name').value = product.name;
        document.getElementById('description').value = product.description;
        document.getElementById('price').value = product.price;
        document.getElementById('available').checked = product.available;
    } catch (error) {
        console.error('Error loading product for edit:', error);
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    const product = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        available: document.getElementById('available').checked
    };

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const isEdit = window.location.pathname.includes('edit-product.html');

    try {
        const response = await fetch(
            isEdit ? `${API_BASE_URL}/products/${productId}` : `${API_BASE_URL}/products`,
            {
                method: isEdit ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            }
        );

        if (response.ok) {
            window.location.href = 'index.html';
        } else {
            alert('Error saving product');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error saving product');
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            if (window.location.pathname.includes('product-detail.html')) {
                window.location.href = 'index.html';
            } else {
                loadProducts();
            }
        } else {
            alert('Error deleting product');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting product');
    }
} 