# Portfolio Backend API

## 📖 Project Description

This is a **full-featured backend API** built for a modern personal portfolio website. It provides a robust foundation for developers, designers, and professionals who want to showcase their work, share their thoughts through blogs, and manage their online presence effectively.

### 🎯 What This Project Does

This backend service powers a complete portfolio ecosystem that includes:

- **Personal Branding Hub** - Centralized management of your professional identity, skills, and achievements
- **Dynamic Blog Platform** - Share your thoughts, tutorials, and industry insights with a full-featured blogging system
- **Project Showcase** - Display your work with detailed project information, technologies used, and live demos
- **Skills Management** - Organize and present your technical expertise with skill levels and visual indicators
- **Secure Authentication** - Professional-grade security with JWT tokens and role-based access control

### 🚀 Why This Project Exists

In today's digital landscape, having a strong online presence is crucial for career growth. This backend solves the common problem of:

- **Scattered Information** - Instead of managing multiple platforms, centralize everything in one place
- **Technical Complexity** - No need to build authentication, file uploads, and database management from scratch
- **Content Management** - Easily update your portfolio content without touching code
- **Professional Security** - Enterprise-grade security features built-in
- **Scalability** - Architecture designed to grow with your career and content needs

### 🎨 Perfect For

- **Software Developers** showcasing their coding projects and technical blog posts
- **Designers** displaying their creative work and design case studies
- **Freelancers** managing client testimonials, project portfolios, and service offerings
- **Students** building their first professional online presence
- **Career Changers** documenting their learning journey and new skills

### 🔧 Built With Modern Technology

This isn't just another CRUD API - it's a production-ready system built with:

- **TypeScript** for type safety and better developer experience
- **Prisma ORM** for modern database management
- **JWT Authentication** for secure user sessions
- **Cloudinary Integration** for professional image handling
- **Express.js** for robust API architecture

A comprehensive Express.js + TypeScript + Prisma backend for a personal portfolio website with authentication, image upload, and content management.

## Features

- **JWT Authentication** - Secure login with access & refresh tokens stored in HTTP-only cookies
- **User Management** - User registration with profile picture upload
- **Blog Management** - Full CRUD operations for blog posts with tags and cover images
- **Project Showcase** - Manage portfolio projects with technologies, status, and images
- **Skills Management** - Track and display technical skills with levels and icons
- **Image Upload** - Cloudinary integration for secure image storage
- **TypeScript** - Full type safety throughout the application
- **Prisma ORM** - Modern database toolkit with PostgreSQL
- **Error Handling** - Comprehensive error management with custom error classes
- **CORS & Security** - Proper CORS configuration and security headers

## Project Structure

```
backend/
├── server.ts                    # Application entry point with environment validation
├── src/
│   ├── app.ts                   # Express app configuration with CORS and middleware
│   ├── server.ts                # Legacy server file (main entry is root server.ts)
│   ├── config/
│   │   ├── database.ts          # Prisma client configuration
│   │   └── multerCloudinary.ts  # Cloudinary and Multer configuration
│   ├── interface/
│   │   ├── index.d.ts           # Global type declarations
│   │   └── types.ts             # Custom TypeScript interfaces
│   ├── middleware/
│   │   ├── asyncHandler.ts      # Async function wrapper
│   │   ├── auth.ts              # JWT authentication middleware
│   │   ├── errorHandler.ts      # Global error handling
│   │   └── notFound.ts          # 404 handler
│   ├── modules/
│   │   ├── Auth/                # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.route.ts
│   │   │   └── auth.service.ts
│   │   ├── User/                # User management module
│   │   │   ├── user.controller.ts
│   │   │   ├── user.route.ts
│   │   │   └── user.service.ts
│   │   ├── Blog/                # Blog management module
│   │   │   ├── blog.controller.ts
│   │   │   ├── blog.route.ts
│   │   │   └── blog.service.ts
│   │   ├── Projects/            # Project management module
│   │   │   ├── project.controller.ts
│   │   │   ├── project.route.ts
│   │   │   └── project.service.ts
│   │   └── skills/              # Skills management module
│   │       ├── skill.controller.ts
│   │       ├── skill.route.ts
│   │       └── skill.service.ts
│   ├── types/
│   │   └── index.ts             # Type definitions
│   └── utils/
│       ├── AppError.ts          # Custom error class
│       ├── jwt.ts               # JWT utility functions
│       ├── sendResponse.ts      # Standardized API response
│       └── setAuthCookies.ts    # Cookie management utility
├── prisma/
│   ├── schema.prisma           # Database schema with User, Blog, Project, Skill models
│   └── migrations/             # Database migration files
├── package.json
├── tsconfig.json
└── nodemon.json
```

