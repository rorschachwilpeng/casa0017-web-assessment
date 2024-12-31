const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../db/index');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // 测试查询
    const [results] = await db.query('SELECT 1 + 1 AS result');
    console.log('Test query successful:', results);
    
    // 检查 crimes 表
    const [tables] = await db.query('SHOW TABLES LIKE "crimes"');
    console.log('Crimes table exists:', tables.length > 0);
    
    // 关闭连接池
    await db.end();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testConnection(); 