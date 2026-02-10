/**
 * LOGGING INFRASTRUCTURE
 * 
 * Implements logging functionality using frameworks like Winston or Pino.
 * Provides structured logging for debugging, monitoring, and auditing.
 * 
 * RESPONSIBILITIES:
 * - Configure logging framework (Winston, Pino, etc.)
 * - Define log levels and formats
 * - Set up log transports (console, file, cloud)
 * - Provide logger instances
 * - Implement error tracking integration
 * 
 * FILE EXAMPLES:
 * - logger.js           → Logger configuration and instance
 * - loggerConfig.js     → Logging settings
 * - errorLogger.js      → Error-specific logging
 * - requestLogger.js    → HTTP request logging
 * - performanceLogger.js→ Performance monitoring
 * 
 * TYPICAL SETUP:
 * const winston = require('winston');
 * 
 * const logger = winston.createLogger({
 *   level: 'info',
 *   format: winston.format.json(),
 *   transports: [
 *     new winston.transports.Console(),
 *     new winston.transports.File({ filename: 'error.log', level: 'error' })
 *   ]
 * });
 * 
 * USAGE ACROSS LAYERS:
 * - Import and use logger throughout the application
 * - Log business events, errors, and debugging info
 * - Avoid logging sensitive data (passwords, tokens)
 * 
 * LOG LEVELS:
 * - error   → Critical errors
 * - warn    → Warning messages
 * - info    → General information
 * - debug   → Debugging information
 * - verbose → Detailed logs
 * 
 * DO NOT include:
 * ✗ Business logic
 * ✗ HTTP middleware (use logger in middleware folder)
 */
