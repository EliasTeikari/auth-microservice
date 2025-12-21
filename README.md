# Auth Microservice

A standalone authentication service built with Node.js and Express 5. Implements user registration, login with secure password hashing, JWT access tokens, and refresh token rotation — designed for use in microservices architectures.

## Features

-   **User Registration** with email validation
-   **Secure Login** with bcrypt password hashing
-   **JWT Access Tokens** (15-minute expiry)
-   **Refresh Token Rotation** (7-day expiry, stored in MongoDB)
-   **Token Revocation** via logout endpoint
-   **Input Validation** using Joi schemas
-   **MongoDB** with Mongoose ODM

## Tech Stack

| Component        | Technology           |
| ---------------- | -------------------- |
| Runtime          | Node.js              |
| Framework        | Express 5            |
| Database         | MongoDB + Mongoose 9 |
| Authentication   | JWT (jsonwebtoken)   |
| Password Hashing | bcrypt               |
| Validation       | Joi                  |
| Testing          | Jest + Supertest     |

## Getting Started

### Prerequisites

-   Node.js 18+
-   MongoDB running locally on port `27017`

### Installation

```bash
# Clone the repository
git clone https://github.com/EliasTeikari/auth-microservice.git
cd auth-microservice

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
```

### Running the Server

```bash
# Development (with nodemon)
npx nodemon src/app.js

# Production
node src/app.js
```

The server starts on `http://localhost:3000` by default.

## API Endpoints

### Health Check

```
GET /
```

Returns: `Server is up and running`

---

### Register User

```
POST /auth/
```

**Request Body:**

```json
{
    "email": "user@example.com",
    "password": "securepassword123"
}
```

**Validation Rules:**

-   Email: valid format, `.com` or `.net` TLD, 3-50 characters
-   Password: alphanumeric, 3-30 characters

**Response:**

-   `201 Created` — User created successfully
-   `400 Bad Request` — Validation error
-   `409 Conflict` — User already exists

---

### Login

```
POST /auth/login
```

**Request Body:**

```json
{
    "email": "user@example.com",
    "password": "securepassword123"
}
```

**Response:**

-   `200 OK` — Returns access token and refresh token
-   `401 Unauthorized` — Invalid credentials

```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "a1b2c3d4e5f6..."
}
```

---

### Refresh Token

```
POST /auth/refresh
```

**Request Body:**

```json
{
    "refreshToken": "a1b2c3d4e5f6..."
}
```

**Response:**

-   `200 OK` — Returns new access token
-   `400 Bad Request` — Refresh token required
-   `401 Unauthorized` — Invalid or expired refresh token

```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Logout

```
POST /auth/logout
```

**Request Body:**

```json
{
    "refreshToken": "a1b2c3d4e5f6..."
}
```

**Response:**

-   `200 OK` — Logged out successfully
-   `400 Bad Request` — Token not found or not provided

---

## Authentication Middleware

To protect routes, use the auth middleware:

```javascript
const authMiddleware = require("./middleware/auth");

app.get("/protected", authMiddleware, (req, res) => {
    // req.user contains { userId, email }
    res.json({ user: req.user });
});
```

**Required Header:**

```
Authorization: Bearer <access_token>
```

## Project Structure

```
src/
├── app.js                 # Express app setup
├── index.js               # Entry point
├── config/
│   └── database.js        # MongoDB connection
├── middleware/
│   ├── auth.js            # JWT verification middleware
│   └── validation.js      # Joi validation schemas
├── models/
│   ├── User.js            # User model
│   └── RefreshToken.js    # Refresh token model (TTL indexed)
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   └── authRoutes.test.js # Route tests
└── utils/
    └── passwordHash.js    # bcrypt helpers
```

## Testing

```bash
npm test
```

Tests use `mongodb-memory-server` for an isolated in-memory MongoDB instance.

## Security Considerations

-   Passwords are hashed with bcrypt (10 salt rounds)
-   Access tokens expire after 15 minutes
-   Refresh tokens expire after 7 days and are stored in MongoDB with TTL index
-   JWT secret should be a strong, randomly generated string in production
