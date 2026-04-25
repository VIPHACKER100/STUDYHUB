
import { pool, query } from './src/config/database-mysql.js';

async function run() {
    console.log('Running SHOW TABLES...');
    try {
        const result = await query('SHOW TABLES');
        console.log('Tables found:');
        console.table(result.rows);
    } catch (err) {
        console.error('Query failed:', err.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

run();

