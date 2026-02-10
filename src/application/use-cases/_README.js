/**
 * APPLICATION USE CASES
 * 
 * Implements specific application use cases.
 * Each use case represents a single business operation.
 * 
 * RESPONSIBILITIES:
 * - Implement application-specific business logic
 * - Orchestrate domain entities and services
 * - Validate input data
 * - Return structured results
 * - Handle business errors
 * 
 * FILE NAMING CONVENTION:
 * - CreateUser.js
 * - AuthenticateUser.js
 * - UpdateProduct.js
 * - DeleteOrder.js
 * - GetUserProfile.js
 * 
 * TYPICAL USE CASE STRUCTURE:
 * class CreateUser {
 *   constructor(userRepository, emailService) {
 *     // inject dependencies (abstractions, not implementations)
 *   }
 *   async execute(userData) {
 *     // 1. Validate input
 *     // 2. Create domain entity
 *     // 3. Use repository to save
 *     // 4. Trigger side effects (email, events)
 *     // 5. Return result
 *   }
 * }
 * 
 * CHARACTERISTICS:
 * - One use case per file
 * - Framework-independent
 * - Depends on abstractions (interfaces)
 * - Can call other use cases
 * 
 * DO NOT include:
 * ✗ HTTP request parsing (→ controllers)
 * ✗ Database queries (→ repositories)
 * ✗ Direct framework dependencies
 */
