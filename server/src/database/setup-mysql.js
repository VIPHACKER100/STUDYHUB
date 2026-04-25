import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    multipleStatements: true
};

async function setupDatabase() {
    let connection;

    try {
        console.log('🔄 Connecting to MySQL server...');

        // Connect without database first
        connection = await mysql.createConnection(DB_CONFIG);
        console.log('✅ Connected to MySQL server');

        const dbName = process.env.DB_NAME || 'studyhub';

        // Create database if it doesn't exist
        console.log(`🔄 Creating database: ${dbName}...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        console.log(`✅ Database ${dbName} created/verified`);

        // Use the database
        await connection.query(`USE ${dbName}`);

        // Read and execute schema
        console.log('🔄 Reading schema file...');
        const schemaPath = path.join(__dirname, 'schema-mysql.sql');
        let schema = fs.readFileSync(schemaPath, 'utf8');

        // Generate password hash for admin user
        console.log('🔄 Generating admin password hash...');
        const adminPassword = 'admin123';
        const passwordHash = await bcrypt.hash(adminPassword, 10);

        // Replace placeholder with actual hash
        schema = schema.replace('$2a$10$YourHashedPasswordHere', passwordHash);

        console.log('🔄 Executing schema...');

        // Split schema into individual statements
        const statements = schema
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('#'));

        for (const statement of statements) {
            try {
                await connection.query(statement);
            } catch (error) {
                // Ignore duplicate entry errors for initial data
                if (!error.message.includes('Duplicate entry')) {
                    console.warn('Warning:', error.message);
                }
            }
        }

        console.log('✅ Schema executed successfully');

        // Verify tables
        const [tables] = await connection.query('SHOW TABLES');
        console.log(`✅ Created ${tables.length} tables`);

        console.log('\n🎉 ════════════════════════════════════════════════════════');
        console.log('   MySQL Database Setup Complete!');
        console.log('  ════════════════════════════════════════════════════════');
        console.log(`\n  📊 Database: ${dbName}`);
        console.log(`  📋 Tables: ${tables.length}`);
        console.log('\n  🔑 Default Admin Credentials:');
        console.log('     Email: viphacker.100.org@gmail.com');
        console.log('     Password: admin123');
        console.log('     ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!\n');
        console.log('  ✅ You can now start the server with: npm run dev\n');

    } catch (error) {
        console.error('\n❌ Error setting up database:', error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Make sure MySQL is installed and running');
        console.error('2. Check your .env file has correct DB credentials');
        console.error('3. Verify DB_PASSWORD is set correctly');
        console.error('4. Try: mysql -u root -p (to test MySQL connection)\n');
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run setup
setupDatabase();

