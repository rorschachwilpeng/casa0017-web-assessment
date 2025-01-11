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

// 打印配置信息（不包含密码）
console.log('Database configuration:', {
  host: config.host,
  port: config.port,
  user: config.user,
  database: config.database
});

// 验证配置
if (!config.host || !config.user || !config.password || !config.database) {
  console.error('Missing required database configuration. Please check your .env file.');
  process.exit(1);
}

// 创建连接池
const pool = mysql.createPool(config);

// 测试连接
pool.getConnection((err, connection) => {
  if (err) {
    console.error('数据库连接失败:', err);
    return;
  }
  console.log('数据库连接成功!');
  connection.release();
});

// 导出 promise 版本的连接池
module.exports = pool.promise();