## Database Schema

### User Model

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      String   @default("Admin")
  picture   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  blogs     Blog[]
  projects  Project[]
  skills    Skill[]
}
```

### Blog Model

```prisma
model Blog {
  id         String   @id @default(cuid())
  title      String
  slug       String   @unique
  content    String   @db.Text
  excerpt    String?  @db.Text
  coverImage String?
  tags       String[] @default([])
  published  Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

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
  excerpt      String?  @db.Text
  technologies String[] @default([])
  githubUrl    String?
  liveUrl      String?
  imageUrl     String?
  featured     Boolean  @default(false)
  status       String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  author   User   @relation(fields: [authorId], references: [id])
  authorId String
}
```

### Skill Model

```prisma
model Skill {
  id        String   @id @default(cuid())
  name      String
  level     String?
  iconUrl   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user   User   @relation(fields: [userId], references: [id])
  userId String
}
```

## API Endpoints

All endpoints are prefixed with `/api/v1`

### Health Check

- `GET /api/v1` - Server health check and status

### Authentication

- `POST /api/v1/auth/login` - User login (returns tokens and user data)
- `POST /api/v1/auth/logout` - Logout (protected, clears cookies)
- `POST /api/v1/auth/refresh-token` - Refresh access token using refresh token

### User Management

- `POST /api/v1/user/register` - Register new user with profile picture upload
- `PUT /api/v1/user/:id` - Update user profile
- `DELETE /api/v1/user/:id` - Delete user account
- `GET /api/v1/user/me` - Get current authenticated user (protected)

### Blogs

- `GET /api/v1/blogs` - Get all blogs (public)
- `GET /api/v1/blogs/:id` - Get single blog by ID (public)
- `POST /api/v1/blogs` - Create new blog (protected)
- `PATCH /api/v1/blogs/:id` - Update blog (protected)
- `DELETE /api/v1/blogs/:id` - Delete blog (protected)

### Projects

- `GET /api/v1/projects` - Get all projects (public)
- `GET /api/v1/projects/:id` - Get single project by ID (public)
- `POST /api/v1/projects` - Create new project (protected)
- `PATCH /api/v1/projects/:id` - Update project (protected)
- `DELETE /api/v1/projects/:id` - Delete project (protected)

### Skills

- `GET /api/v1/skills` - Get all skills (public)
- `POST /api/v1/skills` - Create new skill (protected)
- `PATCH /api/v1/skills/:id` - Update skill (protected)
- `DELETE /api/v1/skills/:id` - Delete skill (protected)

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_db?schema=public"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# JWT Refresh Token Configuration
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-at-least-32-characters
JWT_REFRESH_EXPIRE=30d
JWT_REFRESH_COOKIE_EXPIRE=30

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET_KEY=your-cloudinary-secret-key
```

**Required Environment Variables:**

- `JWT_SECRET` (minimum 32 characters)
- `JWT_REFRESH_SECRET` (minimum 32 characters)
- `DATABASE_URL`

**Optional Environment Variables:**

