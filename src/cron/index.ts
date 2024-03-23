import schedule from 'node-schedule';
import https from 'https';
import { config } from '../config/keys';

export const pingSchedule = schedule.scheduleJob('*/10 * * * *', function () {
    const options: https.RequestOptions = {
        hostname: config.applicationURLs.serverURL,
        port: config.server.port,
        path: '/',
        method: 'GET'
    };

    const req = https.request(options, (res) => {
        console.log(`Ping response: ${res.statusCode}`);
    });

    req.on('error', (error) => {
        console.error('Error pinging server:', error);
    });

    req.end();
});

console.log('Cron job started: Pinging server every 10 minutes...');
