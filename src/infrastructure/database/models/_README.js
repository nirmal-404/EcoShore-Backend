/**
 * DATABASE MODELS
 * 
 * Contains database schemas and models (Mongoose schemas for MongoDB).
 * These define the structure of data as stored in the database.
 * 
 * RESPONSIBILITIES:
 * - Define database schemas
 * - Configure model properties and validations
 * - Define database indexes
 * - Set up model hooks (pre/post save, etc.)
 * - Handle database-level constraints
 * 
 * FILE EXAMPLES:
 * - UserModel.js     → Mongoose User schema
 * - ProductModel.js  → Mongoose Product schema
 * - OrderModel.js    → Mongoose Order schema
 * 
 * TYPICAL STRUCTURE:
 * const mongoose = require('mongoose');
 * 
 * const userSchema = new mongoose.Schema({
 *   email: { type: String, required: true, unique: true },
 *   name: { type: String, required: true },
 *   createdAt: { type: Date, default: Date.now }
 * });
 * 
 * module.exports = mongoose.model('User', userSchema);
 * 
 * IMPORTANT DISTINCTION:
 * - Models (here)     → Database structure and ORM mappings
 * - Entities (domain) → Business logic and validation
 * - Repositories      → Data access operations
 * 
 * ACCESS PATTERN:
 * Models should be accessed ONLY through repositories,
 * not directly from use cases or services.
 * 
 * DO NOT include:
 * ✗ Business logic (→ domain/entities)
 * ✗ Data access operations (→ repositories)
 * ✗ Complex queries (→ repositories)
 */
