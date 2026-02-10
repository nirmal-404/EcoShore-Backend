/**
 * AUTHENTICATION & AUTHORIZATION INFRASTRUCTURE
 * 
 * Implements authentication and authorization mechanisms.
 * Handles JWT tokens, password hashing, sessions, and access control.
 * 
 * RESPONSIBILITIES:
 * - Implement authentication strategies (JWT, OAuth, etc.)
 * - Handle password hashing and verification
 * - Generate and validate tokens
 * - Implement session management
 * - Provide authorization utilities
 * 
 * FILE EXAMPLES:
 * - JwtService.js       → JWT token generation/validation
 * - PasswordService.js  → Password hashing with bcrypt
 * - AuthStrategy.js     → Passport strategies
 * - TokenRepository.js  → Refresh token storage
 * - RoleChecker.js      → Role-based access control
 * 
 * TYPICAL FILES:
 * ✓ JWT token creation and verification
 * ✓ Password hashing (bcrypt, argon2)
 * ✓ OAuth integration
 * ✓ Session management
 * ✓ API key validation
 * 
 * EXAMPLE CONTENT:
 * class JwtService {
 *   generateToken(payload) {
 *     return jwt.sign(payload, SECRET, { expiresIn: '1h' });
 *   }
 *   
 *   verifyToken(token) {
 *     return jwt.verify(token, SECRET);
 *   }
 * }
 * 
 * SEPARATION OF CONCERNS:
 * - Auth logic (here) → Technical implementation
 * - Auth middleware (interfaces/http/middleware) → HTTP integration
 * - Auth use cases (application/) → Business rules
 * 
 * DO NOT include:
 * ✗ HTTP middleware (→ interfaces/http/middleware)
 * ✗ Route protection logic (→ interfaces/http/middleware)
 * ✗ User business logic (→ domain/entities)
 */
