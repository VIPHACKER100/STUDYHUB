import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Database setup script
 * Creates all tables, indexes, triggers, and initial data
 */
async function setupDatabase() {
    const client = await pool.connect();

    try {
        console.log('🚀 Starting database setup...\n');

        // Read schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        let schema = fs.readFileSync(schemaPath, 'utf8');

        // Generate actual password hash for admin user
        const adminPassword = 'admin123'; // CHANGE THIS IN PRODUCTION
        const passwordHash = await bcrypt.hash(adminPassword, 10);

        // Replace placeholder with actual hash
        schema = schema.replace('$2a$10$YourHashedPasswordHere', passwordHash);

        console.log('📝 Executing schema...');
        await client.query(schema);

        console.log('\n✅ Database setup completed successfully!\n');
        console.log('📊 Created tables:');
        console.log('   - users');
        console.log('   - verification_tokens');
        console.log('   - password_reset_tokens');
        console.log('   - uploads');
        console.log('   - upload_ratings');
        console.log('   - downloads');
        console.log('   - bookmarks');
        console.log('   - reports');
        console.log('   - direct_conversations');
        console.log('   - direct_messages');
        console.log('   - anonymous_rooms');
        console.log('   - anonymous_messages');
        console.log('   - anonymous_sessions');
        console.log('   - message_reactions');
        console.log('   - notifications');
        console.log('   - notification_preferences');
        console.log('   - message_preferences');
        console.log('   - announcements');
        console.log('   - system_settings');
        console.log('   - activity_log');
        console.log('\n🔐 Default admin credentials:');
        console.log('   Email: admin@notesplatform.com');
        console.log('   Password: admin123');
        console.log('   ⚠️  PLEASE CHANGE THIS PASSWORD IN PRODUCTION!\n');

    } catch (error) {
        console.error('❌ Error setting up database:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    setupDatabase()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}

export default setupDatabase;
