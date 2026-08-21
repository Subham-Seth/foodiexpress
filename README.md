# 🍔 FoodieXpress — Full-Stack MERN Food Delivery Platform

> **Primary Tagline:** *"Delicious Food Delivered to Your Door"*  
> **Secondary Tagline:** *"Fresh, Fast, and Affordable"*

---

## 📖 Project Overview & Academic Architecture

**FoodieXpress** is a full-stack food ordering and delivery web application built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with Tailwind CSS, Lucide icons, and JWT authentication.

Designed with clean layered design patterns, this project serves as a production-grade portfolio piece and an educational reference for computer science engineering students.

---

## 🏗️ System Architecture

- **Frontend (`/frontend`)**:
  - React 19 with Vite
  - Tailwind CSS v4 for responsive modern styling
  - Lucide React for consistent icons
  - React Router v7 for client-side routing & protected route guards
  - Context API (`AuthContext`, `CartContext`, `ToastContext`)
  - Axios with automated JWT interceptors

- **Backend (`/backend`)**:
  - Node.js & Express.js REST API
  - MongoDB with Mongoose ODM
  - JSON Web Tokens (JWT) & Bcrypt password hashing
  - Multer for multipart food image uploads
  - Centralized error handling & Morgan request logger
  - Database Seeder script with rich realistic dishes

---

## 🔑 Demo Login Credentials

The database comes pre-seeded with ready-to-test accounts:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@foodiexpress.com` | `admin123` | Full dashboard access, Food CRUD, Live Order status manager, User directory |
| **Customer** | `customer@gmail.com` | `user123` | Browse menu, Cart, Checkout, Order Tracking, Leave reviews |
| **Student** | `student@cse.edu` | `user123` | Browse menu, Cart, Checkout, Order Tracking |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) running locally on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI.

---

### Step 1: Backend Setup

```bash
cd backend

# Install backend dependencies
npm install

# Seed the database with sample dishes, categories, users & orders
npm run seed

# Start the Express server (runs on http://localhost:5000)
npm start
# or for development with auto-reload:
npm run dev
```

---

### Step 2: Frontend Setup

Open a new terminal window:

```bash
cd frontend

# Install frontend dependencies
npm install

# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 📂 Project Directory Structure

