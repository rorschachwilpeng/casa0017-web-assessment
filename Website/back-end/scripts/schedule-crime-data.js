const cron = require('node-cron');
const { spawn } = require('child_process');
const path = require('path');

// 每周一凌晨3点执行
cron.schedule('0 3 * * 1', () => {
    const now = new Date();
    console.log('Starting weekly crime data collection:', now.toISOString());
    console.log('Next execution will be next Monday at 3:00 AM');
    
    const scriptPath = path.join(__dirname, 'collect-crime-data.js');
    const child = spawn('node', [scriptPath], {
        stdio: 'inherit'
    });

    child.on('close', (code) => {
        console.log(`Crime data collection completed with code ${code} at ${new Date().toISOString()}`);
    });
}); 