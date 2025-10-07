import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...');

    // Read schema file
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf8'
    );

    // Read seed file
    const seedSQL = fs.readFileSync(
      path.join(__dirname, 'seed.sql'),
      'utf8'
    );

    // Execute schema
    console.log('📋 Creating tables...');
    await pool.query(schemaSQL);
    console.log('✅ Tables created successfully');

    // Execute seed data
    console.log('🌱 Seeding data...');
    await pool.query(seedSQL);
    console.log('✅ Data seeded successfully');

    // Verify
    const result = await pool.query('SELECT COUNT(*) FROM events');
    console.log(`✅ Database setup complete! ${result.rows[0].count} events loaded.`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();