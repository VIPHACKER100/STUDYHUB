import pool from '../config/database.js';

async function updateDatabase() {
    const client = await pool.connect();

    try {
        console.log('🚀 Starting database update...');

        console.log('Creating blocked_users table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS blocked_users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                blocker_id UUID REFERENCES users(id) ON DELETE CASCADE,
                blocked_id UUID REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(blocker_id, blocked_id)
            );
        `);

        console.log('✅ Database update completed successfully!');

    } catch (error) {
        console.error('❌ Error updating database:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

updateDatabase();
