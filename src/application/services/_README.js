/**
 * APPLICATION SERVICES
 * 
 * Provides application-level services that support use cases
 * or handle cross-cutting concerns at the application layer.
 * 
 * RESPONSIBILITIES:
 * - Define service interfaces/abstractions
 * - Provide application-level utilities
 * - Handle cross-cutting application concerns
 * - Coordinate complex operations
 * 
 * FILE EXAMPLES:
 * - IEmailService.js       → Email service interface
 * - INotificationService.js→ Notification interface
 * - ValidationService.js   → Input validation logic
 * - EventBus.js           → Application event bus
 * 
 * WHAT GOES HERE:
 * ✓ Service interfaces (abstractions)
 * ✓ Application-level utilities
 * ✓ Domain service implementations
 * ✓ Event handlers
 * 
 * DEPENDENCY INJECTION:
 * Services here should be abstractions (interfaces).
 * Concrete implementations belong in infrastructure layer.
 * 
 * EXAMPLE:
 * // Interface/Abstract class
 * class IEmailService {
 *   async sendEmail(to, subject, body) {
 *     throw new Error('Must be implemented');
 *   }
 * }
 * 
 * DO NOT include:
 * ✗ Concrete infrastructure implementations (→ infrastructure/)
 * ✗ HTTP-specific services (→ interfaces/http)
 * ✗ Database services (→ infrastructure/database)
 */