- Cloudinary variables (if you want image upload functionality)
- `FRONTEND_URL` (defaults to http://localhost:3000)
- `PORT` (defaults to 5000)

## Getting Started

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd A7_backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set up Environment Variables**

   - Copy `.env.example` to `.env` (if available) or create a new `.env` file
   - Update all required environment variables (see Environment Variables section)

4. **Set up Database**

   - Create a PostgreSQL database
   - Update `DATABASE_URL` in `.env` file

5. **Run Database Migrations**

   ```bash
   npm run prisma:migrate
   ```

6. **Generate Prisma Client**

   ```bash
   npm run prisma:generate
   ```

7. **Seed Database (Optional)**

   ```bash
   npm run prisma:seed
   ```

8. **Start Development Server**
   ```bash
   npm run dev
   ```

The server will start on the port specified in your `.env` file (default: 5000).

## Available Scripts

- `npm run dev` - Start development server with ts-node-dev (hot reload)
- `npm run dev:watch` - Alternative development server with nodemon
- `npm run build` - Build TypeScript to JavaScript (dist folder)
- `npm run start` - Start production server from built files
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations in development
- `npm run prisma:seed` - Seed database with sample data
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Authentication Flow

1. **Login**: POST to `/api/v1/auth/login` with email/password
2. **Tokens**: Receive JWT access token and refresh token (stored in HTTP-only cookies)
3. **Protected Routes**: Include `Authorization: Bearer <token>` header OR rely on cookies
4. **Refresh**: Use refresh token to get new access token when expired
5. **Logout**: POST to `/api/v1/auth/logout` to clear authentication cookies

## Example Usage

### User Registration with Image Upload

```javascript
const formData = new FormData();
formData.append("name", "John Doe");
formData.append("email", "john@example.com");
formData.append("password", "securepassword");
formData.append("file", imageFile); // File input

const response = await fetch("/api/v1/user/register", {
  method: "POST",
  body: formData, // Don't set Content-Type, let browser set it for FormData
});
```

### Login

```javascript
const response = await fetch("/api/v1/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // Important for cookies
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
  }),
});

const { data } = await response.json();
const { accessToken, user } = data;
```

### Create Blog Post

```javascript
const response = await fetch("/api/v1/blogs", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
  credentials: "include",
  body: JSON.stringify({
    title: "My Blog Post",
    content: "Blog content here...",
    excerpt: "Short description",
    tags: ["javascript", "tutorial"],
    published: true,
  }),
});
```

### Create Project

```javascript
const response = await fetch("/api/v1/projects", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
  credentials: "include",
  body: JSON.stringify({
    title: "My Portfolio Website",
    description: "A full-stack portfolio website built with React and Node.js",
    excerpt: "Modern portfolio showcasing my projects",
    technologies: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    githubUrl: "https://github.com/username/portfolio",
    liveUrl: "https://myportfolio.com",
    featured: true,
    status: "completed",
  }),
});
```

## Security Features

- **Password Hashing** - bcryptjs for secure password storage
- **JWT Authentication** - Access and refresh token system
- **HTTP-only Cookies** - Secure token storage in browser
- **CORS Protection** - Configurable CORS settings
- **Helmet Security** - Security headers middleware
- **Input Validation** - Request validation and sanitization
- **Error Handling** - Comprehensive error management with custom error classes
- **Environment Validation** - Required environment variables validation on startup
- **File Upload Security** - Cloudinary integration with file type validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Language**: TypeScript v5
- **Database**: PostgreSQL
- **ORM**: Prisma v6
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer + Cloudinary
- **Development**: ts-node-dev, Nodemon
- **Security**: Helmet, CORS, Cookie-parser

## Project Features

### Image Upload System

- Cloudinary integration for secure cloud storage
- File type validation (images only)
- Automatic image optimization and transformation
- Profile picture upload for users
- Cover image support for blogs
- Project image upload capability

### Modular Architecture

- Organized by feature modules (Auth, User, Blog, Projects, Skills)
- Each module contains controller, service, and route files
- Centralized middleware and utilities
- Type-safe interfaces and custom types

### Database Relations

- User owns multiple blogs, projects, and skills
- Proper foreign key relationships
- Cascade operations handled by Prisma

### Error Handling

- Custom AppError class for consistent error responses
- Global error handling middleware
- Async handler wrapper for controllers
- Standardized API response format
