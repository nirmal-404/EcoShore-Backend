/**
 * HTTP CONTROLLERS
 * 
 * Handle HTTP requests and responses.
 * Controllers are thin adapters that convert HTTP requests to use case calls.
 * 
 * RESPONSIBILITIES:
 * - Receive and parse HTTP requests
 * - Extract data from req.body, req.params, req.query
 * - Call appropriate use cases with extracted data
 * - Format use case results as HTTP responses
 * - Handle HTTP-specific errors and status codes
 * - Return JSON responses
 * 
 * FILE NAMING CONVENTION:
 * - UserController.js
 * - ProductController.js
 * - OrderController.js
 * - AuthController.js
 * 
 * TYPICAL STRUCTURE:
 * class UserController {
 *   constructor(createUserUseCase, getUserUseCase) {
 *     this.createUserUseCase = createUserUseCase;
 *     this.getUserUseCase = getUserUseCase;
 *   }
 *   
 *   async createUser(req, res) {
 *     try {
 *       const userData = req.body;
 *       const result = await this.createUserUseCase.execute(userData);
 *       res.status(201).json(result);
 *     } catch (error) {
 *       res.status(400).json({ error: error.message });
 *     }
 *   }
 * }
 * 
 * CONTROLLER RULES:
 * - Keep controllers thin and focused
 * - No business logic in controllers
 * - Delegate to use cases
 * - Handle only HTTP concerns (status codes, headers, etc.)
 * 
 * DO NOT include:
 * ✗ Business logic (→ application/use-cases)
 * ✗ Database queries (→ repositories)
 * ✗ Complex validation (→ use cases or middleware)
 */
