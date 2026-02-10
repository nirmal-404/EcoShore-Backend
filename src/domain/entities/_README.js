/**
 * DOMAIN ENTITIES
 * 
 * Business entities representing core domain concepts.
 * These are plain objects/classes with business logic and validation.
 * 
 * RESPONSIBILITIES:
 * - Define the structure of business entities
 * - Implement business validation rules
 * - Contain entity-specific behavior
 * - Ensure data integrity at the domain level
 * 
 * FILE EXAMPLES:
 * - User.js       → User entity with validation
 * - Product.js    → Product entity with pricing logic
 * - Order.js      → Order entity with status management
 * - Payment.js    → Payment entity with transaction rules
 * 
 * CHARACTERISTICS:
 * - Framework-independent
 * - Pure JavaScript classes or factory functions
 * - No external dependencies (DB, HTTP, etc.)
 * - Can reference other domain entities
 * 
 * EXAMPLE STRUCTURE:
 * class User {
 *   constructor(name, email) {
 *     // validation logic
 *   }
 *   changeEmail(newEmail) {
 *     // business rules for email change
 *   }
 * }
 * 
 * DO NOT include:
 * ✗ Database schemas (→ infrastructure/database/models)
 * ✗ HTTP request/response objects
 * ✗ Framework-specific code
 */
