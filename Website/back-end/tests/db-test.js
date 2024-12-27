const db = require('../db/index');

// 测试数据库连接
console.log('正在测试数据库连接...');

// 执行测试查询
const testQuery = 'SELECT * FROM casa0017.casa0017Moives;';

db.query(testQuery, (err, results) => {
    if (err) {
        console.error('数据库连接测试失败！');
        console.error('错误信息:', err.message);
        return;
    }
    
    console.log('数据库连接测试成功！');
    console.log('查询结果数量:', results.length);
    console.log('\n所有查询结果:');
    results.forEach((row, index) => {
        console.log(`\n记录 ${index + 1}:`, row);
    });
    
    // 完成测试后关闭连接
    db.end((err) => {
        if (err) {
            console.error('关闭数据库连接时出错:', err);
            return;
        }
        console.log('数据库连接已关闭');
    });
}); 