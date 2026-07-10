import dotenv from 'dotenv';
dotenv.config();

import { sequelize } from '../db/database.js';

async function migrate() {
  try {
    // 1. Authenticate connection
    await sequelize.authenticate();
    console.log("Connected to the database successfully.");

    // 2. Create templates table
    console.log("Creating 'templates' table...");
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS templates (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        thumbnail_url VARCHAR(255),
        category VARCHAR(100) DEFAULT 'General',
        is_premium BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    console.log("Table 'templates' created successfully.");

    // 3. Seed initial templates (use INSERT IGNORE so it won't fail if they already exist)
    console.log("Seeding initial templates...");
    await sequelize.query(`
      INSERT IGNORE INTO templates (id, name, description, category) VALUES
      ('classic', 'Classic', 'A clean, traditional resume format with clear sections and professional typography', 'Classic'),
      ('modern', 'Modern', 'Sleek design with strategic use of color and modern font choices', 'Modern'),
      ('minimal', 'Minimal', 'A clean, simple layout with subtle borders and clean presentation', 'Minimalist'),
      ('minimal-image', 'Minimal Image', 'Minimal design focusing on clean typography and featuring a profile image header', 'Creative'),
      ('executive', 'Executive', 'High-end centered header with elegant spacing and horizontal dividers', 'Professional'),
      ('creative', 'Creative', 'Bold styled left sidebar background, tag-based skills, and modern visual hierarchy', 'Creative'),
      ('modern-right', 'Modern Right', 'A sleek modern layout with a styled sidebar on the right side', 'Modern'),
      ('academic', 'Academic/CV', 'A formal, dense layout designed for academic, research, or detailed history', 'Academic');
    `);
    console.log("Initial templates seeded successfully.");

    // 4. Update legacy template IDs to match new templates table
    console.log("Cleaning up legacy template values in 'resumes' table...");
    await sequelize.query(`
      UPDATE resumes 
      SET template = 'executive' 
      WHERE template = 'professional';
    `);
    console.log("Legacy values cleaned up.");

    // 5. Alter resumes table to add foreign key constraint if it doesn't already exist
    console.log("Adding foreign key constraint to 'resumes' table...");
    // MySQL requires checking if the constraint already exists or safely adding it
    try {
      await sequelize.query(`
        ALTER TABLE resumes 
        ADD CONSTRAINT fk_resume_template 
        FOREIGN KEY (template) REFERENCES templates(id)
        ON UPDATE CASCADE 
        ON DELETE SET DEFAULT;
      `);
      console.log("Foreign key constraint 'fk_resume_template' added successfully.");
    } catch (err) {
      if (err.message.includes("Duplicate key name") || err.message.includes("already exists")) {
        console.log("Constraint already exists, skipping addition.");
      } else {
        throw err;
      }
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await sequelize.close();
    console.log("Database connection closed.");
  }
}

migrate();
