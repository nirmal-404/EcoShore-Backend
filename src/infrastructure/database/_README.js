/**
 * DATABASE INFRASTRUCTURE
 * 
 * Handles all database-related concerns including connections,
 * schemas, models, and data access patterns.
 * 
 * RESPONSIBILITIES:
 * - Manage database connections
 * - Define database schemas and models
 * - Implement repository interfaces
 * - Handle database migrations
 * - Provide database utilities
 * 
 * CONTAINS:
 * - models/       → Database schemas (Mongoose models for MongoDB)
 * - repositories/ → Repository implementations (data access layer)
 * 
 * Additional files that may go here:
 * - connection.js → Database connection setup
 * - config.js     → Database configuration
 * - migrations/   → Database migration scripts (if needed)
 * 
 * DATABASE LAYER PATTERN:
 * 1. Models define the structure (schema)
 * 2. Repositories implement data access logic
 * 3. Use cases/services depend on repositories, not models directly
 * 
 * EXAMPLE:
 * // In use case
 * const user = await userRepository.findById(id); // ✓ Abstract
 * // NOT: const user = await UserModel.findById(id); // ✗ Concrete
 * 
 * DO NOT include:
 * ✗ Business logic (→ domain/ or application/)
 * ✗ HTTP-related code (→ interfaces/http)
 * ✗ Domain entities (→ domain/entities)
 */
