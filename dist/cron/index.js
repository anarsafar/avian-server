"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingSchedule = void 0;
const node_schedule_1 = __importDefault(require("node-schedule"));
const http_1 = __importDefault(require("http"));
const keys_1 = require("../config/keys");
exports.pingSchedule = node_schedule_1.default.scheduleJob('*/10 * * * *', function () {
    const options = {
        hostname: keys_1.config.applicationURLs.serverURL,
        port: keys_1.config.server.port,
        path: '/',
        method: 'GET'
    };
    const req = http_1.default.request(options, (res) => {
        console.log(`Ping response: ${res.statusCode}`);
    });
    req.on('error', (error) => {
        console.error('Error pinging server:', error);
    });
    req.end();
});
console.log('Cron job started: Pinging server every 10 minutes...');
