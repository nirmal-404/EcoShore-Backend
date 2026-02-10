/**
 * DOMAIN TYPES
 * 
 * Type definitions, enums, and interfaces for domain concepts.
 * Defines the contracts and data structures used throughout the domain.
 * 
 * RESPONSIBILITIES:
 * - Define domain-specific types and interfaces
 * - Define enums for domain constants
 * - Define value objects
 * - Establish contracts for domain operations
 * 
 * FILE EXAMPLES:
 * - UserTypes.js      → User-related type definitions
 * - OrderStatus.js    → Order status enum
 * - PaymentMethod.js  → Payment method constants
 * - Address.js        → Address value object
 * 
 * WHAT GOES HERE:
 * ✓ Enums (ORDER_STATUS, USER_ROLE, etc.)
 * ✓ Type definitions/JSDoc types
 * ✓ Value objects (Email, Money, Address)
 * ✓ Domain interfaces
 * ✓ Domain constants
 * 
 * EXAMPLE CONTENT:
 * const USER_ROLE = {
 *   ADMIN: 'admin',
 *   USER: 'user',
 *   GUEST: 'guest'
 * };
 * 
 * DO NOT include:
 * ✗ API request/response types (→ interfaces/http)
 * ✗ Database schema types (→ infrastructure/database)
 * ✗ Configuration types
 */
