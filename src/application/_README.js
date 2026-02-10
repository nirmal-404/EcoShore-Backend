/**
 * APPLICATION LAYER (Business Rules)
 * 
 * Contains application-specific business rules and orchestrates
 * the flow of data between domain entities and external systems.
 * 
 * RESPONSIBILITIES:
 * - Implement use cases (application business logic)
 * - Orchestrate domain entities
 * - Define application services
 * - Coordinate between domain and infrastructure
 * 
 * CONTAINS:
 * - use-cases/ → Specific application use cases
 * - services/  → Application-level services
 * 
 * DEPENDENCY RULES:
 * - CAN import from domain layer
 * - CAN define interfaces for infrastructure
 * - CANNOT import concrete implementations from infrastructure
 * - CANNOT import from interfaces layer
 * 
 * KEY PRINCIPLE:
 * This layer is independent of frameworks, UI, and databases.
 * It depends on abstractions, not implementations.
 * 
 * EXAMPLES OF WHAT GOES HERE:
 * ✓ CreateUserUseCase
 * ✓ AuthenticationService
 * ✓ NotificationService interface
 * 
 * EXAMPLES OF WHAT DOES NOT GO HERE:
 * ✗ HTTP controllers (→ interfaces/http/controllers)
 * ✗ Database repositories (→ infrastructure/database/repositories)
 * ✗ Express middleware (→ interfaces/http/middleware)
 */
