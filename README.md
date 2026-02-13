# 🛒 E-Commerce Backend System

A secure and scalable backend system for an e-commerce application built with **Next.js (App Router)**, **MongoDB**, and **JWT authentication**.

This backend handles authentication, role-based access control, and full cart management with validation and security best practices.

---

## 🚀 Tech Stack

- ⚡ Next.js 16 (App Router API Routes)
- 🗄 MongoDB + Mongoose
- 🔐 JWT Authentication (httpOnly Cookies)
- 🛡 Role-Based Access Control (RBAC)
- 🔑 bcrypt Password Hashing

---

## 🔐 Authentication System

### ✅ Features:
- User Signup (Customer / Vendor)
- Secure Login with JWT
- httpOnly Cookie-based Session
- Role-based Access Control
- Account Lockout after multiple failed attempts
- Logout with Cookie Clearing
- Protected Routes using Token Verification

### 🔒 Security Practices Implemented:
- Password hashing using bcrypt
- Email normalization
- Backend role validation (prevents privilege escalation)
- Token verification on every protected route
- Invalid JSON handling
- Input validation with proper HTTP status codes

---

## 👥 Roles Supported

| Role      | Permissions |
|-----------|------------|
| Customer  | Manage cart (Add / Update / Remove) |
| Vendor    | Restricted from cart operations |

Role selection is validated on the backend to prevent manipulation from frontend.

---

## 🛒 Cart System

### Cart Features:
- Add product to cart
- Automatic quantity increment
- Update quantity
- Remove item
- Remove item when quantity = 0
- Populate product details (title, price, image)
- Product existence validation

### Secure Access:
- Only authenticated users can access cart
- Only customers can modify cart
- Token required for all cart routes

---

## 📂 API Routes Overview

### 🔐 Auth Routes
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
### 🛒 Cart Routes
POST /api/cart → Add item
GET /api/cart → Get cart
PATCH /api/cart → Update quantity
DELETE /api/cart → Remove item

---

## 🧠 Architecture Highlights

- Centralized token verification helper
- Structured error handling
- Clean separation of concerns
- Reusable authentication utilities
- Secure cookie strategy
- Mongoose relational population

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/rajankumar2511/ecommerce-backend.git

# Navigate into the project
cd ecommerce-backend

# Install dependencies
npm install




## 🧪 Testing

Use Postman to test the following flows:

- ✅ Signup → Login → Get Current User  
- 🛒 Cart Add → Update → Delete  
- 🚫 Unauthorized access attempts (without token / wrong role)  

---

## 🎯 Future Enhancements

- 🛍 Checkout & Order System  
- 📦 Stock Management  
- 🛡 Admin Role Support  
- 💳 Payment Integration  
- 🔄 Refresh Token Flow  
- ⚡ Atomic Cart Updates using `$inc`  

---

## 👨‍💻 Author

**Rajan Kumar**

GitHub: [https://github.com/rajankumar2511](https://github.com/rajankumar2511)

