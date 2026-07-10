import dotenv from 'dotenv';
dotenv.config();

import { sequelize } from '../db/database.js';

async function check() {
  try {
    await sequelize.authenticate();
    console.log("Database connection OK");

    // 1. Get existing template counts in resumes
    const [resumeTemplates] = await sequelize.query(`
      SELECT template, COUNT(*) as count FROM resumes GROUP BY template;
    `);
    console.log("Current template values in resumes table:", resumeTemplates);

    // 2. Get seeded templates
    const [seededTemplates] = await sequelize.query(`
      SELECT id, name FROM templates;
    `);
    console.log("Seeded templates in templates table:", seededTemplates);

    // 3. Try to add the constraint and print the error
    try {
      console.log("Attempting to add constraint...");
      await sequelize.query(`
        ALTER TABLE resumes 
        ADD CONSTRAINT fk_resume_template 
        FOREIGN KEY (template) REFERENCES templates(id)
        ON UPDATE CASCADE 
        ON DELETE SET DEFAULT;
      `);
      console.log("Constraint added successfully!");
    } catch (err) {
      console.error("Constraint addition failed with error:", err.message);
    }
  } catch (error) {
    console.error("Check failed:", error);
  } finally {
    await sequelize.close();
  }
}

check();
