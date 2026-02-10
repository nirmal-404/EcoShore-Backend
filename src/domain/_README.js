/**
 * DOMAIN LAYER (Core Business Logic)
 * 
 * This is the innermost layer of Clean Architecture.
 * Contains enterprise-wide business rules and entities.
 * 
 * RESPONSIBILITIES:
 * - Define core business entities and their behavior
 * - Define domain types and interfaces
 * - Contain pure business logic with no external dependencies
 * 
 * CONTAINS:
 * - entities/  → Business entities (User, Product, Order, etc.)
 * - types/     → Domain type definitions and interfaces
 * 
 * RULES:
 * - Must be framework-agnostic
 * - NO imports from application, infrastructure, or interfaces layers
 * - NO database, HTTP, or external service dependencies
 * - Only pure JavaScript/TypeScript logic
 * 
 * EXAMPLES OF WHAT GOES HERE:
 * ✓ User entity with validation logic
 * ✓ Order entity with business rules
 * ✓ Domain-specific type definitions
 * 
 * EXAMPLES OF WHAT DOES NOT GO HERE:
 * ✗ Database models (→ infrastructure/database/models)
 * ✗ API controllers (→ interfaces/http/controllers)
 * ✗ Use cases (→ application/use-cases)
 */
