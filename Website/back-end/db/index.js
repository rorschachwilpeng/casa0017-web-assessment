const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mysql = require("mysql2");

const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  authPluginName: 'mysql_native_password'
};

// Print configuration info (excluding password)
console.log('Database configuration:', {
  host: config.host,
  port: config.port,
  user: config.user,
  database: config.database
});

// Validate configuration
if (!config.host || !config.user || !config.password || !config.database) {
  console.error('Missing required database configuration. Please check your .env file.');
  process.exit(1);
}

// Create connection pool
const pool = mysql.createPool(config);

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Database connection successful!');
  connection.release();
});

// Export promise version of connection pool
module.exports = pool.promise();