/**
 * PostgreSQL database connection configuration
 * Using pg package to connect to NeonDB
 */
import pkg from 'pg';
const { Pool } = pkg;
import configuration from '../config/configuration.js';

// Load environment configuration
const config = configuration();

// Initialize connection pool with database credentials
const pool = new Pool({
    user: config.DATABASE.USER,
    host: config.DATABASE.HOST,
    password: config.DATABASE.PASSWORD,
    database: config.DATABASE.NAME,
    port: 5432,
    ssl: {
        rejectUnauthorized: false // Required for NeonDB SSL
    }
});

/**
 * Establishes connection to PostgreSQL database
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 * @throws {Error} If connection fails
 */
const connectDB = async () => {
    try {
        // Attempt to connect to database
        const client = await pool.connect();
        console.log(`🔥🔥 NeonDB connection SUCCESS 🔥🔥`);
        client.release();
    } catch (error) {
        // Log error and exit process if connection fails
        console.error(`❌ NeonDB connection FAILED: ${error.message}`);
        process.exit(1);
    }
};

export {
    connectDB,
    pool
};