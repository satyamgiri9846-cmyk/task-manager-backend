import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// SQLite stores the whole database in a single file on disk.
// Good for learning/dev - no separate DB server needed to run this.
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false, // set to console.log if you want to see raw SQL queries
});

/**
 * Call this once when the server starts.
 * It opens the connection and verifies it works.
 */
export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
}
