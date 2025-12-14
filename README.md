# 🍬 Sweet Shop Management System

A full-stack Sweet Shop Management System built as a Test-Driven Development (TDD) kata.  
The application supports authentication, role-based access, inventory management, and a modern, responsive frontend.

**Repository:**  
https://github.com/ShayanMukherjee/sweet-shop

---

## 🧠 Project Overview

This project simulates a real-world sweet shop where users can browse and purchase sweets, while administrators manage inventory.

The focus of the project is:
- Clean REST API design
- Secure authentication
- Role-based authorization
- Persistent database usage
- Modern frontend UX
- Transparent AI-assisted development

---

## 🚀 Tech Stack

### Backend
- Node.js + TypeScript
- Express.js
- SQLite
- JWT Authentication
- Role-based Authorization (USER / ADMIN)

### Frontend
- React + TypeScript
- Vite
- Axios
- React Router
- Modern UI with Dark / Light mode

---

## ✨ Features

### Authentication
- User registration
- User login
- JWT-based session handling
- Protected routes

### User Features
- View all available sweets
- Purchase sweets
- Purchase button disabled when stock is zero
- Real-time stock updates after purchase

### Admin Features
- Add new sweets
- Prevent duplicate sweet names (case-insensitive)
- Restock sweets with custom quantity
- Delete sweets
- Admin-only controls hidden from normal users

### UI / UX
- Clean dashboard layout
- Dark / Light mode toggle
- Responsive grid-based cards
- Clear admin vs user separation

---

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### Sweets
- `GET /api/sweets`
- `POST /api/sweets` *(Admin only)*
- `POST /api/sweets/:id/purchase`
- `POST /api/sweets/:id/restock` *(Admin only)*
- `DELETE /api/sweets/:id` *(Admin only)*

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm

---

### Backend Setup

```bash
cd backend

Backend runs on:
http://localhost:3000
```
### Frontend Setup

```bash
cd frontend
npm install
npm run dev

frontend runs on:
http://localhost:5173
```
### Admin access
By default, all registered users are created with the USER role.

To promote a user to ADMIN (for testing purposes), run the following command in the SQLite database:

```
sql:
UPDATE users
SET role = 'ADMIN'
WHERE email = 'your-email@example.com';
```
### 🤖 My AI Usage

AI tools (ChatGPT) were used responsibly during the development of this project to:

Design and structure REST API endpoints

Debug backend logic and database edge cases

Refactor React components for clarity and maintainability

Improve UI/UX patterns and layout decisions

Validate role-based access control and authentication flow

All AI-generated suggestions were carefully reviewed, understood, and manually integrated into the project.
AI significantly improved development speed and helped maintain code quality under strict time constraints.
npm install
npm run dev
