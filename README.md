# Clothing Brand E-Commerce Platform

A full-stack e-commerce platform built with Node.js, Express, Prisma, React, and Redux Toolkit.

## 🚀 Project Structure

```
clothingBrand/
├── backend/          # Node.js + Express API
│   ├── prisma/       # Database schema & migrations
│   ├── src/
│   │   ├── modules/  # Feature modules (auth, products, cart, etc.)
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── config/
│   └── package.json
└── frontend/         # React + Vite application
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── features/  # Redux slices & API definitions
    │   └── hooks/
    └── package.json
```

## 📋 Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL database

## 🛠️ Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):

   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your database and JWT configuration

5. Run Prisma migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

6. Seed the database (optional):

   ```bash
   npm run seed
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):

   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🔑 Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://user:password@localhost:5432/clothing_brand
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api
```

## 📚 API Endpoints

- **Auth**: `/api/auth` - Register, Login, Get current user
- **Products**: `/api/products` - CRUD operations
- **Categories**: `/api/categories` - Category management
- **Cart**: `/api/cart` - Shopping cart operations
- **Orders**: `/api/orders` - Order management
- **Users**: `/api/users` - User management

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <token>
```

## 📖 Available Scripts

### Backend

- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm test` - Run tests

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Key Improvements Made

- ✅ Fixed ES module compatibility in frontend
- ✅ Added CORS with credentials support
- ✅ Improved error handling with proper return statements
- ✅ Added admin & superAdmin middleware for role-based access
- ✅ Enhanced database connection with graceful shutdown
- ✅ Added .gitignore and .prettierrc for better practices
- ✅ Created .env.example templates
- ✅ Better request payload size limits
- ✅ Improved logging configuration

## 🐛 Common Issues & Solutions

### CORS Error

Make sure `CLIENT_URL` in backend `.env` matches your frontend URL.

### Database Connection Error

Verify your `DATABASE_URL` is correct and PostgreSQL is running.

### Token Expired

Tokens expire after 30 days. Users need to login again.

## 📝 License

ISC
