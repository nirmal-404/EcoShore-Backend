/**
 * HTTP MIDDLEWARE
 * 
 * Express middleware functions that process requests before they reach controllers.
 * Middleware can modify requests, validate data, handle errors, and more.
 * 
 * RESPONSIBILITIES:
 * - Authenticate and authorize requests
 * - Validate request data
 * - Handle errors globally
 * - Log HTTP requests
 * - Parse request bodies
 * - Handle CORS
 * - Rate limiting
 * 
 * FILE EXAMPLES:
 * - authMiddleware.js       → JWT authentication
 * - validationMiddleware.js → Request validation
 * - errorHandler.js         → Global error handling
 * - requestLogger.js        → Request logging
 * - corsMiddleware.js       → CORS configuration
 * - rateLimiter.js          → Rate limiting
 * 
 * MIDDLEWARE STRUCTURE:
 * function authMiddleware(req, res, next) {
 *   try {
 *     const token = req.headers.authorization;
 *     const decoded = jwtService.verify(token);
 *     req.user = decoded;
 *     next(); // Continue to next middleware or controller
 *   } catch (error) {
 *     res.status(401).json({ error: 'Unauthorized' });
 *   }
 * }
 * 
 * MIDDLEWARE TYPES:
 * - Application-level → Applied to all routes
 * - Router-level      → Applied to specific routers
 * - Error-handling    → Handles errors (4 parameters)
 * 
 * COMMON MIDDLEWARE:
 * ✓ Authentication (verify JWT, session)
 * ✓ Authorization (check permissions)
 * ✓ Input validation (validate req.body)
 * ✓ Error handling (global error handler)
 * ✓ Request logging
 * ✓ CORS handling
 * ✓ Rate limiting
 * 
 * DO NOT include:
 * ✗ Business logic (→ application/use-cases)
 * ✗ Route definitions (→ routes)
 * ✗ Controller logic (→ controllers)
 */
