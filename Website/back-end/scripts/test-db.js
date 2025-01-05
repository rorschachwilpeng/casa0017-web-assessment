const db = require('../db/index');

async function testDatabaseConnection() {
  try {
    // 测试电影表查询
    console.log('\n=== 测试电影表查询 ===');
    const [movies] = await db.query('SELECT * FROM movies');
    console.log('电影数量:', movies.length);
    if (movies.length > 0) {
      console.log('示例电影:', movies[0]);
    }

    // 测试影院表查询
    console.log('\n=== 测试影院表查询 ===');
    const [cinemas] = await db.query('SELECT * FROM cinemas');
    console.log('影院数量:', cinemas.length);
    if (cinemas.length > 0) {
      console.log('示例影院:', cinemas[0]);
    }

    // 测试放映表查询
    console.log('\n=== 测试放映表查询 ===');
    const [screenings] = await db.query('SELECT * FROM screenings');
    console.log('放映数量:', screenings.length);
    if (screenings.length > 0) {
      console.log('示例放映:', screenings[0]);
    }

    // 测试连接电影和影院的查询
    console.log('\n=== 测试连接查询 ===');
    const [results] = await db.query(`
      SELECT DISTINCT 
        c.cinema_id, 
        c.name,
        GROUP_CONCAT(s.show_time) as screening_times
      FROM cinemas c
      JOIN screenings s ON c.cinema_id = s.cinema_id
      WHERE s.movie_id = 1
      GROUP BY c.cinema_id
    `);
    console.log('查询结果数量:', results.length);
    if (results.length > 0) {
      console.log('示例结果:', results[0]);
    }

    process.exit(0);
  } catch (error) {
    console.error('数据库测试失败:', error);
    process.exit(1);
  }
}

async function testDatabaseStructure() {
  try {
    console.log('\n=== 检查数据库表结构 ===');
    
    // 检查 cinemas 表结构
    console.log('\n=== cinemas 表结构 ===');
    const [cinemaColumns] = await db.query('SHOW COLUMNS FROM cinemas');
    console.log(cinemaColumns);
    
    // 检查 crimes 表结构
    console.log('\n=== crimes 表结构 ===');
    const [crimeColumns] = await db.query('SHOW COLUMNS FROM crimes');
    console.log(crimeColumns);
    
    // 检查 screenings 表结构
    console.log('\n=== screenings 表结构 ===');
    const [screeningColumns] = await db.query('SHOW COLUMNS FROM screenings');
    console.log(screeningColumns);

    // 检查每个表的示例数据
    console.log('\n=== cinemas 表示例数据 ===');
    const [cinemas] = await db.query('SELECT * FROM cinemas LIMIT 1');
    console.log(cinemas[0]);

    console.log('\n=== crimes 表示例数据 ===');
    const [crimes] = await db.query('SELECT * FROM crimes LIMIT 1');
    console.log(crimes[0]);

    console.log('\n=== screenings 表示例数据 ===');
    const [screenings] = await db.query('SELECT * FROM screenings LIMIT 1');
    console.log(screenings[0]);

  } catch (error) {
    console.error('数据库测试失败:', error);
  } finally {
    await db.end();
  }
}

testDatabaseConnection();
testDatabaseStructure(); 