"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const keys_1 = require("./config/keys");
const app_1 = __importDefault(require("./app"));
const cleanup_service_1 = require("./services/cleanup.service");
const socket_1 = require("./socket");
mongoose_1.default
    .connect(keys_1.config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
    console.log('MongoDB connected successfully');
    const server = require('http').Server(app_1.default);
    (0, socket_1.initSocket)(server);
    server.listen(keys_1.config.server.port, () => {
        console.log(`Server is running on port ${keys_1.config.server.port}`);
        (0, cleanup_service_1.scheduler)();
    });
})
    .catch((err) => console.error(err));
//# sourceMappingURL=server.js.map