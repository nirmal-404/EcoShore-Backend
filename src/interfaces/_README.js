/**
 * INTERFACES LAYER (External Interfaces)
 * 
 * Entry points for external actors to interact with the application.
 * This is the outermost layer that handles communication protocols.
 * 
 * RESPONSIBILITIES:
 * - Handle HTTP requests and responses
 * - Define API routes and endpoints
 * - Implement middleware
 * - Provide CLI interfaces
 * - Convert external data formats to application format
 * 
 * CONTAINS:
 * - http/ → HTTP/REST API interface (Express routes, controllers, middleware)
 * - cli/  → Command-line interface scripts
 * 
 * DEPENDENCY RULES:
 * - CAN import from all other layers
 * - Depends on application use cases
 * - Adapts external requests to application format
 * - Converts application results to external format
 * 
 * KEY PRINCIPLE:
 * This layer is responsible for delivery mechanisms.
 * It receives requests, delegates to use cases, and formats responses.
 * 
 * EXAMPLES OF WHAT GOES HERE:
 * ✓ Express routes and controllers
 * ✓ Request validation middleware
 * ✓ CLI commands
 * ✓ GraphQL resolvers (if applicable)
 * 
 * EXAMPLES OF WHAT DOES NOT GO HERE:
 * ✗ Business logic (→ application/use-cases)
 * ✗ Domain entities (→ domain/entities)
 * ✗ Database operations (→ infrastructure/database)
 */
