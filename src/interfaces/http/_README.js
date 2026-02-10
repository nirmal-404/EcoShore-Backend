/**
 * HTTP INTERFACE
 * 
 * Handles HTTP/REST API interactions using Express.js (or similar framework).
 * This is where the web API is defined and implemented.
 * 
 * RESPONSIBILITIES:
 * - Define HTTP routes and endpoints
 * - Handle HTTP requests and responses
 * - Implement HTTP-specific middleware
 * - Validate and sanitize request data
 * - Format responses (JSON, status codes, headers)
 * 
 * CONTAINS:
 * - controllers/ → Request handlers that call use cases
 * - routes/      → Route definitions and endpoint mappings
 * - middleware/  → Express middleware (auth, validation, error handling)
 * 
 * Additional files that may go here:
 * - app.js       → Express app configuration
 * - server.js    → HTTP server setup
 * 
 * REQUEST FLOW:
 * 1. Request arrives at route
 * 2. Middleware processes it (auth, validation)
 * 3. Controller receives validated request
 * 4. Controller calls appropriate use case
 * 5. Controller formats and returns response
 * 
 * EXAMPLE STRUCTURE:
 * Route (/api/users) → Middleware (auth) → Controller → Use Case → Response
 * 
 * DO NOT include:
 * ✗ Business logic (→ application/use-cases)
 * ✗ Database queries (→ infrastructure/database/repositories)
 * ✗ Domain entities (→ domain/entities)
 */
