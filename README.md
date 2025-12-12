# Auth Service (Go + Gin)

## Overview
This project implements a standalone authentication service in Node, using the Express.js framework. It supports user registration, login with password hashing, JSON Web Token (JWT) issuance and validation, and protects endpoints via middleware — perfect for use in a microservices architecture.

## Features
- User registration (with password hashing)
- User login — returns a signed JWT on success
- JWT-based authentication middleware — protects routes and validates token
- Clean, modular code structure using Gin routing & middleware
- Easily extendable (e.g. add password reset, roles, refresh tokens, etc.)

## Endpoints
- POST /auth/register – create user
- POST /auth/login – return access/refresh tokens
- POST /auth/refresh – refresh access token
- POST /auth/logout – invalidate refresh token
- GET /auth/me – return current user (from token)
