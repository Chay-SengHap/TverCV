import dotenv from 'dotenv';
dotenv.config();

import { sequelize } from '../db/database.js';

async function countRows() {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful to:", process.env.DB_HOST);

    // List of tables in the database
    const tables = [
      'users',
      'resumes',
      'personal_info',
      'experience',
      'education',
      'projects',
      'skills',
      'templates'
    ];

    console.log("\n=== Table Row Counts ===");
    for (const table of tables) {
      try {
        const [[result]] = await sequelize.query(`SELECT COUNT(*) as count FROM \`${table}\`;`);
        console.log(`- ${table}: ${result.count} rows`);
      } catch (err) {
        console.log(`- ${table}: (Table does not exist or error: ${err.message})`);
      }
    }
  } catch (error) {
    console.error("Failed to connect or query database:", error.message);
  } finally {
    await sequelize.close();
  }
}

countRows();
