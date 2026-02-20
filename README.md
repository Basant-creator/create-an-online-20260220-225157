# Artisan Jewelry Co - E-commerce Store

"Handcrafted with passion, adorned with style."

This project is a complete e-commerce website for selling handmade jewelry, featuring a product catalog, shopping cart, and checkout process. It includes both a frontend (HTML, CSS, JavaScript) and a backend (Node.js, Express, MongoDB).

## Table of Contents

- [Features](#features)
- [Branding](#branding)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [Technologies Used](#technologies-used)
- [Social Media](#social-media)
- [License](#license)

## Features

- **Product Catalog:** Browse a collection of exquisite handmade jewelry.
- **Product Detail Pages:** View detailed information and images for each product.
- **Shopping Cart:** Add, update, and remove items from your cart.
- **Checkout Process:** Securely place orders with shipping and payment information.
- **User Authentication:** Register, login, and manage your account.
- **Order History:** View past orders on your account dashboard.
- **Responsive Design:** Optimized for mobile, tablet, and desktop devices.
- **Modern UI:** Clean and aesthetically pleasing design with smooth animations.
- **Backend API:** Robust API for product management, user authentication, and order processing.

## Branding

- **Company Name:** Artisan Jewelry Co
- **Tagline:** Handcrafted with passion, adorned with style.
- **Primary Color:** `#d4af37` (Gold)
- **Secondary Color:** `#c9a958` (Darker Gold)

## Installation

To set up and run this project locally, follow these steps:

### 1. Clone the Repository


### 2. Frontend Setup

The frontend files are located in the `public/` directory. No specific installation is needed beyond serving them from the backend.

### 3. Backend Setup

Navigate to the project root and install Node.js dependencies:


### 4. Environment Variables

Create a `.env` file in the project's root directory (`artisan-jewelry-co/.env`) and add the following:


-   `MONGO_URI`: Obtain this from your MongoDB Atlas dashboard. Ensure your IP address is whitelisted.
-   `JWT_SECRET`: A strong, random string for signing JWTs. You can generate one using `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

**Note:** For production deployment (e.g., Render), these variables will be configured directly in the hosting platform's environment settings. Do NOT commit your `.env` file to version control.

### 5. Start the Server

From the project root, run:


The server will start on the `PORT` specified in your `.env` file (defaulting to `5000`). You can access the frontend at `http://localhost:5000`.

## Usage

-   **Browse Products:** Navigate to `/products.html` to see the jewelry catalog.
-   **Add to Cart:** Click "Add to Cart" on product cards or detail pages.
-   **View Cart:** Go to `/cart.html` to manage your shopping cart.
-   **Checkout:** Proceed to `/checkout.html` to place an order.
-   **Account:** Register at `/signup.html` or login at `/login.html` to manage your profile and view orders at `/account.html`.

## API Endpoints

All API endpoints are prefixed with `/api`. Frontend calls use `const API_BASE = window.location.origin + '/api';`.

### Authentication & Users (`backend/routes/cart.js`)

-   `POST /api/auth/signup`: Register a new user.
    -   Request Body: `{ email, password, name? }`
    -   Response: `{ success, data: { token, user: { _id, name, email } }, message }`
-   `POST /api/auth/login`: Login a user.
    -   Request Body: `{ email, password }`
    -   Response: `{ success, data: { token, user: { _id, name, email } }, message }`
-   `GET /api/auth/me`: Get current authenticated user's profile.
    -   Requires `Authorization: Bearer <token>` header.
    -   Response: `{ success, data: UserObject, message }`
-   `PUT /api/users/:id`: Update user profile (e.g., name, phone, password).
    -   Requires `Authorization: Bearer <token>` header.
    -   Request Body: `{ name?, phone?, password? }`
    -   Response: `{ success, data: UpdatedUserObject, message }`

### Products (`backend/routes/products.js`)

-   `GET /api/products`: Get all products.
    -   Response: `{ success, data: [ProductObject], message }`
-   `GET /api/products/:id`: Get a single product by ID.
    -   Response: `{ success, data: ProductObject, message }`
-   `POST /api/products`: Add a new product. (Protected, requires `auth` middleware)
    -   Request Body: `{ name, description, price, category, imageUrl, stock }`
    -   Response: `{ success, data: NewProductObject, message }`

### Orders (`backend/routes/orders.js`)

-   `POST /api/orders`: Create a new order.
    -   Request Body: `{ shippingAddress: { ... }, items: [ { productId, name, quantity, price } ], totalAmount, paymentInfo: { cardNumber, expiryDate, cvv } }`
    -   `Authorization: Bearer <token>` is optional; if provided, `user` field in order is set.
    -   Response: `{ success, data: NewOrderObject, message }`
-   `GET /api/orders/user/:userId`: Get all orders for a specific user.
    -   Requires `Authorization: Bearer <token>` header. User must match `userId`.
    -   Response: `{ success, data: [OrderObject], message }`
-   `GET /api/orders/:id`: Get a single order by ID. (Protected, user must own order or be admin)
    -   Requires `Authorization: Bearer <token>` header.
    -   Response: `{ success, data: OrderObject, message }`

## Folder Structure


## Technologies Used

-   **Frontend:** HTML5, CSS3, JavaScript (Vanilla JS), Font Awesome (CDN)
-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB (with Mongoose ORM)
-   **Authentication:** JWT (JSON Web Tokens), bcryptjs
-   **Deployment (Recommended):** Render

## Social Media

-   **Instagram:** [@artisanjewelry](https://instagram.com/artisanjewelry)
-   **Email:** [shop@artisanjewelry.com](mailto:shop@artisanjewelry.com)

## License

ISC License (See `package.json` for details)