```
foodiexpress/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile
│   │   ├── foodController.js     # Food queries, search, reviews
│   │   ├── categoryController.js # Category operations
│   │   ├── orderController.js    # Order lifecycle & tracking
│   │   ├── adminController.js    # Dashboard analytics & stats
│   │   └── contactController.js  # Contact form inquiries
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & admin guard
│   │   ├── errorMiddleware.js    # Centralized JSON error handler
│   │   └── uploadMiddleware.js   # Multer file upload setup
│   ├── models/
│   │   ├── User.js               # User schema & bcrypt methods
│   │   ├── Category.js           # Food categories schema
│   │   ├── FoodItem.js           # Food items & ratings schema
│   │   ├── Order.js              # Order items & status timeline
│   │   ├── Review.js             # Customer reviews schema
│   │   └── Contact.js            # Contact feedback schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── foodRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── contactRoutes.js
│   │   └── uploadRoutes.js
│   ├── utils/
│   │   └── generateToken.js      # JWT token generator
│   ├── data/
│   │   ├── sampleData.js         # 20+ authentic dishes across 7 categories
│   │   └── seeder.js             # DB Seeding CLI script
│   ├── uploads/                  # Uploaded food images
│   ├── .env                      # Environment configurations
│   ├── package.json
│   └── server.js                 # Express entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Navbar, Footer, Badge, StarRating, Loader
│   │   │   ├── food/             # FoodCard, FoodFilterSidebar
│   │   │   ├── cart/             # CartItemRow
│   │   │   ├── order/            # OrderTrackerTimeline
│   │   │   └── admin/            # AdminSidebar, StatCard
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication state & JWT
│   │   │   ├── CartContext.jsx   # Cart state & localStorage sync
│   │   │   └── ToastContext.jsx  # Responsive toast notification provider
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Hero banner, deals, categories & testimonials
│   │   │   ├── MenuPage.jsx      # Live search, filters, sorting & food cards
│   │   │   ├── FoodDetailPage.jsx# Detailed specs, nutrition, reviews & related dishes
│   │   │   ├── CartPage.jsx      # Promo codes, free delivery meter & pricing
│   │   │   ├── CheckoutPage.jsx  # Address form & COD/Online/Card payment
│   │   │   ├── OrdersPage.jsx    # User order history
│   │   │   ├── OrderTrackingPage.jsx # Visual 5-step order timeline tracker
│   │   │   ├── ContactPage.jsx   # Contact form & FAQ accordion
│   │   │   ├── LoginPage.jsx     # Login with 1-click demo buttons
│   │   │   ├── RegisterPage.jsx  # Customer signup
│   │   │   ├── ProfilePage.jsx   # Manage profile & default delivery address
│   │   │   └── admin/
│   │   │       ├── AdminLayout.jsx
│   │   │       ├── AdminDashboardPage.jsx # Revenue metrics & top sellers
│   │   │       ├── AdminFoodsPage.jsx     # Full CRUD dish management & upload
│   │   │       ├── AdminOrdersPage.jsx    # Live order status queue
│   │   │       └── AdminUsersPage.jsx     # User & staff directory
│   │   ├── services/
│   │   │   └── api.js            # Axios client with auto Bearer header
│   │   ├── App.jsx               # Routes setup
│   │   ├── index.css             # Tailwind CSS imports & animations
│   │   └── main.jsx              # React DOM mounting
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new user account
- `POST /api/auth/login` — Login user & obtain JWT token
- `GET /api/auth/me` — Get authenticated user profile *(Protected)*
- `PUT /api/auth/profile` — Update name, phone, address, or password *(Protected)*

### Food & Categories (`/api/foods`, `/api/categories`)
- `GET /api/categories` — Get active food categories with item counts
- `GET /api/foods` — Get foods with filters (`search`, `category`, `isVeg`, `isSpicy`, `isFeatured`, `maxPrice`, `sortBy`, `page`)
- `GET /api/foods/featured` — Get top rated and featured dishes for homepage
- `GET /api/foods/:id` — Get dish details and customer reviews
- `POST /api/foods/:id/reviews` — Submit a review and rating *(Protected)*
- `POST /api/foods` — Add a new food item *(Admin)*
- `PUT /api/foods/:id` — Update food item *(Admin)*
- `DELETE /api/foods/:id` — Delete food item *(Admin)*

### Orders (`/api/orders`)
- `POST /api/orders` — Place an order *(Protected)*
- `GET /api/orders/my-orders` — View authenticated user's order history *(Protected)*
- `GET /api/orders/:id` — View specific order with status timeline *(Protected)*
- `GET /api/orders` — View all orders *(Admin)*
- `PUT /api/orders/:id/status` — Progress order status *(Admin)*

### Admin Analytics & Users (`/api/admin`)
- `GET /api/admin/dashboard` — Aggregated revenue, total orders, active kitchen queue, top sellers
- `GET /api/admin/users` — Search and view registered users directory
- `PUT /api/admin/users/:id/role` — Toggle admin/user role
- `DELETE /api/admin/users/:id` — Remove user

---

## 💡 Key Highlights for CSE Project Presentation
1. **Zero Mocked Shortcuts**: Authentic Mongoose schemas with ObjectId references, population, text indexes, and aggregation pipelines.
2. **Stateless JWT Security**: Passwords hashed with `bcryptjs` (salt factor 10), tokens passed in `Authorization: Bearer <token>` headers.
3. **Dynamic Order Tracking**: Order status transitions (`Placed` ➔ `Confirmed` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Delivered`) update the visual timeline progress live.
4. **Clean Codebase**: Meaningful variable names, separation of concerns (Controllers, Services, Contexts, Middleware), and beginner-friendly comments throughout.

---

© FoodieXpress — Built with full-stack MERN for learning.
