const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../db/index');

// 重试函数
async function retry(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// 获取所有区域号和名称
async function getAllNeighbourhoods() {
  const url = 'https://data.police.uk/api/metropolitan/neighbourhoods';
  console.log("Fetching neighbourhoods from:", url);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch neighbourhoods. Status: ${response.status}`);
  }

  const data = await response.json();
  console.log(`Successfully fetched ${data.length} neighbourhoods`);
  return data;
}

// 获取某个区域的中心经纬度
async function getNeighbourhoodCentre(id) {
  const url = `https://data.police.uk/api/metropolitan/${id}`;
  console.log(`Fetching centre for neighbourhood ID: ${id}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch centre for ID ${id}. Status: ${response.status}`);
  }

  const data = await response.json();
  console.log(`Successfully fetched centre for ${id}`);
  return data.centre;
}

// 获取犯罪数据
async function getCrimeData(latitude, longitude) {
  const url = `https://data.police.uk/api/crimes-street/all-crime?lat=${latitude}&lng=${longitude}`;
  console.log(`Fetching crime data for location (${latitude}, ${longitude})`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch crime data. Status: ${response.status}`);
  }

  const data = await response.json();
  console.log(`Found ${data.length} crimes at location`);
  return data.length;
}

// 保存到数据库
async function saveCrimeData(data) {
  const sql = `
    INSERT INTO crimes 
      (neighbourhood_id, neighbourhood_name, latitude, longitude, crime_count) 
    VALUES 
      (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      crime_count = VALUES(crime_count),
      updated_at = CURRENT_TIMESTAMP
  `;

  const params = [
    data.neighbourhood_id,
    data.neighbourhood_name,
    data.latitude,
    data.longitude,
    data.crime_count
  ];

  try {
    const [result] = await db.query(sql, params);
    console.log(`Saved/Updated crime data for ${data.neighbourhood_name}`);
    return result;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

// 主函数
async function collectCrimeData() {
  console.log('Starting crime data collection...');
  try {
    // 获取所有区域
    const neighbourhoods = await retry(() => getAllNeighbourhoods());
    console.log(`Processing ${neighbourhoods.length} neighbourhoods...`);

    // 处理每个区域
    for (const neighbourhood of neighbourhoods) {
      try {
        console.log(`Processing ${neighbourhood.name}...`);
        
        // 获取中心坐标
        const centre = await retry(() => getNeighbourhoodCentre(neighbourhood.id));
        if (!centre) {
          console.log(`Skipping ${neighbourhood.name} - no centre coordinates`);
          continue;
        }

        // 获取犯罪数据
        const crimeCount = await retry(() => getCrimeData(centre.latitude, centre.longitude));

        // 保存到数据库
        await retry(() => saveCrimeData({
          neighbourhood_id: neighbourhood.id,
          neighbourhood_name: neighbourhood.name,
          latitude: centre.latitude,
          longitude: centre.longitude,
          crime_count: crimeCount
        }));

        // 添加延迟以避免API限制
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error processing ${neighbourhood.name}:`, error);
        // 继续处理下一个区域
        continue;
      }
    }

    console.log('Crime data collection completed successfully');
  } catch (error) {
    console.error('Crime data collection failed:', error);
  } finally {
    // 关闭数据库连接
    await db.end();
  }
}

// 添加 fetch polyfill (Node.js < 18)
if (!global.fetch) {
  global.fetch = require('node-fetch');
}

// 运行脚本
collectCrimeData(); 