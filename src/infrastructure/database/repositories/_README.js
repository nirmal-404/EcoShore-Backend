/**
 * DATABASE REPOSITORIES
 * 
 * Implements repository interfaces defined in the application layer.
 * Handles all data access operations and database queries.
 * 
 * RESPONSIBILITIES:
 * - Implement repository interfaces from application layer
 * - Perform CRUD operations
 * - Execute complex database queries
 * - Map between database models and domain entities
 * - Handle database transactions
 * 
 * FILE EXAMPLES:
 * - UserRepository.js    → User data access implementation
 * - ProductRepository.js → Product data access implementation
 * - OrderRepository.js   → Order data access implementation
 * 
 * TYPICAL STRUCTURE:
 * class UserRepository {
 *   async findById(id) {
 *     const userDoc = await UserModel.findById(id);
 *     return this.toDomainEntity(userDoc);
 *   }
 *   
 *   async save(userEntity) {
 *     const userData = this.toDatabase(userEntity);
 *     const doc = await UserModel.create(userData);
 *     return this.toDomainEntity(doc);
 *   }
 *   
 *   toDomainEntity(doc) {
 *     // Convert DB model to domain entity
 *   }
 * }
 * 
 * KEY PRINCIPLES:
 * - Repositories are the ONLY place that imports database models
 * - Converts between database models and domain entities
 * - Returns domain entities, not database documents
 * - Accepts domain entities as parameters
 * 
 * DO NOT include:
 * ✗ Business logic (→ application/use-cases)
 * ✗ HTTP request handling (→ interfaces/http/controllers)
 * ✗ Domain entity definitions (→ domain/entities)
 */
