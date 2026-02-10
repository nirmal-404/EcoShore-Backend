/**
 * SOURCE ROOT DIRECTORY
 * 
 * This is the main source directory for the MERN backend application
 * following Clean Architecture principles.
 * 
 * FOLDER STRUCTURE:
 * - domain/        → Core business entities and types (innermost layer)
 * - application/   → Business logic and use cases
 * - infrastructure/→ External concerns (database, auth, logging)
 * - interfaces/    → Entry points (HTTP APIs, CLI)
 * 
 * DEPENDENCY RULE:
 * Dependencies flow inward: interfaces → application → domain
 * The domain layer should have NO dependencies on outer layers.
 * 
 * DO NOT place executable files directly in this folder.
 * Use the appropriate subdirectory based on responsibility.
 */
