/**
 * INFRASTRUCTURE LAYER (External Concerns)
 * 
 * Contains implementations for external systems and technical concerns.
 * This is where frameworks, databases, and third-party services are integrated.
 * 
 * RESPONSIBILITIES:
 * - Implement repository interfaces from application layer
 * - Integrate with external services (databases, APIs, etc.)
 * - Handle authentication and authorization mechanisms
 * - Implement logging and monitoring
 * - Manage framework-specific code
 * 
 * CONTAINS:
 * - database/  → Database connections, models, and repositories
 * - auth/      → Authentication and authorization implementations
 * - logging/   → Logging utilities and configurations
 * 
 * DEPENDENCY RULES:
 * - CAN import from domain and application layers
 * - Implements interfaces defined in application layer
 * - Contains concrete implementations of abstractions
 * - CANNOT import from interfaces layer
 * 
 * KEY PRINCIPLE:
 * This layer adapts external tools to our application's needs.
 * All framework-specific code lives here.
 * 
 * EXAMPLES OF WHAT GOES HERE:
 * ✓ MongoDB models and schemas
 * ✓ Repository implementations
 * ✓ JWT authentication logic
 * ✓ Winston logger setup
 * 
 * EXAMPLES OF WHAT DOES NOT GO HERE:
 * ✗ HTTP routes (→ interfaces/http/routes)
 * ✗ Controllers (→ interfaces/http/controllers)
 * ✗ Domain entities (→ domain/entities)
 */
