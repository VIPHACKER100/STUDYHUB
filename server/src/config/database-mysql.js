import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root if available
dotenv.config({ path: path.join(__dirname, '../../../.env') });
dotenv.config(); // fallback to default

// MySQL connection pool
let poolConfig;
if (process.env.DATABASE_URL) {
    // Parse DATABASE_URL (e.g., mysql://user:pass@host:port/dbname)
    const url = new URL(process.env.DATABASE_URL);
    poolConfig = {
        host: url.hostname,
        port: Number(url.port) || 3306,
        database: url.pathname.replace(/^\//, ''),
        user: url.username,
        password: url.password,
        waitForConnections: true,
        connectionLimit: 20,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        // Ensure SSL if Railway requires it (optional)
        ssl: {
            rejectUnauthorized: false
        }
    };
} else {
    poolConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        database: process.env.DB_NAME || 'studyhub',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        waitForConnections: true,
        connectionLimit: 20,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
    };
}
const pool = mysql.createPool(poolConfig);

// Test database connection
pool.getConnection()
    .then(connection => {
        console.log('✅ Connected to MySQL database');
        connection.release();
    })
    .catch(err => {
        console.error('❌ MySQL connection failed:', err.message);
        if (process.env.NODE_ENV !== 'test') {
            process.exit(-1);
        }
    });

// Helper function to execute queries
export const query = async (text, params) => {
    const start = Date.now();
    try {
        const [rows] = await pool.execute(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: rows.length || rows.affectedRows });
        return { rows, rowCount: rows.length || rows.affectedRows };
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

// Helper function to get a connection from the pool
export const getClient = async () => {
    const connection = await pool.getConnection();

    const query = async (text, params) => {
        const [rows] = await connection.execute(text, params);
        return { rows, rowCount: rows.length || rows.affectedRows };
    };

    const release = () => {
        connection.release();
    };

    return { query, release };
};

export { pool };
export default pool;
