/**
 * COMMAND-LINE INTERFACE (CLI)
 * 
 * Provides command-line tools and scripts for administrative tasks,
 * maintenance operations, and automation.
 * 
 * RESPONSIBILITIES:
 * - Implement CLI commands
 * - Handle command-line arguments
 * - Execute administrative tasks
 * - Provide development utilities
 * - Enable scripting and automation
 * 
 * FILE EXAMPLES:
 * - seedDatabase.js     → Seed database with initial data
 * - migrateData.js      → Run data migrations
 * - createAdmin.js      → Create admin user
 * - generateReport.js   → Generate reports
 * - clearCache.js       → Clear application cache
 * - syncUsers.js        → Sync users from external system
 * 
 * TYPICAL CLI SCRIPT:
 * // seedDatabase.js
 * const SeedDatabaseUseCase = require('../../application/use-cases/SeedDatabase');
 * 
 * async function main() {
 *   try {
 *     const args = process.argv.slice(2);
 *     const seedUseCase = new SeedDatabaseUseCase();
 *     await seedUseCase.execute();
 *     console.log('Database seeded successfully');
 *     process.exit(0);
 *   } catch (error) {
 *     console.error('Error:', error.message);
 *     process.exit(1);
 *   }
 * }
 * 
 * main();
 * 
 * USAGE EXAMPLES:
 * node src/interfaces/cli/seedDatabase.js
 * npm run seed
 * npm run migrate
 * 
 * CLI BEST PRACTICES:
 * - Parse command-line arguments properly
 * - Provide help messages
 * - Handle errors gracefully
 * - Use proper exit codes
 * - Delegate to use cases (don't put logic here)
 * 
 * DO NOT include:
 * ✗ Business logic (→ application/use-cases)
 * ✗ Database queries (→ repositories)
 * ✗ HTTP-related code (→ http/)
 */
