# B5A7 Portfolio Backend

A simple Express.js + TypeScript + Prisma backend for a personal portfolio website with authentication.

## Features

- **Single Admin User** - No role-based system, just one admin user
- **JWT Authentication** - Secure login with access & refresh tokens
- **Blog Management** - Create, read, update, delete blog posts
- **Project Showcase** - Manage portfolio projects
- **TypeScript** - Full type safety
- **Prisma ORM** - Modern database toolkit
- **Error Handling** - Comprehensive error management

## Project Structure

```
backend/
├── server.ts                    # Application entry point
├── src/
│   ├── app.ts                   # Express app configuration
│   ├── controllers/             # Route controllers
│   │   ├── authController.ts    # Authentication logic
│   │   ├── blogController.ts    # Blog CRUD operations
│   │   └── projectController.ts # Project CRUD operations
│   ├── middleware/
│   │   ├── auth.ts             # JWT authentication
│   │   ├── errorHandler.ts     # Global error handling
│   │   └── notFound.ts         # 404 handler
│   ├── routes/                  # API routes
│   ├── utils/                   # Helper functions
│   ├── config/                  # Database configuration
│   └── types/                   # TypeScript interfaces
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seeding
└── package.json
```

## Database Schema

### User Model

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  blogs    Blog[]
  projects Project[]
}
```

### Blog Model

```prisma
model Blog {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  content   String   @db.Text
  excerpt   String?  @db.Text
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author   User   @relation(fields: [authorId], references: [id])
  authorId String
}
```

### Project Model

```prisma
model Project {
  id           String   @id @default(cuid())
  title        String
  description  String   @db.Text
  technologies String[] @default([])
  githubUrl    String?
  liveUrl      String?
  imageUrl     String?
  featured     Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  author   User?   @relation(fields: [authorId], references: [id])
  authorId String?
}
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout (protected)
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/refresh-token` - Refresh access token

### Blogs

- `GET /api/blogs/published` - Get published blogs (public)
- `GET /api/blogs/:id/public` - Get single blog (public)
- `GET /api/blogs` - Get all blogs (protected)
- `GET /api/blogs/:id` - Get single blog (protected)
- `POST /api/blogs` - Create blog (protected)
- `PUT /api/blogs/:id` - Update blog (protected)
- `DELETE /api/blogs/:id` - Delete blog (protected)

### Projects

- `GET /api/projects` - Get all projects (public)
- `GET /api/projects/:id` - Get single project (public)
- `POST /api/projects` - Create project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

## Environment Variables

Create a `.env` file:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_db?schema=public"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# JWT Refresh Token Configuration
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production
JWT_REFRESH_EXPIRE=30d
JWT_REFRESH_COOKIE_EXPIRE=30
```

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Set up Database**

   - Create a PostgreSQL database
   - Update `DATABASE_URL` in `.env` file

3. **Run Database Migrations**

   ```bash
   npm run prisma:migrate
   ```

4. **Seed Database**

   ```bash
   npm run prisma:seed
   ```

   This creates an admin user with:

   - Email: `admin@portfolio.com`
   - Password: `admin123`

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with sample data
- `npm run prisma:studio` - Open Prisma Studio

## Authentication Flow

1. **Login**: POST to `/api/auth/login` with email/password
2. **Token**: Receive JWT access token and refresh token
3. **Protected Routes**: Include `Authorization: Bearer <token>` header
4. **Refresh**: Use refresh token to get new access token when expired

## Example Usage

### Login

```javascript
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@portfolio.com",
    password: "admin123",
  }),
});

const { token, user } = await response.json();
```

### Create Blog Post

```javascript
const response = await fetch("/api/blogs", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "My Blog Post",
    content: "Blog content here...",
    excerpt: "Short description",
    published: true,
  }),
});
```

## Security Features

- Password hashing with bcrypt
- JWT authentication with refresh tokens
- CORS protection
- Helmet security headers
- Input validation
- Error handling middleware

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Development**: Nodemon, ts-node
