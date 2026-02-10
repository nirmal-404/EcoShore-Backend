/**
 * HTTP ROUTES
 * 
 * Defines API endpoints and maps them to controllers.
 * Routes specify which controller handles which HTTP method and path.
 * 
 * RESPONSIBILITIES:
 * - Define API endpoints (paths and HTTP methods)
 * - Map routes to controller methods
 * - Apply middleware to routes
 * - Organize routes by resource or feature
 * - Export router instances
 * 
 * FILE NAMING CONVENTION:
 * - userRoutes.js      → All user-related endpoints
 * - productRoutes.js   → All product-related endpoints
 * - authRoutes.js      → Authentication endpoints
 * - index.js           → Main router combining all routes
 * 
 * TYPICAL STRUCTURE:
 * const express = require('express');
 * const router = express.Router();
 * const { authMiddleware } = require('../middleware');
 * const UserController = require('../controllers/UserController');
 * 
 * router.post('/users', UserController.createUser);
 * router.get('/users/:id', authMiddleware, UserController.getUser);
 * router.put('/users/:id', authMiddleware, UserController.updateUser);
 * router.delete('/users/:id', authMiddleware, UserController.deleteUser);
 * 
 * module.exports = router;
 * 
 * ROUTE ORGANIZATION:
 * - Group related endpoints together
 * - Use RESTful conventions
 * - Apply middleware at route level
 * - Keep routes readable and maintainable
 * 
 * RESTFUL PATTERNS:
 * GET    /users       → List all users
 * POST   /users       → Create user
 * GET    /users/:id   → Get user by ID
 * PUT    /users/:id   → Update user
 * DELETE /users/:id   → Delete user
 * 
 * DO NOT include:
 * ✗ Controller logic (→ controllers)
 * ✗ Middleware implementation (→ middleware)
 * ✗ Business logic
 */
